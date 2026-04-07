import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SecTitleProps {
  icon?: LucideIcon;
  children: ReactNode;
}

export function SecTitle({ icon: Icon, children }: SecTitleProps) {
  return (
    <div className="mb-2.5 flex items-center gap-2 border-b border-sicarf-gray-200 pb-2 text-sm font-bold text-sicarf-gray-800">
      {Icon ? (
        <Icon
          className="size-4 shrink-0 text-sicarf-green"
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
      <span className="min-w-0">{children}</span>
    </div>
  );
}
