import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LayoutDashboard, Package, Globe, LogOut } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function AdminLayout({children}:{children:React.ReactNode}) {
  if (!(await isAdmin())) redirect("/admin/login");
  return <div className="admin-layout"><aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark">L</span><span>LINHO <span style={{color:"var(--gold)"}}>HOLDINGS</span></span></Link><div className="side-label">WORKSPACE</div><Link className="side-link" href="/admin"><LayoutDashboard size={16}/> Visão geral</Link><Link className="side-link" href="/admin/produtos"><Package size={16}/> Produtos</Link><div className="side-label">PÚBLICO</div><Link className="side-link" href="/" target="_blank"><Globe size={16}/> Abrir site ↗</Link><form action="/api/admin/logout" method="post" style={{marginTop:30}}><button className="side-link" style={{background:"transparent",border:0,width:"100%",textAlign:"left"}}><LogOut size={16}/> Sair do painel</button></form><div style={{position:"absolute",bottom:24,fontSize:10,color:"#5f6059",padding:"0 10px"}}>LINHO INTELLIGENCE · V1.0</div></aside><div className="admin-main">{children}</div></div>;
}
