import type { ReactNode } from "react";

type FieldLabelProps = {
  children: ReactNode;
  /** Exibe asterisco vermelho ao lado do rótulo */
  obrigatorio?: boolean;
  htmlFor?: string;
  className?: string;
};

/**
 * Rótulo de campo alinhado ao estilo de formulário (texto semibold, cinza escuro).
 */
export function FieldLabel({
  children,
  obrigatorio = false,
  htmlFor,
  className = "",
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1.5 block text-sm font-semibold text-sicarf-gray-600 ${className}`}
    >
      {children}
      {obrigatorio ? (
        <span className="text-sicarf-red" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}
