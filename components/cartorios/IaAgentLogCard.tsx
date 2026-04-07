import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Siren,
} from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import type { IaAgentLogEntry } from "@/lib/types";
import { S } from "@/lib/colors";

interface IaAgentLogCardProps {
  log: IaAgentLogEntry;
}

export function IaAgentLogCard({ log }: IaAgentLogCardProps) {
  return (
    <div
      className={`rounded-md border p-4 ${
        log.ok
          ? "border-sicarf-gray-200 border-l-4 border-l-sicarf-green bg-white"
          : "border-sicarf-red border-l-4 border-l-sicarf-red bg-sicarf-red-bg"
      }`}
    >
      <div className="mb-2 flex justify-between">
        <strong className="text-[13px]">{log.cartorio}</strong>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-sicarf-gray-400">
            {log.ts}
          </span>
          <Pill
            label={
              log.ok ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3 shrink-0" strokeWidth={2.5} />
                  Íntegro
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <AlertTriangle
                    className="size-3 shrink-0"
                    strokeWidth={2}
                  />
                  Divergência
                </span>
              )
            }
            bg={log.ok ? S.greenLight : S.redLight}
            color={log.ok ? S.green : S.red}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] text-sicarf-gray-400">
            <ArrowDownToLine className="size-3.5 shrink-0" strokeWidth={2} />
            Lido no SICARF
          </div>
          <div className="rounded bg-sicarf-gray-50 px-2.5 py-1.5 text-sicarf-gray-700">
            {log.leu}
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] text-sicarf-gray-400">
            <ArrowUpFromLine className="size-3.5 shrink-0" strokeWidth={2} />
            Preenchido no Cartório
          </div>
          <div
            className={`rounded px-2.5 py-1.5 ${
              log.ok
                ? "bg-sicarf-gray-50 text-sicarf-gray-700"
                : "bg-sicarf-red-light font-bold text-sicarf-red"
            }`}
          >
            {log.preencheu}
          </div>
        </div>
      </div>
      <div className="mt-2 text-[11px] text-sicarf-gray-400">
        Processo: <span className="font-mono">{log.processo}</span>
      </div>
      {!log.ok && (
        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-sicarf-red bg-sicarf-red px-3.5 py-1 text-xs font-semibold text-white"
          >
            <Siren className="size-3.5 shrink-0" strokeWidth={2} />
            Acionar Corregedoria
          </button>
          <button
            type="button"
            className="cursor-pointer rounded border border-sicarf-gray-200 bg-white px-3.5 py-1 text-xs text-sicarf-gray-700"
          >
            Ver processo
          </button>
        </div>
      )}
    </div>
  );
}
