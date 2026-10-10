import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import ProductManager from "./product-manager";
export const dynamic = "force-dynamic";
export default async function ProductsAdminPage() {
 let products:any[]=[];try{products=await prisma.product.findMany({orderBy:{createdAt:"desc"}})}catch{}
 const safe=products.map(p=>({...p,createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString()}));
 return <><div className="admin-top"><div><div className="eyebrow">Catálogo e inventário</div><h1>Produtos</h1><p>Gerencie preços, estoque, custo, checkout e publicação.</p></div><Link className="pill" href="/" target="_blank">Ver site público ↗</Link></div><div className="notice">Preencha o link de checkout da Kiwify para habilitar a compra. O estoque é informativo para produtos digitais; a baixa automática depende do vínculo entre o evento da Kiwify e o produto cadastrado.</div><ProductManager initialProducts={safe}/></>;
}
