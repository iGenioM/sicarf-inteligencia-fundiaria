import { forwardRef } from "react";

export type FormTextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const baseClass =
  "w-full min-h-[44px] rounded-lg border border-sicarf-gray-200 bg-white px-3 py-2.5 text-sm text-sicarf-gray-800 outline-none transition-[color,box-shadow,border-color] placeholder:text-sicarf-gray-400 focus:border-sicarf-green focus:ring-1 focus:ring-sicarf-green/25";

/**
 * Campo de texto com borda suave, cantos arredondados e foco verde SICARF.
 */
export const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
  function FormTextInput({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`${baseClass} ${className}`.trim()}
        {...props}
      />
    );
  },
);
