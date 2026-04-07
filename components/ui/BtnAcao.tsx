import { ChevronDown } from "lucide-react";

export function BtnAcao() {
  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1 rounded border border-sicarf-green-dark bg-sicarf-green px-3.5 py-1 text-xs font-semibold text-white"
    >
      Ações
      <ChevronDown className="size-3.5 shrink-0 opacity-90" strokeWidth={2} />
    </button>
  );
}
