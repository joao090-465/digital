import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
 if (!(await isAdmin())) return NextResponse.json({error:"Não autorizado."},{status:401});
 const now=new Date(); const start=new Date(now.getFullYear(),now.getMonth()-5,1);
 const rows=await prisma.kiwifyOrder.findMany({where:{status:{in:["paid","approved","completed","order_approved"]},approvedAt:{gte:start}},select:{amountCents:true,approvedAt:true}});
 const data=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return {label:d.toLocaleDateString("pt-BR",{month:"short"}).replace(".",""),value:rows.filter(o=>o.approvedAt&&o.approvedAt.getFullYear()===d.getFullYear()&&o.approvedAt.getMonth()===d.getMonth()).reduce((s,o)=>s+o.amountCents,0)}});
 return NextResponse.json({data,updatedAt:now.toISOString()},{headers:{"Cache-Control":"no-store, max-age=0"}});
}
