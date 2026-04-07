import { Timer } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { CARTORIOS } from "@/lib/data/mock";
import { S } from "@/lib/colors";
import { slaBarBgClass, slaColorClass, tipoLabel } from "@/lib/helpers/cartorios";
import type { Cartorio } from "@/lib/types";

function tipoPillBg(t: Cartorio["tipo"]): string {
  return t === "api" ? S.blueBg : S.greenLight;
}

function tipoPillColor(t: Cartorio["tipo"]): string {
  return t === "api" ? S.blue : S.green;
}

export function CartoriosSlaSection() {
  const comSla = CARTORIOS.filter((c) => c.sla != null).sort(
    (a, b) => (b.sla ?? 0) - (a.sla ?? 0),
  );

  return (
    <PanelCard>
      <SecTitle icon={Timer}>
        Medidor de SLA — Tempo de Resposta Cartorial
      </SecTitle>
      <SubDesc>
        Tempo médio entre a disponibilização dos dados do título no SICARF e o
        efetivo registro da matrícula pelo cartório. Meta:{" "}
        <strong>100 horas</strong>. Cartórios acima da meta são notificados
        automaticamente.
      </SubDesc>
      <Tabela
        colunas={[
          "Município",
          "Cartório",
          "Integração",
          "SLA Médio (h)",
          "vs. Meta",
          "Status",
          "Ações",
        ]}
        linhas={comSla}
        renderLinha={(c) => {
          const sla = c.sla!;
          const barPct = Math.min((sla / 150) * 100, 100);
          return (
            <>
              <Td>
                <strong>{c.municipio}</strong>
              </Td>
              <Td className="text-xs text-sicarf-gray-600">{c.nome}</Td>
              <Td>
                <Pill
                  label={tipoLabel(c.tipo)}
                  bg={tipoPillBg(c.tipo)}
                  color={tipoPillColor(c.tipo)}
                />
              </Td>
              <Td>
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`min-w-8 font-bold ${slaColorClass(sla)}`}
                  >
                    {sla}h
                  </span>
                  <div className="h-1.5 min-w-20 flex-1 rounded-full bg-sicarf-gray-100">
                    <div
                      className={`h-full rounded-full ${slaBarBgClass(sla)}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              </Td>
              <Td
                className={`font-bold ${sla > 100 ? "text-sicarf-red" : "text-sicarf-green"}`}
              >
                {sla > 100 ? `+${sla - 100}h acima` : "—"}
              </Td>
              <Td>
                <Pill
                  label={
                    sla > 100
                      ? "Excedido"
                      : sla > 90
                        ? "Atenção"
                        : "Dentro do prazo"
                  }
                  bg={
                    sla > 100
                      ? S.redLight
                      : sla > 90
                        ? S.orangeLight
                        : S.greenLight
                  }
                  color={
                    sla > 100 ? S.red : sla > 90 ? S.orange : S.green
                  }
                />
              </Td>
              <Td>
                <BtnAcao />
              </Td>
            </>
          );
        }}
      />
      <Paginacao total={comSla.length} />
    </PanelCard>
  );
}
