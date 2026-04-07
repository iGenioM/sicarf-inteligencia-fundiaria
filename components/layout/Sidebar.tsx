import { Building2, LayoutDashboard, type LucideIcon } from "lucide-react";
import type { AppMainNavId } from "@/lib/types";

const ITEMS: { id: AppMainNavId; Icon: LucideIcon; label: string }[] = [
  {
    id: "compliance",
    Icon: LayoutDashboard,
    label: "Dashboard de Compliance",
  },
  {
    id: "cartorios",
    Icon: Building2,
    label: "Gestão e Monitoramento de Cartórios",
  },
];

interface SidebarProps {
  active: AppMainNavId;
  onNavigate: (id: AppMainNavId) => void;
}

/**
 * Navegação vertical à esquerda, abaixo do header (altura = viewport − header).
 */
export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside
      className="flex w-[110px] shrink-0 flex-col border-r border-sicarf-gray-200 bg-sicarf-gray-100"
      aria-label="Navegação principal"
    >
      <nav className="flex flex-col pt-2">
        {ITEMS.map((item) => {
          const Icon = item.Icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative flex w-full cursor-pointer flex-col items-center gap-1.5 px-2 py-3.5 ${
                isActive ? "bg-white" : "bg-transparent"
              }`}
            >
              {isActive && (
                <div
                  className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-8 border-r-8 border-y-transparent border-r-sicarf-green"
                  aria-hidden
                />
              )}
              <Icon
                className={`size-5 shrink-0 ${
                  isActive ? "text-sicarf-green" : "text-sicarf-gray-500"
                }`}
                strokeWidth={2}
                aria-hidden
              />
              <span
                className={`text-center text-[11px] leading-snug ${
                  isActive
                    ? "font-bold text-sicarf-green"
                    : "font-normal text-sicarf-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
