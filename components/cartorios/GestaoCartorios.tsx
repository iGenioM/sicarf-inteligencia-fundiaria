"use client";

import { Bot, Folder, Link2, Network, Timer } from "lucide-react";
import { useState } from "react";
import { Totalizador } from "@/components/ui/Totalizador";
import { CARTORIOS, MALHA_FINA } from "@/lib/data/mock";
import { S } from "@/lib/colors";
import { CartoriosAuditoriaSection } from "./CartoriosAuditoriaSection";
import { CartoriosIaSection } from "./CartoriosIaSection";
import { CartoriosMalhaSection } from "./CartoriosMalhaSection";
import { CartoriosPainelSection } from "./CartoriosPainelSection";
import { CartoriosSlaSection } from "./CartoriosSlaSection";
import type { MunicipioIbge } from "@/lib/types";

export type CartoriosSecao =
  | "painel"
  | "auditoria"
  | "ia"
  | "malha"
  | "sla";

interface GestaoCartoriosProps {
  municipios: MunicipioIbge[];
}

export function GestaoCartorios({ municipios }: GestaoCartoriosProps) {
  const [secao, setSecao] = useState<CartoriosSecao>("painel");

  const totalNao = CARTORIOS.filter((c) => c.tipo === "nao").length;
  const totalApi = CARTORIOS.filter((c) => c.tipo === "api").length;
  const totalIa = CARTORIOS.filter((c) => c.tipo === "ia").length;
  const cartoriosVerificados = totalApi + totalIa;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        <Totalizador
          label="Não Integrados"
          valor={totalNao}
          badge="Operação analógica"
          badgeBg={S.gray100}
          badgeColor={S.gray500}
          icone={<Folder strokeWidth={2} />}
          ativo={secao === "painel"}
          onClick={() => setSecao("painel")}
        />
        <Totalizador
          label="Tipo 1 — API"
          valor={totalApi}
          badge={`${CARTORIOS.filter((c) => c.tipo === "api" && c.alertas > 0).length} com alertas`}
          badgeBg={S.blueLight}
          badgeColor={S.blue}
          icone={<Link2 strokeWidth={2} />}
          ativo={secao === "auditoria"}
          onClick={() => setSecao("auditoria")}
        />
        <Totalizador
          label="Tipo 2 — Agente IA"
          valor={totalIa}
          badge={`${CARTORIOS.filter((c) => c.tipo === "ia" && c.alertas > 0).length} com alertas`}
          icone={<Bot strokeWidth={2} />}
          ativo={secao === "ia"}
          onClick={() => setSecao("ia")}
        />
        <Totalizador
          label="Inconsistências (Malha)"
          valor={MALHA_FINA.length}
          badge={`${MALHA_FINA.filter((m) => m.risco === "Alto").length} alto risco`}
          icone={<Network strokeWidth={2} />}
          ativo={secao === "malha"}
          onClick={() => setSecao("malha")}
        />
        <Totalizador
          label="SLA Excedido"
          valor={CARTORIOS.filter((c) => c.sla != null && c.sla > 100).length}
          badge="Acima de 100h"
          badgeBg={S.orangeLight}
          badgeColor={S.orange}
          icone={<Timer strokeWidth={2} />}
          ativo={secao === "sla"}
          onClick={() => setSecao("sla")}
        />
      </div>

      {secao === "painel" && (
        <CartoriosPainelSection municipios={municipios} />
      )}
      {secao === "auditoria" && (
        <CartoriosAuditoriaSection totalApi={totalApi} />
      )}
      {secao === "ia" && <CartoriosIaSection />}
      {secao === "malha" && (
        <CartoriosMalhaSection cartoriosVerificados={cartoriosVerificados} />
      )}
      {secao === "sla" && <CartoriosSlaSection />}
    </div>
  );
}
