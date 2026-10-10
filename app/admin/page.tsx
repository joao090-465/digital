import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import RevenueChart from "./revenue-chart";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
 let orders:any[]=[]; let productCount=0; let activeProducts=0; let salesCents=0; let grossProfit=0; let monthCents=0; let units=0; let chart:any[]=[];
 try {
  const now=new Date(); const start=new Date(now.getFullYear(),now.getMonth()-5,1);
  [orders,productCount,activeProducts]=await Promise.all([
   prisma.kiwifyOrder.findMany({where:{status:{in:["paid","approved","completed","order_approved"]}},orderBy:{approvedAt:"desc"},take:8,include:{product:true}}),
   prisma.product.count(),prisma.product.count({where:{active:true}})
  ]);
  const all=await prisma.kiwifyOrder.findMany({where:{status:{in:["paid","approved","completed","order_approved"]}},select:{amountCents:true,approvedAt:true,product:{select:{costCents:true}}}});
  salesCents=all.reduce((s,o)=>s+o.amountCents,0);
  grossProfit=all.reduce((s,o)=>s+o.amountCents-(o.product?.costCents||0),0);
  monthCents=all.filter(o=>o.approvedAt&&o.approvedAt>=new Date(now.getFullYear(),now.getMonth(),1)).reduce((s,o)=>s+o.amountCents,0);
  units=all.length;
  chart=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return {label:d.toLocaleDateString("pt-BR",{month:"short"}).replace(".",""),value:all.filter(o=>o.approvedAt&&o.approvedAt.getFullYear()===d.getFullYear()&&o.approvedAt.getMonth()===d.getMonth()).reduce((s,o)=>s+o.amountCents,0)}});
 } catch {}
 return <><div className="admin-top"><div><div className="eyebrow">Painel de controle</div><h1>Visão geral</h1><p>Resumo da operação e desempenho comercial.</p></div><div className="toolbar"><Link className="btn" href="/admin/produtos">+ Novo produto</Link></div></div>
 <div className="notice">Os indicadores refletem pedidos recebidos pelo webhook da Kiwify. Sem pedidos confirmados, os valores permanecem em zero. Configure as variáveis e o webhook antes de usar os números para decisões.</div>
 <div className="admin-grid"><div className="stat"><div className="label">Faturamento acumulado</div><strong>{money(salesCents)}</strong><div className="small">Pedidos confirmados</div></div><div className="stat"><div className="label">Faturamento do mês</div><strong>{money(monthCents)}</strong><div className="small">Mês atual</div></div><div className="stat"><div className="label">Lucro bruto estimado</div><strong>{money(grossProfit)}</strong><div className="small">Receita menos custo cadastrado</div></div><div className="stat"><div className="label">Produtos ativos</div><strong>{activeProducts} <span style={{fontSize:12,color:"var(--muted)"}}>/ {productCount}</span></strong><div className="small">{units} pedidos contabilizados</div></div></div>
 <section className="panel"><div className="panel-head"><div><h2>Receita ao longo do tempo</h2><div className="small" style={{marginTop:6}}>Visualização estilizada em perspectiva · atualização automática a cada 30 s</div></div><span className="status">● Dados do banco</span></div><RevenueChart initialData={chart}/></section>
 <section className="panel"><div className="panel-head"><h2>Pedidos recentes</h2><span className="small">Últimos pedidos confirmados</span></div><div className="table-wrap"><table><thead><tr><th>Pedido / produto</th><th>Cliente</th><th>Data</th><th>Valor</th><th>Status</th></tr></thead><tbody>{orders.length?orders.map(o=><tr key={o.id}><td>{o.productName||o.product?.name||"Produto digital"}<div className="small">{o.externalId}</div></td><td>{o.customerName||o.customerEmail||"Cliente Kiwify"}</td><td>{o.approvedAt?new Date(o.approvedAt).toLocaleDateString("pt-BR"):"—"}</td><td>{money(o.amountCents)}</td><td><span className="status">Confirmado</span></td></tr>):<tr><td colSpan={5}><div className="empty">Nenhum pedido confirmado ainda. Quando a Kiwify enviar eventos válidos, eles aparecerão aqui.</div></td></tr>}</tbody></table></div></section>
 <div className="small">O lucro bruto é uma estimativa baseada no custo cadastrado de cada produto. Taxas, impostos, reembolsos e outros custos operacionais não estão incluídos automaticamente.</div>
 </>;
}
