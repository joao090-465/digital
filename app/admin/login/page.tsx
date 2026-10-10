import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./login-form";
export const dynamic = "force-dynamic";
export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return <main className="login-wrap"><div className="login-card"><div className="brand"><span className="brand-mark">L</span><span>LINHO <span style={{color:"var(--gold)"}}>HOLDINGS</span></span></div><div className="eyebrow" style={{marginTop:35}}>Acesso administrativo</div><h1>Bem-vindo de volta.</h1><p>Entre com a senha administrativa para acessar os dados da operação.</p><LoginForm/><div className="small" style={{marginTop:22}}>Área protegida · Sessão expira em 12 horas</div></div></main>;
}
