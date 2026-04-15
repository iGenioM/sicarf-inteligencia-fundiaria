"use client";

import { Check, ChevronRight } from "lucide-react";

export interface CampanhaStepperProps {
  /** Rótulos das etapas, na ordem */
  etapas: string[];
  /** Índice da etapa atual (0-based) */
  indiceAtual: number;
  /** Permite voltar clicando em etapas já concluídas */
  onSelecionarEtapa?: (indice: number) => void;
}

/**
 * Stepper horizontal no padrão SICARF (etapas concluídas com check verde,
 * etapa atual com círculo vazio, separadores em chevron).
 */
export function CampanhaStepper({
  etapas,
  indiceAtual,
  onSelecionarEtapa,
}: CampanhaStepperProps) {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-y-2 rounded-md bg-[#F5F7FA] px-4 py-3.5 "
      aria-label="Etapas do simulador de campanha"
    >
      {etapas.map((rotulo, i) => {
        const concluida = i < indiceAtual;
        const atual = i === indiceAtual;
        const podeClicar = concluida && onSelecionarEtapa != null;

        return (
          <div key={rotulo} className="flex flex-wrap items-center">
            {i > 0 ? (
              <ChevronRight
                className="mx-1 size-4 shrink-0 text-[#E5E1E1]"
                strokeWidth={2}
                aria-hidden
              />
            ) : null}
            <button
              type="button"
              disabled={!podeClicar}
              onClick={() => podeClicar && onSelecionarEtapa?.(i)}
              className={`flex items-center gap-2 rounded-md px-1 py-0.5 text-left transition-colors ${
                podeClicar
                  ? "cursor-pointer hover:bg-sicarf-gray-50"
                  : atual
                    ? "cursor-default"
                    : "cursor-default opacity-90"
              }`}
              aria-current={atual ? "step" : undefined}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  concluida
                    ? "bg-sicarf-green text-white"
                    : atual
                      ? "border-2 border-sicarf-gray-400 bg-transparent text-transparent"
                      : "border border-sicarf-gray-300 bg-transparent text-sicarf-gray-400"
                }`}
                aria-hidden
              >
                {concluida ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </span>
              <span
                className={`max-w-[200px] text-xs font-semibold leading-tight sm:max-w-none ${
                  concluida
                    ? "text-sicarf-green"
                    : atual
                      ? "text-sicarf-gray-800"
                      : "text-sicarf-gray-500"
                }`}
              >
                {rotulo}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
