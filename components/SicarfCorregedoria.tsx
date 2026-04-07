"use client";

import { useEffect, useState } from "react";
import { GestaoCartorios } from "@/components/cartorios/GestaoCartorios";
import { DashCompliance } from "@/components/compliance/DashCompliance";
import { AppHeader } from "@/components/layout/AppHeader";
import { SearchBar } from "@/components/layout/SearchBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HEAT_DATA } from "@/lib/data/mock";
import type { AppMainNavId, MunicipioIbge } from "@/lib/types";

const IBGE_PA =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados/PA/municipios";

export function SicarfCorregedoria() {
  const [municipios, setMunicipios] = useState<MunicipioIbge[]>([]);
  const [nav, setNav] = useState<AppMainNavId>("compliance");

  useEffect(() => {
    fetch(IBGE_PA)
      .then((r) => r.json())
      .then((data: { id: number; nome: string }[]) =>
        setMunicipios(data.map((m) => ({ id: m.id, nome: m.nome }))),
      )
      .catch(() =>
        setMunicipios(
          Object.keys(HEAT_DATA).map((nome, i) => ({ id: i, nome })),
        ),
      );
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-sicarf-gray-100 font-sans">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <Sidebar active={nav} onNavigate={setNav} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <main className="flex-1 overflow-auto bg-white p-6">
            <SearchBar />
            {nav === "compliance" ? (
              <DashCompliance />
            ) : (
              <GestaoCartorios municipios={municipios} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
