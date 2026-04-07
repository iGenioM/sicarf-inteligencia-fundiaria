import { MapPin } from "lucide-react";
import { BtnAcao } from "@/components/ui/BtnAcao";
import { MetricCard } from "@/components/ui/MetricCard";
import { Paginacao } from "@/components/ui/Paginacao";
import { PanelCard } from "@/components/ui/PanelCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { VISTORIAS_FANTASMA } from "@/lib/data/mock";
import { S } from "@/lib/colors";

export function VistoriasFantasmaSection() {
  const maxKm = Math.max(...VISTORIAS_FANTASMA.map((v) => v.distanciaKm));
  const mediaKm = Math.round(
    VISTORIAS_FANTASMA.reduce((s, v) => s + v.distanciaKm, 0) /
      VISTORIAS_FANTASMA.length,
  );
  const emitidos = VISTORIAS_FANTASMA.filter(
    (v) => v.status === "Laudo Emitido",
  ).length;

  return (
    <PanelCard>
      <SecTitle icon={MapPin}>
        Índice de Inconsistência de Vistorias — Vistoria Fantasma
      </SecTitle>
      <SubDesc>
        Cruzamento entre os dados do Aplicativo Vistoria (assinatura digital com
        geolocalização) e as coordenadas reais do imóvel aprovadas no processo.
        Laudos assinados a mais de <strong>50 km</strong> do imóvel são
        sinalizados automaticamente.
      </SubDesc>

      <div className="mb-[18px] flex gap-3">
        <MetricCard
          value={VISTORIAS_FANTASMA.length}
          label="Laudos com divergência"
          valueClassName="text-sicarf-red"
        />
        <MetricCard
          value={`${maxKm} km`}
          label="Maior distância detectada"
          valueClassName="text-sicarf-red"
        />
        <MetricCard
          value={`${mediaKm} km`}
          label="Média das divergências"
          valueClassName="text-sicarf-orange"
        />
        <MetricCard
          value={emitidos}
          label="Laudos já emitidos"
          valueClassName="text-sicarf-red"
        />
      </div>

      <Tabela
        colunas={[
          "ID",
          "Vistoriador",
          "Município",
          "Processo",
          "Data Assinatura",
          "Coord. de Assinatura",
          "Coord. Real do Imóvel",
          "Distância",
          "Status",
          "Ações",
        ]}
        linhas={VISTORIAS_FANTASMA}
        renderLinha={(r) => (
          <>
            <Td>
              <span className="font-mono text-[11px] text-sicarf-gray-500">
                {r.id}
              </span>
            </Td>
            <Td>
              <strong className="text-sicarf-gray-900">{r.vistoriador}</strong>
            </Td>
            <Td>{r.municipio}</Td>
            <Td>
              <span className="font-mono text-xs">{r.processo}</span>
            </Td>
            <Td className="whitespace-nowrap">{r.dataAssinatura}</Td>
            <Td>
              <span className="font-mono text-[11px] text-sicarf-gray-500">
                {r.coordAssinatura}
              </span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-sicarf-gray-500">
                {r.coordImovel}
              </span>
            </Td>
            <Td>
              <span
                className={`text-sm font-bold ${
                  r.distanciaKm > 200
                    ? "text-sicarf-red"
                    : r.distanciaKm > 50
                      ? "text-sicarf-orange"
                      : "text-sicarf-green"
                }`}
              >
                {r.distanciaKm} km
              </span>
            </Td>
            <Td>
              <Pill
                label={r.status}
                bg={r.status === "Laudo Emitido" ? S.redLight : S.orangeLight}
                color={r.status === "Laudo Emitido" ? S.red : S.orange}
              />
            </Td>
            <Td>
              <BtnAcao />
            </Td>
          </>
        )}
      />
      <Paginacao total={VISTORIAS_FANTASMA.length} />
    </PanelCard>
  );
}
