import type { EstadoAtivoGlobal } from "@/lib/inteligencia-fundiaria-dados";

/** Cookie definida no login com base no último dígito do CPF (sem armazenar o CPF). */
export const COOKIE_REGIAO_DEMO = "sicarf_regiao_demo";

export type RegiaoCookieValor = "PA" | "MA" | "INVALID";

/**
 * Último dígito 0 → Pará, 1 → Maranhão; demais → não autorizado para o conteúdo regional.
 */
export function estadoDemoFromCpf11(cpf11: string): RegiaoCookieValor {
  const d = cpf11.replace(/\D/g, "");
  if (d.length !== 11) return "INVALID";
  const ult = d[10];
  if (ult === "0") return "PA";
  if (ult === "1") return "MA";
  return "INVALID";
}

/** Lê o cookie no cliente (valor: PA | MA | INVALID). */
export function readRegiaoDemoCookie(): EstadoAtivoGlobal | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_REGIAO_DEMO}=([^;]*)`),
  );
  const raw = m?.[1]?.trim();
  if (raw === "PA" || raw === "MA" || raw === "INVALID") return raw;
  return null;
}
