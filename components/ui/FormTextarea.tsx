import { forwardRef } from "react";

export type FormTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const baseClass =
  "w-full rounded-lg border border-sicarf-gray-200 bg-white px-3 py-2.5 text-sm text-sicarf-gray-800 outline-none transition-[color,box-shadow,border-color] placeholder:text-sicarf-gray-400 focus:border-sicarf-green focus:ring-1 focus:ring-sicarf-green/25";

export const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(function FormTextarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${baseClass} ${className}`.trim()}
      {...props}
    />
  );
});
