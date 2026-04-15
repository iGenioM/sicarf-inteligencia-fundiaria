"use client";

import { useInteligenciaDemo } from "@/components/inteligencia-fundiaria/InteligenciaDemoContext";

/**
 * Indica qual conjunto de dados do simulador está ativo, conforme o CPF usado no login
 * (último dígito: 0 = Pará, 1 = Maranhão). Sem campo de CPF na tela.
 */
export function EstadoRegiaoLoginBadge() {
  const { estadoAtivo, invalido } = useInteligenciaDemo();

  if (invalido) {
    return (
      <div
        className="flex w-full shrink-0 flex-wrap items-center gap-2 border-b border-sicarf-gray-200 bg-sicarf-red-bg px-4 py-2 sm:px-6"
        role="status"
      >
        <span className="rounded-full border border-sicarf-red bg-white px-3 py-1 text-[11px] font-bold text-sicarf-red">
          CPF não autorizado para este conteúdo regional
        </span>
        <span className="text-[11px] text-sicarf-gray-600">
          Faça logout e entre com um CPF cujo último dígito seja <strong>0</strong>{" "}
          (Pará) ou <strong>1</strong> (Maranhão).
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex w-full shrink-0 flex-wrap items-center gap-2 border-b border-sicarf-gray-200 bg-sicarf-gray-50 px-4 py-2 sm:px-6"
      role="status"
      aria-label="Região do conteúdo conforme CPF do login"
    >
      <span className="text-[11px] text-sicarf-gray-600">
        Conteúdo conforme CPF do login:
      </span>
      {estadoAtivo === "MA" ? (
        <span className="rounded-full border border-sicarf-green-dark bg-sicarf-green-light px-3 py-1 text-[11px] font-bold text-sicarf-green-dark">
          📍 Maranhão — ITERMA
        </span>
      ) : (
        <span className="rounded-full border border-sicarf-green-dark bg-sicarf-green-light px-3 py-1 text-[11px] font-bold text-sicarf-green-dark">
          📍 Pará — ITERPA
        </span>
      )}
    </div>
  );
}
