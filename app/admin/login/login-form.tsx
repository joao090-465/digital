"use client";
import { useState } from "react";
export default function LoginForm() {
 const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError("");try{const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});if(r.ok){location.href="/admin"}else{const d=await r.json();setError(d.error||"Não foi possível entrar.")}}catch{setError("Falha de conexão. Tente novamente.")}finally{setLoading(false)}}
 return <form onSubmit={submit}><div className="field" style={{marginTop:24}}><label htmlFor="password">Senha administrativa</label><input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" placeholder="Digite sua senha"/></div>{error&&<p className="danger">{error}</p>}<button className="btn" style={{width:"100%"}} disabled={loading}>{loading?"Verificando…":"Entrar no painel ↗"}</button></form>;
}
