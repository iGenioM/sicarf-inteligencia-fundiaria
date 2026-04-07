import type { ReactNode } from "react";

interface TotalizadorProps {
  label: string;
  valor: ReactNode;
  badge?: ReactNode;
  badgeBg?: string;
  badgeColor?: string;
  ativo?: boolean;
  onClick?: () => void;
  icone?: ReactNode;
}

export function Totalizador({
  label,
  valor,
  badge,
  badgeBg,
  badgeColor,
  ativo,
  onClick,
  icone,
}: TotalizadorProps) {
  const className = `flex min-w-[155px] flex-1 flex-col gap-1 rounded-md border px-4 py-3.5 text-left transition-all duration-150 ${
    ativo
      ? "border-sicarf-green-dark bg-sicarf-green"
      : "border-sicarf-gray-200 bg-white"
  } ${onClick ? "cursor-pointer hover:border-sicarf-gray-300" : "cursor-default"}`;

  const inner = (
    <>
      <div className="flex items-center gap-1.5">
        {icone != null && (
          <span
            className={`flex shrink-0 items-center opacity-90 [&_svg]:size-[17px] [&_svg]:shrink-0 ${
              ativo
                ? "[&_svg]:text-[#c6f6d5]"
                : "[&_svg]:text-sicarf-gray-500"
            }`}
          >
            {icone}
          </span>
        )}
        <span
          className={`text-xs font-medium leading-snug ${
            ativo ? "text-[#c6f6d5]" : "text-sicarf-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
      <div
        className={`text-[28px] font-bold leading-none ${
          ativo ? "text-white" : "text-sicarf-gray-800"
        }`}
      >
        {valor}
      </div>
      {badge != null && (
        <span
          className="self-start rounded px-1.5 py-px text-[11px] font-bold"
          style={{
            background: badgeBg ?? "#fed7d7",
            color: badgeColor ?? "#c53030",
          }}
        >
          {badge}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}
