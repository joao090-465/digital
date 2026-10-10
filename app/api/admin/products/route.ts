import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { z } from "zod";
export const dynamic = "force-dynamic";
const schema=z.object({name:z.string().trim().min(1).max(160),description:z.string().max(5000).optional().default(""),category:z.string().max(100).optional().default("Digital"),imageUrl:z.string().max(2000).optional().default(""),priceCents:z.number().int().min(0),costCents:z.number().int().min(0).optional().default(0),stock:z.number().int().min(0).optional().default(0),rating:z.number().min(0).max(5).optional().default(5),reviews:z.number().int().min(0).optional().default(0),checkoutUrl:z.string().max(2000).optional().default(""),active:z.boolean().optional().default(true)});
export async function GET(){if(!(await isAdmin()))return NextResponse.json({error:"Não autorizado."},{status:401});return NextResponse.json({products:await prisma.product.findMany({orderBy:{createdAt:"desc"}})})}
export async function POST(req:Request){if(!(await isAdmin()))return NextResponse.json({error:"Não autorizado."},{status:401});try{const data=schema.parse(await req.json());let slug=slugify(data.name);if(await prisma.product.findUnique({where:{slug}}))slug=`${slug}-${Date.now().toString().slice(-6)}`;const product=await prisma.product.create({data:{...data,slug}});return NextResponse.json({product},{status:201})}catch(e:any){return NextResponse.json({error:e?.issues?.[0]?.message||e.message||"Dados inválidos."},{status:400})}}
