import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const str=(...values:any[])=>{for(const v of values)if(typeof v==="string"&&v.trim())return v.trim();return ""};
const cents=(v:any)=>{if(typeof v==="number")return Math.round(v*100);if(typeof v==="string"){const n=Number(v.replace(/[R$\s]/g,"").replace(/\./g,"").replace(",","."));return Number.isFinite(n)?Math.round(n*100):0}return 0};
export async function POST(req:Request) {
 const secret=process.env.KIWIFY_WEBHOOK_SECRET;
 const url=new URL(req.url);
 const provided=url.searchParams.get("secret")||req.headers.get("x-kiwify-secret")||req.headers.get("x-webhook-secret");
 if(!secret||!provided||provided!==secret)return NextResponse.json({error:"Webhook não autorizado."},{status:401});
 try {
  const body=await req.json();
  const data=body?.data||body?.order||body?.data?.order||body;
  const event=str(body?.event,body?.webhook_event_type,body?.type,data?.status).toLowerCase();
  const externalId=str(data?.order_id,data?.id,data?.subscription_id,body?.order_id);
  if(!externalId)return NextResponse.json({error:"Evento sem identificador de pedido."},{status:400});
  const statusRaw=str(data?.status,body?.status,event).toLowerCase();
  const approved=/paid|approved|completed|order_approved|compra_aprovada|pix_paid/.test(statusRaw);
  const refunded=/refund|chargeback|cancel|reembols|chargedback/.test(statusRaw);
  const status=refunded?(statusRaw.includes("charge")?"chargeback":"refunded"):approved?"paid":statusRaw||"pending";
  const productName=str(data?.Product?.product_name,data?.product?.name,data?.product_name,data?.product?.product_name,body?.product_name,"Produto Kiwify");
  const email=str(data?.Customer?.email,data?.customer?.email,data?.customer_email,data?.email);
  const customerName=str(data?.Customer?.full_name,data?.customer?.name,data?.customer_name,data?.name);
  const amountCents=cents(data?.Commissions?.charge_amount||data?.amount||data?.total||data?.value||data?.price||0);
  const approvedAt=approved?new Date(str(data?.approved_at,data?.created_at,body?.created_at)||Date.now()):null;
  const product=await prisma.product.findFirst({where:{OR:[{name:{equals:productName,mode:"insensitive"}},{slug:{equals:productName,mode:"insensitive"}}]}});
  const previous=await prisma.kiwifyOrder.findUnique({where:{externalId}});
  const order=await prisma.kiwifyOrder.upsert({
   where:{externalId},
   create:{externalId,status,customerName,customerEmail:email,productName,amountCents,currency:str(data?.currency,"BRL"),approvedAt,rawPayload:body,productId:product?.id},
   update:{status,customerName,customerEmail:email,productName,amountCents,currency:str(data?.currency,"BRL"),approvedAt,rawPayload:body,productId:product?.id}
  });
  if(product&&approved&&previous?.status!=="paid")await prisma.product.update({where:{id:product.id},data:{unitsSold:{increment:1},stock:{decrement:product.stock>0?1:0}}});
  if(product&&refunded&&previous?.status==="paid")await prisma.product.update({where:{id:product.id},data:{unitsSold:{decrement:1}}});
  return NextResponse.json({ok:true,orderId:order.id});
 } catch(e:any) { return NextResponse.json({error:"Não foi possível processar o webhook.",detail:process.env.NODE_ENV==="development"?e.message:undefined},{status:500}); }
}
