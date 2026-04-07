import { UserSearch } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { ACESSOS_FORA_HORARIO } from "@/lib/data/mock";
import { S } from "@/lib/colors";

export function AcessosSuspeitosSection() {
  return (
    <PanelCard>
      <SecTitle icon={UserSearch}>
        Acessos Suspeitos — Atividades Fora do Horário Habitual
      </SecTitle>
      <SubDesc>
        Servidores que acessaram o SICARF fora do horário comercial (08h–18h) ou
        em finais de semana. Registros extraídos automaticamente dos logs de
        rastreabilidade do sistema.
      </SubDesc>
      <Tabela
        colunas={[
          "ID",
          "Servidor",
          "Cargo / Setor",
          "Data",
          "Horário",
          "Processo Acessado",
          "Ação Realizada",
          "IP de Origem",
          "Risco",
          "Ações",
        ]}
        linhas={ACESSOS_FORA_HORARIO}
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
            <Td className="whitespace-nowrap text-sicarf-gray-600">{r.data}</Td>
            <Td>
              <span className="text-sm font-bold text-sicarf-red">
                {r.horario}
              </span>
            </Td>
            <Td>
              <span className="font-mono text-xs">{r.processo}</span>
            </Td>
            <Td className="max-w-[200px] text-sicarf-gray-700">{r.acao}</Td>
            <Td>
              <span className="font-mono text-[11px] text-sicarf-gray-500">
                {r.ip}
              </span>
            </Td>
            <Td>
              <Pill
                label={r.risco}
                bg={r.risco === "Alto" ? S.red : S.orange}
              />
            </Td>
            <Td>
              <BtnAcao />
            </Td>
          </>
        )}
      />
      <Paginacao total={ACESSOS_FORA_HORARIO.length} />
    </PanelCard>
  );
}
