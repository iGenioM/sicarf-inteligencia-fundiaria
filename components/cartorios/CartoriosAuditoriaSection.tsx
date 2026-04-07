import { Search } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { MetricCard } from "@/components/ui/MetricCard";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { AUDIT_LOG } from "@/lib/data/mock";
import { S } from "@/lib/colors";

interface CartoriosAuditoriaSectionProps {
  totalApi: number;
}

function statusPillStyles(status: string): { bg: string; color: string } {
  if (status.startsWith("200"))
    return { bg: S.greenLight, color: S.green };
  if (status.startsWith("403"))
    return { bg: S.redLight, color: S.red };
  return { bg: S.orangeLight, color: S.orange };
}

export function CartoriosAuditoriaSection({
  totalApi,
}: CartoriosAuditoriaSectionProps) {
  const metrics = [
    { l: "Chamadas hoje", v: "1.847", c: "text-sicarf-gray-800" },
    { l: "Bloqueadas", v: "3", c: "text-sicarf-red" },
    { l: "Alertas", v: "2", c: "text-sicarf-orange" },
    { l: "Cartórios API ativos", v: String(totalApi), c: "text-sicarf-blue" },
  ] as const;

  return (
    <PanelCard>
      <SecTitle icon={Search}>
        Monitoramento e Auditoria de Tráfego — Integração Tipo 1 (API)
      </SecTitle>
      <SubDesc>
        Trilha de auditoria de todas as chamadas realizadas pelos cartórios via
        API. Acessos bloqueados e alertas são destacados automaticamente.
      </SubDesc>
      <div className="mb-[18px] flex gap-3">
        {metrics.map((x) => (
          <MetricCard
            key={x.l}
            value={x.v}
            label={x.l}
            valueClassName={x.c}
            className="px-3.5 py-2.5"
            centered={false}
          />
        ))}
      </div>
      <Tabela
        colunas={[
          "Timestamp",
          "Cartório",
          "Método",
          "Processo",
          "Status",
          "Observação",
          "Ações",
        ]}
        linhas={AUDIT_LOG}
        renderLinha={(r) => {
          const st = statusPillStyles(r.status);
          return (
            <>
              <Td>
                <span className="font-mono text-[11px]">{r.ts}</span>
              </Td>
              <Td>{r.cartorio}</Td>
              <Td>
                <Pill
                  label={r.metodo}
                  bg={
                    r.metodo === "GET"
                      ? S.blueBg
                      : r.metodo === "WRITE"
                        ? S.greenLight
                        : S.orangeBg
                  }
                  color={
                    r.metodo === "GET"
                      ? S.blue
                      : r.metodo === "WRITE"
                        ? S.green
                        : S.orange
                  }
                />
              </Td>
              <Td>
                <span className="font-mono text-xs">{r.processo}</span>
              </Td>
              <Td>
                <Pill label={r.status} bg={st.bg} color={st.color} />
              </Td>
              <Td
                className={`text-xs ${r.obs ? "text-sicarf-red" : "text-sicarf-gray-400"}`}
              >
                {r.obs || "—"}
              </Td>
              <Td>
                <BtnAcao />
              </Td>
            </>
          );
        }}
      />
      <Paginacao total={AUDIT_LOG.length} />
    </PanelCard>
  );
}
