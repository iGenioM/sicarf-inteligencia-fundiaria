import type { ReactNode } from "react";

export function PanelCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-sicarf-gray-200 bg-white px-5 py-[18px]">
      {children}
    </div>
  );
}
