import { HEAT_DATA } from "@/lib/data/mock";

export const PA_MUNICIPIOS_GEOJSON_URL =
  "https://servicodados.ibge.gov.br/api/v4/malhas/estados/15?formato=application/vnd.geo+json&intrarregiao=municipio&qualidade=minima";

export const PA_MUNICIPIOS_API_URL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados/15/municipios";

const heatValues = Object.values(HEAT_DATA);
export const HEAT_MIN = Math.min(...heatValues);
export const HEAT_MAX = Math.max(...heatValues);

/** Cor do polígono conforme índice (verde baixo → vermelho alto); sem dado = cinza. */
export function heatToFillColor(score: number | undefined): string {
  if (score == null || Number.isNaN(score)) return "#e2e8f0";
  const t = (score - HEAT_MIN) / (HEAT_MAX - HEAT_MIN || 1);
  if (t < 0.25) return "#c6f6d5";
  if (t < 0.5) return "#faf089";
  if (t < 0.75) return "#f6ad55";
  return "#fc8181";
}

export function heatLabel(score: number | undefined): string {
  if (score == null) return "Sem dado no painel";
  if (score >= HEAT_MAX * 0.75) return "Prioridade alta";
  if (score >= HEAT_MAX * 0.5) return "Prioridade média-alta";
  if (score >= HEAT_MAX * 0.25) return "Prioridade moderada";
  return "Baixa incidência relativa";
}
