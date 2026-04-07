import { Timer } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { ANOMALIAS_PRAZO } from "@/lib/data/mock";

function desvioClass(d: number): string {
  if (d < -20 || d > 100) return "text-sicarf-red";
  if (d > 0) return "text-sicarf-orange";
  return "text-sicarf-green";
}

export function AnomaliasPrazoSection() {
  return (
    <PanelCard>
      <SecTitle icon={Timer}>Anomalias em Prazos de Tramitação</SecTitle>
      <SubDesc>
        Processos com desvios significativos em relação ao prazo padrão por tipo
        de análise. Aprovações em tempo recorde (indício de favorecimento) ou
        paralisações injustificadas (indício de prevaricação) são destacadas.
      </SubDesc>
      <Tabela
        colunas={[
          "Processo",
          "Município",
          "Responsável",
          "Setor",
          "Tipo",
          "Prazo Padrão",
          "Prazo Real",
          "Desvio",
          "Indicativo",
          "Ações",
        ]}
        linhas={ANOMALIAS_PRAZO}
        renderLinha={(r) => (
          <>
            <Td>
              <span className="font-mono text-xs">{r.processo}</span>
            </Td>
            <Td>{r.municipio}</Td>
            <Td>{r.responsavel}</Td>
            <Td>{r.setor}</Td>
            <Td>{r.tipo}</Td>
            <Td className="text-sicarf-gray-500">{r.padrao}</Td>
            <Td className="font-bold">{r.real}</Td>
            <Td className={`font-bold ${desvioClass(r.desvio)}`}>
              {r.desvio > 0 ? `+${r.desvio} dias` : `${r.desvio} dias`}
            </Td>
            <Td
              className={`text-xs ${
                r.indicativo.includes("prevaricação") ||
                r.indicativo.includes("favorecimento")
                  ? "text-sicarf-red"
                  : "text-sicarf-orange"
              }`}
            >
              {r.indicativo}
            </Td>
            <Td>
              <BtnAcao />
            </Td>
          </>
        )}
      />
      <Paginacao total={ANOMALIAS_PRAZO.length} />
    </PanelCard>
  );
}
