import { NextResponse } from "next/server";
import { COOKIE_REGIAO_DEMO } from "@/lib/inteligencia-regiao-login";

const CLEAR = {
  path: "/",
  maxAge: 0,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sicarf_auth", "", {
    httpOnly: true,
    ...CLEAR,
  });
  res.cookies.set(COOKIE_REGIAO_DEMO, "", {
    httpOnly: false,
    ...CLEAR,
  });
  return res;
}
