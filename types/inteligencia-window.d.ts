import type { EstadoAtivoGlobal } from "@/lib/inteligencia-fundiaria-dados";

export {};

declare global {
  interface Window {
    estadoAtivo?: EstadoAtivoGlobal;
  }
}
