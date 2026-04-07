/** Navegação principal na sidebar */
export type AppMainNavId = "compliance" | "cartorios";

export type RiscoNivel = "Alto" | "Médio" | "Crítico";

export interface AcessoForaHorario {
  id: string;
  servidor: string;
  cargo: string;
  setor: string;
  horario: string;
  data: string;
  processo: string;
  acao: string;
  ip: string;
  risco: "Alto" | "Médio";
}

export interface PrivilegioSuspeito {
  id: string;
  servidor: string;
  cargo: string;
  setor: string;
  privilegioAnterior: string;
  privilegioNovo: string;
  elevadoPor: string;
  dataHora: string;
  justificativa: string;
  risco: RiscoNivel;
}

export interface VistoriaFantasma {
  id: string;
  vistoriador: string;
  municipio: string;
  processo: string;
  dataAssinatura: string;
  coordAssinatura: string;
  coordImovel: string;
  distanciaKm: number;
  status: "Laudo Emitido" | "Em Revisão";
}

export interface Retificacao {
  processo: string;
  municipio: string;
  campo: string;
  de: string;
  para: string;
  responsavel: string;
  data: string;
  hora: string;
  risco: "Alto" | "Médio";
}

export interface AnomaliaPrazo {
  processo: string;
  municipio: string;
  responsavel: string;
  setor: string;
  tipo: string;
  padrao: string;
  real: string;
  desvio: number;
  indicativo: string;
}

export type TipoIntegracao = "api" | "ia" | "nao";

export interface Cartorio {
  municipio: string;
  nome: string;
  tipo: TipoIntegracao;
  sla: number | null;
  alertas: number;
  ultimaSync: string | null;
  chamadas: number;
}

export interface AuditLogEntry {
  ts: string;
  cartorio: string;
  metodo: string;
  processo: string;
  status: string;
  obs: string;
}

export interface MalhaFinaItem {
  municipio: string;
  cartorio: string;
  tipo: string;
  processo: string;
  sicarf: string;
  cartorioVal: string;
  risco: "Alto" | "Médio";
  status: "Pendente" | "Em análise";
}

export interface IaAgentLogEntry {
  ts: string;
  cartorio: string;
  processo: string;
  leu: string;
  preencheu: string;
  ok: boolean;
}

export interface MunicipioIbge {
  id: number;
  nome: string;
}
