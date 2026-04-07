import { ArrowDownUp } from "lucide-react";
import type { ReactNode } from "react";

interface TabelaProps<T> {
  colunas: string[];
  linhas: T[];
  renderLinha: (linha: T, index: number) => ReactNode;
}

export function Tabela<T>({ colunas, linhas, renderLinha }: TabelaProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-sicarf-gray-50">
            {colunas.map((c, i) => (
              <th
                key={i}
                className="whitespace-nowrap border-b border-sicarf-gray-200 px-3.5 py-2.5 text-left text-xs font-semibold text-sicarf-gray-500"
              >
                <span className="inline-flex items-center gap-0.5">
                  {c}
                  {c ? (
                    <ArrowDownUp
                      className="size-2.5 shrink-0 text-sicarf-gray-400"
                      strokeWidth={2}
                      aria-hidden
                    />
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr
              key={i}
              className={`border-b border-sicarf-gray-200 ${
                i % 2 === 0 ? "bg-white" : "bg-sicarf-gray-50"
              }`}
            >
              {renderLinha(linha, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TdProps {
  children: ReactNode;
  className?: string;
}

export function Td({ children, className = "" }: TdProps) {
  return (
    <td
      className={`align-middle px-3.5 py-2.5 text-[13px] text-sicarf-gray-800 ${className}`}
    >
      {children}
    </td>
  );
}
