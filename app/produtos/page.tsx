import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
export const dynamic = "force-dynamic";
export default async function ProductsPage() {
  let products: any[] = [];
  try { products = await prisma.product.findMany({where:{active:true},orderBy:{createdAt:"desc"}}); } catch {}
  return <main><header className="shell topbar"><Link href="/" className="brand"><span className="brand-mark">L</span><span>LINHO <span style={{color:"var(--gold)"}}>HOLDINGS</span></span></Link><Link href="/" className="pill">← VOLTAR AO INÍCIO</Link></header>
  <section className="shell section"><div className="eyebrow">Catálogo oficial</div><h1 style={{fontFamily:"Manrope",fontSize:42,margin:"12px 0"}}>Produtos digitais</h1><p className="muted" style={{maxWidth:620,lineHeight:1.8}}>Explore as soluções disponíveis. A compra é concluída na página segura de checkout de cada produto.</p>
  {products.length ? <div className="product-grid" style={{marginTop:30}}>{products.map(p=><article className="product-card" key={p.id}><div className="product-image">{p.imageUrl?<img src={p.imageUrl} alt={p.name}/>:<span>LH.</span>}</div><div className="product-body"><div className="tag">{p.category}</div><h3>{p.name}</h3><p>{p.description}</p><div className="price-row"><span className="price">{money(p.priceCents)}</span>{p.checkoutUrl?<a className="btn" href={p.checkoutUrl} target="_blank" rel="noreferrer">Comprar ↗</a>:<span className="small">Em breve</span>}</div></div></article>)}</div>:<div className="panel empty" style={{marginTop:30}}>Ainda não há produtos publicados. O catálogo será atualizado quando novos produtos forem cadastrados.</div>}
  </section><footer className="shell footer">© {new Date().getFullYear()} Linho Holdings</footer></main>;
}
