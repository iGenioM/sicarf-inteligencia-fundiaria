import { Cog } from "lucide-react";
import { MALHA_FINA } from "@/lib/data/mock";
import { S } from "@/lib/colors";

interface MalhaFinaBannerProps {
  cartoriosVerificados: number;
}

export function MalhaFinaBanner({ cartoriosVerificados }: MalhaFinaBannerProps) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-md border border-sicarf-orange-light bg-sicarf-orange-bg px-3.5 py-2.5 text-xs">
      <Cog
        className="mt-0.5 size-4 shrink-0"
        style={{ color: S.orange }}
        strokeWidth={2}
        aria-hidden
      />
      <p>
        <strong style={{ color: S.orange }}>Robô de Conciliação Ativo</strong> ·
        Última varredura: <strong>07/04/2026 09:00</strong> · Próxima:{" "}
        <strong>07/04/2026 21:00</strong> · Cartórios verificados:{" "}
        <strong>{cartoriosVerificados}</strong> · Inconsistências detectadas:{" "}
        <strong className="text-sicarf-red">{MALHA_FINA.length}</strong>
      </p>
    </div>
  );
}
