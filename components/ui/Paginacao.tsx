import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface PaginacaoProps {
  total: number;
  por?: number;
}

function PagBtn({
  children,
  ativo,
}: {
  children: ReactNode;
  ativo?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex h-[30px] min-w-[30px] cursor-pointer items-center justify-center rounded border text-[13px] font-semibold ${
        ativo
          ? "border-sicarf-green bg-sicarf-green text-white"
          : "border-sicarf-gray-200 bg-white text-sicarf-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

export function Paginacao({ total, por = 5 }: PaginacaoProps) {
  const pags = Math.max(1, Math.ceil(total / por));
  return (
    <div className="flex items-center justify-center gap-1 py-3.5 pb-0.5">
      <PagBtn>
        <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
      </PagBtn>
      {Array.from({ length: Math.min(pags, 6) }, (_, i) => (
        <PagBtn key={i} ativo={i === 0}>
          {i + 1}
        </PagBtn>
      ))}
      {pags > 6 && (
        <>
          <span className="text-[13px] text-sicarf-gray-400">...</span>
          <PagBtn>{pags}</PagBtn>
        </>
      )}
      <PagBtn>
        <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
      </PagBtn>
    </div>
  );
}
