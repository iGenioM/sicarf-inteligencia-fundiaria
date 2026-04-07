import type { TipoIntegracao } from "@/lib/types";

export function tipoLabel(t: TipoIntegracao): string {
  if (t === "api") return "Tipo 1 — API";
  if (t === "ia") return "Tipo 2 — Agente IA";
  return "Não integrado";
}

export function tipoCorClass(t: TipoIntegracao): string {
  if (t === "api") return "text-sicarf-blue";
  if (t === "ia") return "text-sicarf-green";
  return "text-sicarf-gray-400";
}

export function slaColorClass(v: number | null): string {
  if (v == null) return "text-sicarf-gray-400";
  if (v <= 100) return "text-sicarf-green";
  if (v <= 120) return "text-sicarf-orange";
  return "text-sicarf-red";
}

export function slaBarBgClass(v: number | null): string {
  if (v == null) return "bg-sicarf-gray-400";
  if (v <= 100) return "bg-sicarf-green";
  if (v <= 120) return "bg-sicarf-orange";
  return "bg-sicarf-red";
}

export function statusApiColorClass(s: string): string {
  if (s.startsWith("200")) return "text-sicarf-green";
  if (s.startsWith("403")) return "text-sicarf-red";
  return "text-sicarf-orange";
}
