"use client";
import { useEffect, useState } from "react";
type Point={label:string;value:number};
const brl=(n:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(n/100);
export default function RevenueChart({initialData}:{initialData:Point[]}) {
 const [data,setData]=useState(initialData); const [hover,setHover]=useState<number|null>(null);
 useEffect(()=>{const refresh=async()=>{try{const r=await fetch("/api/admin/analytics",{cache:"no-store"});if(r.ok){const d=await r.json();if(Array.isArray(d.data))setData(d.data)}}catch{}};const id=setInterval(refresh,30000);return()=>clearInterval(id)},[]);
 const w=760,h=250,left=35,right=20,top=20,bottom=38,max=Math.max(100,...data.map(d=>d.value));const x=(i:number)=>left+(i*(w-left-right)/Math.max(1,data.length-1));const y=(v:number)=>top+(h-top-bottom)*(1-v/max);const points=data.map((d,i)=>`${x(i)},${y(d.value)}`).join(" ");const area=`${left},${h-bottom} ${points} ${x(data.length-1)},${h-bottom}`;
 return <div className="chart-wrap"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Gráfico de faturamento dos últimos seis meses" onMouseLeave={()=>setHover(null)}>
 <defs><linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8b66a" stopOpacity=".34"/><stop offset="100%" stopColor="#d8b66a" stopOpacity="0"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
 {[0,.25,.5,.75,1].map((v,i)=><g key={i}><line x1={left} x2={w-right} y1={y(max*v)} y2={y(max*v)} stroke="#ffffff12" strokeDasharray="4 6"/><text x={left-7} y={y(max*v)+4} textAnchor="end" fontSize="9" fill="#74756c">{v===0?"0":Math.round(v*100)+"%"}</text></g>)}
 <polygon points={area} fill="url(#goldFill)"/><polyline points={points} fill="none" stroke="#d8b66a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)"/>
 {data.map((d,i)=><g key={d.label} onMouseEnter={()=>setHover(i)} onFocus={()=>setHover(i)} tabIndex={0} role="button" aria-label={`${d.label}: ${brl(d.value)}`}><circle cx={x(i)} cy={y(d.value)} r={hover===i?6:4} fill="#f2d995" stroke="#11120f" strokeWidth="2"/><text x={x(i)} y={h-12} textAnchor="middle" fontSize="11" fill="#9b9b92">{d.label}</text>{hover===i&&<g><rect x={Math.min(w-130,Math.max(5,x(i)-57))} y={Math.max(0,y(d.value)-38)} width="114" height="27" rx="5" fill="#272316" stroke="#b99b54"/><text x={Math.min(w-130,Math.max(5,x(i)-57))+57} y={Math.max(0,y(d.value)-38)+18} textAnchor="middle" fontSize="11" fill="#f2d995">{brl(d.value)}</text></g>}</g>)}
 </svg></div>;
}
