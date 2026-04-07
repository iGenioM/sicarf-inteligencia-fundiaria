import { Network } from "lucide-react";
import { MalhaFinaBanner } from "@/components/cartorios/MalhaFinaBanner";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { Tabela, Td } from "@/components/ui/Tabela";
import { MALHA_FINA } from "@/lib/data/mock";
import { S } from "@/lib/colors";

interface CartoriosMalhaSectionProps {
  cartoriosVerificados: number;
}

export function CartoriosMalhaSection({
  cartoriosVerificados,
}: CartoriosMalhaSectionProps) {
  return (
    <PanelCard>
      <SecTitle icon={Network}>Malha Fina de Conciliação de Dados</SecTitle>
      <MalhaFinaBanner cartoriosVerificados={cartoriosVerificados} />
      <Tabela
        colunas={[
          "Município",
          "Cartório",
          "Tipo de Inconsistência",
          "Processo",
          "Valor no SICARF",
          "Valor no Cartório",
          "Risco",
          "Status",
          "Ações",
        ]}
        linhas={MALHA_FINA}
        renderLinha={(r) => (
          <>
            <Td>
              <strong>{r.municipio}</strong>
            </Td>
            <Td className="text-xs text-sicarf-gray-600">{r.cartorio}</Td>
            <Td>
              <Pill label={r.tipo} bg={S.blueBg} color={S.blue} />
            </Td>
            <Td>
              <span className="font-mono text-xs">{r.processo}</span>
            </Td>
            <Td className="text-xs font-semibold text-sicarf-green">
              {r.sicarf}
            </Td>
            <Td className="text-xs font-semibold text-sicarf-red">
              {r.cartorioVal}
            </Td>
            <Td>
              <Pill
                label={r.risco}
                bg={r.risco === "Alto" ? S.red : S.orange}
              />
            </Td>
            <Td>
              <Pill
                label={r.status}
                bg={r.status === "Pendente" ? S.redLight : S.orangeLight}
                color={r.status === "Pendente" ? S.red : S.orange}
              />
            </Td>
            <Td>
              <BtnAcao />
            </Td>
          </>
        )}
      />
      <Paginacao total={MALHA_FINA.length} />
    </PanelCard>
  );
}
