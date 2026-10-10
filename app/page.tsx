import Link from "next/link";
import { ArrowUpRight, ShieldCheck, TrendingUp, Layers3 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getProducts() {
  try { return await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 6 }); }
  catch { return []; }
}

export default async function Home() {
  const products = await getProducts();
  return <main>
    <header className="shell topbar">
      <Link href="/" className="brand"><span className="brand-mark">L</span><span>LINHO <span style={{color:"var(--gold)"}}>HOLDINGS</span></span></Link>
      <nav className="nav"><a href="#visao">Visão</a><a href="#produtos">Produtos</a><a href="#sobre">Sobre</a></nav>
      <Link className="pill" href="/admin/login">ÁREA RESTRITA ↗</Link>
    </header>
    <section className="shell hero" id="visao">
      <div>
        <div className="eyebrow">Estratégia · tecnologia · crescimento</div>
        <h1>Construindo valor.<br/><span>Multiplicando possibilidades.</span></h1>
        <p>A Linho Holdings conecta produtos digitais, inteligência comercial e uma operação orientada por dados. Menos ruído. Mais clareza para crescer.</p>
        <div className="actions"><a className="btn" href="#produtos">Explorar produtos <ArrowUpRight size={16}/></a><a className="btn secondary" href="#sobre">Conheça a Linho</a></div>
      </div>
      <div className="hero-card">
        <div className="eyebrow">Linho intelligence</div><h3>Decisões guiadas por dados.</h3>
        <div className="metric-big">01<span style={{fontSize:20,color:"var(--gold)",marginLeft:8}}>—</span></div>
        <div className="muted" style={{fontSize:12}}>Uma visão integrada de produto, operação e performance.</div>
        <div className="sparkline"><svg viewBox="0 0 400 100" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8b66a" stopOpacity=".3"/><stop offset="100%" stopColor="#d8b66a" stopOpacity="0"/></linearGradient></defs><path d="M0 82 C28 78 32 59 62 67 S95 84 125 51 S162 70 195 38 S235 50 263 29 S302 46 330 20 S370 25 400 5 L400 100 L0 100 Z" fill="url(#fill)"/><path d="M0 82 C28 78 32 59 62 67 S95 84 125 51 S162 70 195 38 S235 50 263 29 S302 46 330 20 S370 25 400 5" fill="none" stroke="#d8b66a" strokeWidth="2"/></svg></div>
        <div className="small">ESTRUTURA PARA O PRÓXIMO NÍVEL</div>
      </div>
    </section>
    <section className="shell stats">
      <div className="stat"><div className="label"><Layers3 size={14} style={{display:"inline",marginRight:7}}/>Portfólio</div><strong>Digital first</strong><div className="small">Produtos e soluções online</div></div>
      <div className="stat"><div className="label"><TrendingUp size={14} style={{display:"inline",marginRight:7}}/>Performance</div><strong>Data driven</strong><div className="small">Acompanhamento de resultados</div></div>
      <div className="stat"><div className="label"><ShieldCheck size={14} style={{display:"inline",marginRight:7}}/>Operação</div><strong>Transparente</strong><div className="small">Processos claros e organizados</div></div>
    </section>
    <section className="shell section" id="produtos">
      <div className="section-head"><div><div className="eyebrow">Seleção Linho</div><h2>Produtos em destaque</h2><p>Conhecimento e ferramentas para tirar projetos do papel.</p></div><Link className="pill" href="/produtos">Ver catálogo ↗</Link></div>
      {products.length ? <div className="product-grid">{products.map(p=><article className="product-card" key={p.id}><div className="product-image">{p.imageUrl?<img src={p.imageUrl} alt={p.name}/>:<span>LH.</span>}</div><div className="product-body"><div className="tag">{p.category}</div><h3>{p.name}</h3><p>{p.description || "Uma solução digital desenvolvida para apoiar seus próximos passos."}</p><div className="price-row"><span className="price">{money(p.priceCents)}</span><a className="btn" href={p.checkoutUrl || "/produtos"} target={p.checkoutUrl?"_blank":undefined} rel="noreferrer">Conhecer <ArrowUpRight size={14}/></a></div></div></article>)}</div>:<div className="panel empty">Novos produtos serão apresentados aqui em breve.</div>}
    </section>
    <section className="shell section" id="sobre"><div className="panel" style={{padding:34,background:"linear-gradient(120deg,#17150f,#101110)"}}><div className="eyebrow">Nossa abordagem</div><h2 style={{fontFamily:"Manrope",fontSize:30}}>Ambição com estrutura.</h2><p style={{color:"var(--muted)",maxWidth:750,lineHeight:1.8}}>Acreditamos que bons negócios são construídos com consistência: uma proposta clara, uma experiência confiável e métricas que ajudam a entender o que realmente funciona.</p></div></section>
    <footer className="shell footer" style={{display:"flex",justifyContent:"space-between",gap:15,flexWrap:"wrap"}}><span>© {new Date().getFullYear()} Linho Holdings. Todos os direitos reservados.</span><span>Estratégia e crescimento, com propósito.</span></footer>
  </main>;
}
