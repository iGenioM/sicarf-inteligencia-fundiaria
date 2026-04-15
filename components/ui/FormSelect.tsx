import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

export type FormSelectProps =
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    /** Inclui primeira opção vazia com o texto "Selecione" */
    placeholderSelecione?: boolean;
    /** Altura e tipografia reduzidas (ex.: barra de filtros) */
    compact?: boolean;
  };

const baseClass =
  "w-full appearance-none rounded-lg border border-sicarf-gray-200 bg-white outline-none transition-[color,box-shadow,border-color] focus:border-sicarf-green focus:ring-1 focus:ring-sicarf-green/25";

const sizeDefault =
  "min-h-[44px] py-2.5 pl-3 pr-10 text-sm";
const sizeCompact =
  "h-9 min-h-0 py-1.5 pl-2 pr-8 text-xs";

/**
 * Select nativo com ícone de chevron à direita e estilo alinhado aos demais campos.
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  function FormSelect(
    {
      className = "",
      children,
      placeholderSelecione,
      compact,
      value,
      ...props
    },
    ref,
  ) {
    const isControlled = value !== undefined;
    const textoPlaceholder =
      Boolean(placeholderSelecione) &&
      isControlled &&
      (value === "" || value === null);

    const corTexto = textoPlaceholder
      ? "text-sicarf-gray-400"
      : "text-sicarf-gray-800";

    const tamanho = compact ? sizeCompact : sizeDefault;
    const iconeChevron = compact
      ? "pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-sicarf-gray-400"
      : "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-sicarf-gray-400";

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`${baseClass} ${tamanho} ${corTexto} ${className}`.trim()}
          {...props}
          {...(isControlled ? { value: value as string | number | readonly string[] } : {})}
        >
          {placeholderSelecione ? (
            <option value="" disabled>
              Selecione
            </option>
          ) : null}
          {children}
        </select>
        <ChevronDown
          className={iconeChevron}
          aria-hidden
          strokeWidth={2}
        />
      </div>
    );
  },
);
