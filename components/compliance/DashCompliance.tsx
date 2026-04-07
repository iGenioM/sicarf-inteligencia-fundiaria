"use client";

import {
  MapPin,
  PenLine,
  Shield,
  Timer,
  UserSearch,
} from "lucide-react";
import { useState } from "react";
import { Totalizador } from "@/components/ui/Totalizador";
import {
  ACESSOS_FORA_HORARIO,
  ANOMALIAS_PRAZO,
  PRIVILEGIOS_SUSPEITOS,
  RETIFICACOES,
  VISTORIAS_FANTASMA,
} from "@/lib/data/mock";
import { S } from "@/lib/colors";
import { AcessosSuspeitosSection } from "./AcessosSuspeitosSection";
import { AnomaliasPrazoSection } from "./AnomaliasPrazoSection";
import { PrivilegiosSection } from "./PrivilegiosSection";
import { RetificacoesHeatMapPanel } from "./RetificacoesHeatMapPanel";
import { RetificacoesSection } from "./RetificacoesSection";
import { VistoriasFantasmaSection } from "./VistoriasFantasmaSection";

export type ComplianceSecao =
  | "acessos"
  | "privilegios"
  | "vistorias"
  | "retificacoes"
  | "prazos";

export function DashCompliance() {
  const [secao, setSecao] = useState<ComplianceSecao>("acessos");

  const maxVistoriaKm = Math.max(
    ...VISTORIAS_FANTASMA.map((v) => v.distanciaKm),
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        <Totalizador
          label="Acessos Suspeitos"
          valor={ACESSOS_FORA_HORARIO.length}
          badge={`${ACESSOS_FORA_HORARIO.filter((a) => a.risco === "Alto").length} alto risco`}
          icone={<UserSearch strokeWidth={2} />}
          ativo={secao === "acessos"}
          onClick={() => setSecao("acessos")}
        />
        <Totalizador
          label="Privilégios Elevados"
          valor={PRIVILEGIOS_SUSPEITOS.length}
          badge={`${PRIVILEGIOS_SUSPEITOS.filter((p) => p.risco === "Crítico").length} crítico`}
          icone={<Shield strokeWidth={2} />}
          ativo={secao === "privilegios"}
          onClick={() => setSecao("privilegios")}
        />
        <Totalizador
          label="Vistorias Fantasma"
          valor={VISTORIAS_FANTASMA.length}
          badge={`até ${maxVistoriaKm} km`}
          icone={<MapPin strokeWidth={2} />}
          ativo={secao === "vistorias"}
          onClick={() => setSecao("vistorias")}
        />
        <Totalizador
          label="Retificações / Cancelamentos"
          valor={RETIFICACOES.length}
          badge={`${RETIFICACOES.filter((r) => r.risco === "Alto").length} alto risco`}
          icone={<PenLine strokeWidth={2} />}
          ativo={secao === "retificacoes"}
          onClick={() => setSecao("retificacoes")}
        />
        <Totalizador
          label="Anomalias de Prazo"
          valor={ANOMALIAS_PRAZO.length}
          badge="2 críticas"
          badgeBg={S.orangeLight}
          badgeColor={S.orange}
          icone={<Timer strokeWidth={2} />}
          ativo={secao === "prazos"}
          onClick={() => setSecao("prazos")}
        />
      </div>

      {secao === "acessos" && <AcessosSuspeitosSection />}
      {secao === "privilegios" && <PrivilegiosSection />}
      {secao === "vistorias" && <VistoriasFantasmaSection />}
      {secao === "retificacoes" && (
        <>
          <RetificacoesHeatMapPanel />
          <RetificacoesSection />
        </>
      )}
      {secao === "prazos" && <AnomaliasPrazoSection />}
    </div>
  );
}
