import type { ReactNode } from "react";

interface MetricCardProps {
  value: ReactNode;
  label: string;
  valueClassName?: string;
  className?: string;
  /** @default true */
  centered?: boolean;
}

export function MetricCard({
  value,
  label,
  valueClassName = "text-sicarf-gray-800",
  className = "",
  centered = true,
}: MetricCardProps) {
  return (
    <div
      className={`flex-1 rounded-md border border-sicarf-gray-200 px-4 py-3 ${centered ? "text-center" : "text-left"} ${className}`}
    >
      <div className={`text-[22px] font-bold ${valueClassName}`}>{value}</div>
      <div className="mt-1 text-[11px] text-sicarf-gray-500">{label}</div>
    </div>
  );
}
