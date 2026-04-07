import type { ReactNode } from "react";

interface PillProps {
  label: ReactNode;
  bg: string;
  color?: string;
  className?: string;
}

export function Pill({ label, bg, color, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 whitespace-nowrap rounded px-2.5 py-0.5 text-[11px] font-bold ${className}`}
      style={{ background: bg, color: color ?? "#ffffff" }}
    >
      {label}
    </span>
  );
}
