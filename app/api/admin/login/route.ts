import { NextResponse } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (typeof body.password !== "string" || body.password.length < 1) return NextResponse.json({error:"Informe a senha."},{status:400});
    if (!(await checkPassword(body.password))) return NextResponse.json({error:"Senha incorreta."},{status:401});
    await createSession();
    return NextResponse.json({ok:true});
  } catch (e:any) { return NextResponse.json({error:e?.message || "Erro ao autenticar."},{status:500}); }
}
