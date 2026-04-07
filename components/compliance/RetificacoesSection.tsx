"use client";

import { PenLine } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { RETIFICACOES } from "@/lib/data/mock";
import { S } from "@/lib/colors";

export function RetificacoesSection() {
  return (
    <PanelCard>
      <SecTitle icon={PenLine}>
        Retificações de Dados e Cancelamentos em Processos Ativos
      </SecTitle>
      <SubDesc>
        Alterações sensíveis em campos críticos de processos em andamento.
        Campos como titular, área e tipo de processo são monitorados com
        prioridade máxima.
      </SubDesc>

      <Tabela
        colunas={[
          "Processo",
          "Município",
          "Campo Alterado",
          "Valor Anterior",
          "Novo Valor",
          "Responsável pela Alteração",
          "Data",
          "Horário",
          "Risco",
          "Ações",
        ]}
        linhas={RETIFICACOES}
        renderLinha={(r) => (
          <>
            <Td>
              <span className="font-mono text-xs">{r.processo}</span>
            </Td>
            <Td>{r.municipio}</Td>
            <Td>
              <Pill label={r.campo} bg={S.blueBg} color={S.blue} />
            </Td>
            <Td className="max-w-[140px] text-xs text-sicarf-gray-500">
              {r.de}
            </Td>
            <Td className="max-w-[140px] text-xs font-bold text-sicarf-gray-900">
              {r.para}
            </Td>
            <Td>{r.responsavel}</Td>
            <Td className="whitespace-nowrap text-sicarf-gray-600">
              {r.data}
            </Td>
            <Td className="font-bold text-sicarf-red">{r.hora}</Td>
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
      <Paginacao total={RETIFICACOES.length} />
    </PanelCard>
  );
}
