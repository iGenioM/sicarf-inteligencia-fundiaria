import { Check, MapPin } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { CARTORIOS } from "@/lib/data/mock";
import { S } from "@/lib/colors";
import { slaColorClass, tipoLabel } from "@/lib/helpers/cartorios";
import type { MunicipioIbge } from "@/lib/types";

interface CartoriosPainelSectionProps {
  municipios: MunicipioIbge[];
}

export function CartoriosPainelSection({
  municipios,
}: CartoriosPainelSectionProps) {
  return (
    <PanelCard>
      <SecTitle icon={MapPin}>
        Painel de Status de Integração — Mapa Cartorial (PA)
      </SecTitle>
      <SubDesc>
        {municipios.length > 0
          ? `${municipios.length} municípios carregados via API IBGE · `
          : ""}
        Visão consolidada do status de integração de todos os cartórios do
        estado do Pará com o SICARF.
      </SubDesc>
      <Tabela
        colunas={[
          "Município",
          "Cartório",
          "Tipo de Integração",
          "SLA Médio",
          "Alertas",
          "Última Sincronização",
          "Chamadas Hoje",
          "Ações",
        ]}
        linhas={CARTORIOS}
        renderLinha={(c) => (
          <>
            <Td>
              <strong>{c.municipio}</strong>
            </Td>
            <Td className="text-sicarf-gray-600">{c.nome}</Td>
            <Td>
              <Pill
                label={tipoLabel(c.tipo)}
                bg={
                  c.tipo === "api"
                    ? S.blueBg
                    : c.tipo === "ia"
                      ? S.greenLight
                      : S.gray100
                }
                color={
                  c.tipo === "api"
                    ? S.blue
                    : c.tipo === "ia"
                      ? S.green
                      : S.gray400
                }
              />
            </Td>
            <Td>
              {c.sla != null ? (
                <span className={`font-bold ${slaColorClass(c.sla)}`}>
                  {c.sla}h
                </span>
              ) : (
                <span className="text-sicarf-gray-400">—</span>
              )}
            </Td>
            <Td>
              {c.alertas > 0 ? (
                <span className="rounded bg-sicarf-red-light px-2 py-0.5 text-xs font-bold text-sicarf-red">
                  {c.alertas}
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <Check
                    className="size-4 text-sicarf-green"
                    strokeWidth={2.5}
                    aria-label="Sem alertas"
                  />
                </span>
              )}
            </Td>
            <Td
              className={`text-xs ${c.ultimaSync ? "text-sicarf-gray-700" : "text-sicarf-gray-400"}`}
            >
              {c.ultimaSync ?? "—"}
            </Td>
            <Td className="font-mono text-xs text-sicarf-gray-700">
              {c.chamadas || "—"}
            </Td>
            <Td>
              <BtnAcao />
            </Td>
          </>
        )}
      />
      <Paginacao total={CARTORIOS.length} />
    </PanelCard>
  );
}
