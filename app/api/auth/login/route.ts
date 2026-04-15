import { NextResponse } from "next/server";
import {
  COOKIE_REGIAO_DEMO,
  estadoDemoFromCpf11,
} from "@/lib/inteligencia-regiao-login";

const COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function POST(request: Request) {
  let body: { cpf?: string; senha?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const cpfRaw = body.cpf?.trim() ?? "";
  const cpfNumeros = cpfRaw.replace(/\D/g, "");
  const senha = body.senha?.trim() ?? "";

  if (cpfNumeros.length !== 11 || !senha) {
    return NextResponse.json(
      { error: "Informe CPF (11 dígitos) e senha." },
      { status: 400 },
    );
  }

  const regiao = estadoDemoFromCpf11(cpfNumeros);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("sicarf_auth", "1", {
    httpOnly: true,
    ...COOKIE_OPTS,
  });
  /** Região do simulador (Pará / Maranhão) derivada do CPF — não armazena o CPF. */
  res.cookies.set(COOKIE_REGIAO_DEMO, regiao, {
    httpOnly: false,
    ...COOKIE_OPTS,
  });
  return res;
}
