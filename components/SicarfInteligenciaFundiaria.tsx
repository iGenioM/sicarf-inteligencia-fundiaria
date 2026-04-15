"use client";

import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { CampanhaStepper } from "@/components/inteligencia-fundiaria/CampanhaStepper";
import {
  InteligenciaDemoProvider,
  useInteligenciaDemo,
} from "@/components/inteligencia-fundiaria/InteligenciaDemoContext";
import { InteligenciaSidebar } from "@/components/inteligencia-fundiaria/InteligenciaSidebar";
import type { InteligenciaNavId } from "@/components/inteligencia-fundiaria/InteligenciaSidebar";
import {
  StepAcompanhamento,
  StepComparar,
  StepExportar,
  StepParametros,
  StepProjecao,
} from "@/components/inteligencia-fundiaria/InteligenciaSteps";

const ETAPAS = [
  "Parâmetros",
  "Projeção de resultados",
  "Comparar cenários",
  "Acompanhamento",
  "Exportar plano",
] as const;

function SicarfInteligenciaFundiariaInner() {
  useInteligenciaDemo();
  const [navLateral, setNavLateral] =
    useState<InteligenciaNavId>("simulador");
  const [indiceEtapa, setIndiceEtapa] = useState(0);

  const rotulosNavegacao = useMemo(() => {
    const anterior =
      indiceEtapa === 0
        ? "Início"
        : indiceEtapa === 1
          ? "Parâmetros"
          : indiceEtapa === 2
            ? "Projeção"
            : indiceEtapa === 3
              ? "Comparar cenários"
              : "Acompanhamento";
    const proximo =
      indiceEtapa === 0
        ? "Projeção de resultados"
        : indiceEtapa === 1
          ? "Comparar cenários"
          : indiceEtapa === 2
            ? "Acompanhamento"
            : indiceEtapa === 3
              ? "Exportar plano"
              : "Concluir";
    return { anterior, proximo };
  }, [indiceEtapa]);

  const irParaEtapa = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(ETAPAS.length - 1, i));
    setIndiceEtapa(clamped);
    setNavLateral(clamped === 3 ? "acompanhamento" : "simulador");
  }, []);

  const proximo = useCallback(() => {
    irParaEtapa(indiceEtapa + 1);
  }, [indiceEtapa, irParaEtapa]);

  const anterior = useCallback(() => {
    irParaEtapa(indiceEtapa - 1);
  }, [indiceEtapa, irParaEtapa]);

  const onNavigateLateral = useCallback((id: InteligenciaNavId) => {
    setNavLateral(id);
    if (id === "acompanhamento") {
      setIndiceEtapa(3);
    } else {
      setIndiceEtapa(0);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-sicarf-gray-100 font-sans">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <InteligenciaSidebar ativo={navLateral} onNavigate={onNavigateLateral} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto bg-white p-6">
            <div className="mx-auto max-w-[1400px]">
              <CampanhaStepper
                etapas={[...ETAPAS]}
                indiceAtual={indiceEtapa}
                onSelecionarEtapa={irParaEtapa}
              />
            </div>
              <div className="mx-auto max-w-[1400px] rounded-md border border-sicarf-gray-200 bg-white p-5">
                    <div className="min-h-[280px]">
                      {indiceEtapa === 0 ? <StepParametros /> : null}
                      {indiceEtapa === 1 ? <StepProjecao /> : null}
                      {indiceEtapa === 2 ? <StepComparar /> : null}
                      {indiceEtapa === 3 ? <StepAcompanhamento /> : null}
                      {indiceEtapa === 4 ? <StepExportar /> : null}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-sicarf-gray-200 pt-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-sicarf-green hover:underline"
                      >
                        Cancelar
                      </button>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded border border-sicarf-green bg-white px-3.5 py-2 text-xs font-semibold text-sicarf-green hover:bg-sicarf-green-light"
                        >
                          <Save className="size-3.5" strokeWidth={2} />
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={anterior}
                          disabled={indiceEtapa === 0}
                          className="inline-flex items-center gap-1 rounded border border-sicarf-gray-200 bg-sicarf-gray-50 px-3.5 py-2 text-xs font-semibold text-sicarf-gray-600 hover:bg-sicarf-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft className="size-3.5" strokeWidth={2} />
                          {rotulosNavegacao.anterior}
                        </button>
                        <button
                          type="button"
                          onClick={proximo}
                          disabled={indiceEtapa >= ETAPAS.length - 1}
                          className="inline-flex items-center gap-1 rounded bg-sicarf-green px-3.5 py-2 text-xs font-semibold text-white hover:bg-sicarf-green-dark disabled:cursor-not-allowed disabled:bg-sicarf-gray-200 disabled:text-sicarf-gray-500 disabled:hover:bg-sicarf-gray-200"
                        >
                          {rotulosNavegacao.proximo}
                          <ChevronRight className="size-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Módulo Inteligência Fundiária — simulador de campanha com fluxo em etapas
 * (stepper horizontal); dados Pará / Maranhão conforme último dígito do CPF do login.
 */
export function SicarfInteligenciaFundiaria() {
  return (
    <InteligenciaDemoProvider>
      <SicarfInteligenciaFundiariaInner />
    </InteligenciaDemoProvider>
  );
}
