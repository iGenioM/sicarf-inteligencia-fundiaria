import { Shield } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { PRIVILEGIOS_SUSPEITOS } from "@/lib/data/mock";
import { S } from "@/lib/colors";

function justificativaClasses(j: string): string {
  const alerta =
    j.includes("Nenhuma") ||
    j.includes("verbal") ||
    j.includes("não autorizada");
  const bold = j.includes("Nenhuma") || j.includes("verbal");
  return `${alerta ? "text-sicarf-red" : "text-sicarf-gray-700"} ${bold ? "font-bold" : "font-normal"}`;
}

export function PrivilegiosSection() {
  return (
    <PanelCard>
      <SecTitle icon={Shield}>
        Elevação Suspeita de Privilégios de Acesso
      </SecTitle>
      <SubDesc>
        Servidores que tiveram perfis de acesso elevados de forma atípica — sem
        justificativa formal registrada, com autorização via contas genéricas de
        sistema, ou sem aprovação da gestão competente.
      </SubDesc>
      <Tabela
        colunas={[
          "ID",
          "Servidor",
          "Cargo / Setor",
          "Privilégio Anterior",
          "Novo Privilégio",
          "Elevado Por",
          "Data e Hora",
          "Justificativa",
          "Risco",
          "Ações",
        ]}
        linhas={PRIVILEGIOS_SUSPEITOS}
        renderLinha={(r) => (
          <>
            <Td>
              <span className="font-mono text-[11px] text-sicarf-gray-500">
                {r.id}
              </span>
            </Td>
            <Td>
              <strong className="text-sicarf-gray-900">{r.servidor}</strong>
            </Td>
            <Td>
              <span className="block text-sicarf-gray-700">{r.cargo}</span>
              <span className="text-[11px] text-sicarf-gray-400">{r.setor}</span>
            </Td>
            <Td>
              <Pill
                label={r.privilegioAnterior}
                bg={S.gray200}
                color={S.gray700}
              />
            </Td>
            <Td>
              <Pill label={r.privilegioNovo} bg={S.blueBg} color={S.blue} />
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-sicarf-gray-500">
                {r.elevadoPor}
              </span>
            </Td>
            <Td className="whitespace-nowrap">{r.dataHora}</Td>
            <Td
              className={`max-w-[210px] text-xs ${justificativaClasses(r.justificativa)}`}
            >
              {r.justificativa}
            </Td>
            <Td>
              <Pill
                label={r.risco}
                bg={
                  r.risco === "Crítico" || r.risco === "Alto" ? S.red : S.orange
                }
              />
            </Td>
            <Td>
              <BtnAcao />
            </Td>
          </>
        )}
      />
      <Paginacao total={PRIVILEGIOS_SUSPEITOS.length} />
    </PanelCard>
  );
}
