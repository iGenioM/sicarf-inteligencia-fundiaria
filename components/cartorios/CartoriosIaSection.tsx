import { Bot } from "lucide-react";
import { IaAgentLogCard } from "@/components/cartorios/IaAgentLogCard";
import { PanelCard } from "@/components/ui/PanelCard";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { IA_AGENT_LOG } from "@/lib/data/mock";

export function CartoriosIaSection() {
  return (
    <PanelCard>
      <SecTitle icon={Bot}>
        Central de Controle do Agente de IA — Integração Tipo 2
      </SecTitle>
      <SubDesc>
        Monitoramento dos logs de ação do Agente Inteligente SICARF: o que foi
        lido no sistema e o que foi preenchido no cartório. Divergências são
        sinalizadas automaticamente para revisão da Corregedoria.
      </SubDesc>
      <div className="flex flex-col gap-2.5">
        {IA_AGENT_LOG.map((log, i) => (
          <IaAgentLogCard key={i} log={log} />
        ))}
      </div>
    </PanelCard>
  );
}
