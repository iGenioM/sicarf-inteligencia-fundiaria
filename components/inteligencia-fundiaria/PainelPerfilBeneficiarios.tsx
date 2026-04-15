"use client";

import { PanelCard } from "@/components/ui/PanelCard";
import type { PerfilBeneficiarioFatia } from "@/lib/inteligencia-fundiaria-dados";

const CORES_DONUT = ["#4B7A3E", "#3262B5", "#6A2891"] as const;

function montarConicGradient(fatias: readonly PerfilBeneficiarioFatia[]): string {
  let acc = 0;
  const stops: string[] = [];
  fatias.forEach((f, i) => {
    const next = acc + f.pct;
    const cor = CORES_DONUT[i] ?? "#718096";
    stops.push(`${cor} ${acc}% ${next}%`);
    acc = next;
  });
  if (acc < 100) {
    stops.push(`#E6E6E6 ${acc}% 100%`);
  }
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

export function PainelPerfilBeneficiarios({
  total,
  fatias,
}: {
  total: string;
  fatias: readonly PerfilBeneficiarioFatia[];
}) {
  const resumoAria = fatias
    .map((f) => `${f.rotulo}: ${f.pct}%`)
    .join("; ");
  const background = montarConicGradient(fatias);

  return (
    <PanelCard>
      <div className="mb-3 border-b border-sicarf-gray-200 pb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
        Perfil dos beneficiários
      </div>
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative h-[148px] w-[148px] shrink-0"
          role="img"
          aria-label={`Distribuição por modalidade entre ${total} ocupações. ${resumoAria}`}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background }}
          />
          <div className="absolute inset-[26px] flex flex-col items-center justify-center rounded-full bg-white text-center leading-tight">
            <span className="text-2xl font-bold text-sicarf-gray-800">
              {total}
            </span>
            <span className="text-[11px] font-medium text-sicarf-gray-500">
              ocupações
            </span>
          </div>
        </div>
        <ul className="w-full space-y-2 text-left text-[11px] text-sicarf-gray-600">
          {fatias.map((f, i) => (
            <li key={f.rotulo} className="flex items-start gap-2">
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: CORES_DONUT[i] ?? "#718096",
                }}
                aria-hidden
              />
              <span>
                <span className="text-sicarf-gray-700">{f.rotulo}</span>
                <span className="font-semibold text-sicarf-gray-800">
                  {" "}
                  — {f.pct}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PanelCard>
  );
}
