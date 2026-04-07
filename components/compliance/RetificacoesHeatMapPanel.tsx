"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { PanelCard } from "@/components/ui/PanelCard";

const ParaIbgeHeatMap = dynamic(
  () =>
    import("@/components/maps/ParaIbgeHeatMap").then((m) => ({
      default: m.ParaIbgeHeatMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[420px] animate-pulse rounded-md border border-sicarf-gray-200 bg-sicarf-gray-100" />
    ),
  },
);

/** Mapa de calor em card próprio, acima da tabela de retificações. */
export function RetificacoesHeatMapPanel() {
  return (
    <div className="mb-5">
      <PanelCard>
        <div className="mb-2 flex items-center gap-2 border-b border-sicarf-gray-200 pb-2 text-sm font-bold text-sicarf-gray-800">
          <MapPin
            className="size-4 shrink-0 text-sicarf-green"
            strokeWidth={2}
            aria-hidden
          />
          <span>Mapa de calor — incidência por município (Pará)</span>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-sicarf-gray-600">
          Mapa interativo com delimitação dos municípios do IBGE. As cores
          indicam a concentração relativa de alertas e irregularidades
          associadas aos dados do painel, apontando onde a fiscalização pode ser
          priorizada.
        </p>
        <ParaIbgeHeatMap />
      </PanelCard>
    </div>
  );
}
