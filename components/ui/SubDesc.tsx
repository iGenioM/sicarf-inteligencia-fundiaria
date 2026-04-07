import type { ReactNode } from "react";

export function SubDesc({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 text-xs leading-relaxed text-sicarf-gray-500">
      {children}
    </div>
  );
}
