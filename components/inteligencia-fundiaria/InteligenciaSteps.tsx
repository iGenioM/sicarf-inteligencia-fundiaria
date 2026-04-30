"use client";

import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Layers,
  LineChart,
  MapPinned,
  Star,
} from "lucide-react";
import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useInteligenciaDemo } from "@/components/inteligencia-fundiaria/InteligenciaDemoContext";
import { PainelPerfilBeneficiarios } from "@/components/inteligencia-fundiaria/PainelPerfilBeneficiarios";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextInput } from "@/components/ui/FormTextInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { PanelCard } from "@/components/ui/PanelCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Pill } from "@/components/ui/Pill";
import { SecTitle } from "@/components/ui/SecTitle";
import { SubDesc } from "@/components/ui/SubDesc";
import { Tabela, Td } from "@/components/ui/Tabela";
import { S } from "@/lib/colors";
import type {
  AcompanhamentoTabelaLinha,
  AlertaGargaloDemo,
  EquipeOperacionalDemo,
} from "@/lib/inteligencia-fundiaria-dados";

function diasNoIntervalo(dataInicio: string, dataFim: string): number {
  const a = new Date(`${dataInicio}T12:00:00`);
  const b = new Date(`${dataFim}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 30;
  const ms = b.getTime() - a.getTime();
  const dias = Math.floor(ms / 86400000) + 1;
  return Math.max(1, dias);
}

/** Duas etiquetas com os percentuais (cronograma vs títulos), sem barras. */
function TagsRitmoCampanha({
  pctTempo,
  pctTitulos,
}: {
  pctTempo: number;
  pctTitulos: number;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <span className="inline-flex rounded border border-sicarf-gray-200 bg-sicarf-gray-50 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-sicarf-gray-800">
        Cronograma {pctTempo}%
      </span>
      <span className="inline-flex rounded border border-sicarf-gray-200 bg-sicarf-gray-50 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-sicarf-gray-800">
        Títulos {pctTitulos}%
      </span>
    </div>
  );
}

type IndicadorMunicipioDemo = { ocupacoes: number; titulosProjetados: number };
type ImovelElegivelRow = {
  idImovel: string;
  municipio: string;
  codigoCar: string;
  areaTotalHa: string;
  statusCar: string;
};
type FaixaTamanhoImovel = {
  faixa: string;
  quantidade: number;
};

const INDICADORES_MA_POR_MUNICIPIO: Record<string, IndicadorMunicipioDemo> = {
  "Alto Alegre do Pindaré": { ocupacoes: 3133, titulosProjetados: 3133 },
  Barreirinhas: { ocupacoes: 6096, titulosProjetados: 6096 },
  "Vargem Grande": { ocupacoes: 4859, titulosProjetados: 4859 },
};
const DISTRIBUICAO_TAMANHO_IMOVEIS: Record<string, FaixaTamanhoImovel[]> = {
  "Vargem Grande": [
    { faixa: "0 ha - 5 ha", quantidade: 2829 },
    { faixa: "5 ha - 15 ha", quantidade: 1003 },
    { faixa: "15 ha - 37 ha", quantidade: 706 },
    { faixa: "37 ha - 67 ha", quantidade: 219 },
    { faixa: "67 ha - 100 ha", quantidade: 102 },
  ],
  Barreirinhas: [
    { faixa: "0 ha - 3 ha", quantidade: 4550 },
    { faixa: "3 ha - 9 ha", quantidade: 784 },
    { faixa: "9 ha - 24 ha", quantidade: 566 },
    { faixa: "24 ha - 50 ha", quantidade: 107 },
    { faixa: "50 ha - 100 ha", quantidade: 89 },
  ],
  "Alto Alegre do Pindaré": [
    { faixa: "0 ha - 15 ha", quantidade: 696 },
    { faixa: "15 ha - 36 ha", quantidade: 598 },
    { faixa: "36 ha - 56 ha", quantidade: 710 },
    { faixa: "56 ha - 77 ha", quantidade: 558 },
    { faixa: "77 ha - 100 ha", quantidade: 571 },
  ],
};

function estimarAreaRegularizavelHa(faixas: FaixaTamanhoImovel[]): number {
  return faixas.reduce((acc, item) => {
    const match = item.faixa.match(/(\d+)\s*ha\s*-\s*(\d+)\s*ha/i);
    if (!match) return acc;
    const minimo = Number(match[1]);
    const maximo = Number(match[2]);
    const mediaFaixa = (minimo + maximo) / 2;
    return acc + mediaFaixa * item.quantidade;
  }, 0);
}

function gerarImoveisDemo(
  municipio: string,
  prefixoIbge: string,
  qtd: number,
  inicioId: number,
): ImovelElegivelRow[] {
  const status: Array<ImovelElegivelRow["statusCar"]> = [
    "Ativo",
    "Análise",
    "Pendente",
  ];
  return Array.from({ length: qtd }, (_, idx) => {
    const idNum = inicioId + idx;
    const area = (62 + ((idx * 17) % 180) + (idx % 3) * 0.37).toFixed(2);
    const bloco1 = ((idNum * 37 + 11) >>> 0)
      .toString(16)
      .toUpperCase()
      .padStart(8, "0");
    const bloco2 = ((idNum * 53 + 7) >>> 0)
      .toString(16)
      .toUpperCase()
      .padStart(8, "0");
    const bloco3 = ((idNum * 97 + 19) >>> 0)
      .toString(16)
      .toUpperCase()
      .padStart(8, "0");
    const bloco4 = ((idNum * 131 + 23) >>> 0)
      .toString(16)
      .toUpperCase()
      .padStart(8, "0");
    const sufixoCar = `${bloco1}${bloco2}${bloco3}${bloco4}`;
    return {
      idImovel: `IMV-MA-${String(idNum).padStart(4, "0")}`,
      municipio,
      codigoCar: `MA-${prefixoIbge}-${sufixoCar}`,
      areaTotalHa: area.replace(".", ","),
      statusCar: status[idx % status.length],
    };
  });
}

const IMOVEIS_ELEGIVEIS_CAR_DEMO: ImovelElegivelRow[] = [
  ...gerarImoveisDemo("Alto Alegre do Pindaré", "2100477", 24, 1),
  ...gerarImoveisDemo("Barreirinhas", "2101707", 24, 1001),
  ...gerarImoveisDemo("Vargem Grande", "2111201", 24, 2001),
];

/** Select com aparência de campo único; ao abrir, checkboxes permitem várias equipes. */
function SelectMultiEquipes({
  id,
  equipes,
  selecionados,
  onChange,
}: {
  id: string;
  equipes: readonly EquipeOperacionalDemo[];
  selecionados: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fechar(ev: MouseEvent) {
      if (ref.current && !ref.current.contains(ev.target as Node)) {
        setAberto(false);
      }
    }
    if (aberto) {
      document.addEventListener("mousedown", fechar);
      return () => document.removeEventListener("mousedown", fechar);
    }
  }, [aberto]);

  const textoResumo = useMemo(() => {
    if (selecionados.size === 0) return "Selecione as equipes…";
    const nomes = equipes
      .filter((e) => selecionados.has(e.id))
      .map((e) => e.nome);
    if (nomes.length <= 2) return nomes.join(", ");
    return `${nomes.length} equipes selecionadas`;
  }, [equipes, selecionados]);

  function alternar(idEq: string) {
    const n = new Set(selecionados);
    if (n.has(idEq)) n.delete(idEq);
    else n.add(idEq);
    onChange(n);
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        id={id}
        aria-expanded={aberto}
        aria-haspopup="listbox"
        onClick={() => setAberto((a) => !a)}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border border-sicarf-gray-200 bg-white px-3 py-2.5 text-left text-sm text-sicarf-gray-800 outline-none transition-[color,box-shadow,border-color] focus:border-sicarf-green focus:ring-1 focus:ring-sicarf-green/25"
      >
        <span className="min-w-0 flex-1 truncate">{textoResumo}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-sicarf-gray-400 transition-transform ${aberto ? "rotate-180" : ""}`}
          aria-hidden
          strokeWidth={2}
        />
      </button>
      {aberto ? (
        <ul
          role="listbox"
          aria-multiselectable
          className="absolute left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-lg border border-sicarf-gray-200 bg-white py-1 shadow-lg"
        >
          {equipes.map((e) => {
            const marcado = selecionados.has(e.id);
            return (
              <li key={e.id} role="option" aria-selected={marcado}>
                <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-sicarf-gray-50">
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => alternar(e.id)}
                    className="accent-sicarf-green"
                  />
                  <span className="min-w-0 flex-1">{e.nome}</span>
                  <span className="shrink-0 tabular-nums text-xs text-sicarf-gray-500">
                    {e.processosPorDia.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    proc./dia
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function StepParametros() {
  const { dados, previsaoTitulos, setPrevisaoTitulos, setParametrosProjecao } =
    useInteligenciaDemo();
  const dadosComRegiao = dados as typeof dados & {
    municipiosPorRegiao?: Record<string, string[]>;
  };
  const idRegiao = useId();
  const idMunicipio = useId();
  const idAreaMax = useId();
  const idFiltroAmbiental = useId();
  const idDataInicio = useId();
  const idDataFim = useId();
  const idProcDia = useId();
  const idEquipes = useId();

  const [equipesSel, setEquipesSel] = useState<Set<string>>(() => new Set());
  const [regiaoSel, setRegiaoSel] = useState(dados.regioesSelect[0] ?? "");
  const [municipioSel, setMunicipioSel] = useState(dados.municipiosSelect[0] ?? "");
  const modalidadesPerfil = ["REURB", "RURAL", "Quilombola"] as const;
  const [modalidadesSel, setModalidadesSel] = useState<Set<string>>(new Set());
  const [dataInicio, setDataInicio] = useState("2026-05-01");
  const [dataFim, setDataFim] = useState("2026-05-30");
  const [paginaImoveis, setPaginaImoveis] = useState(1);

  useEffect(() => {
    setEquipesSel(new Set());
  }, [dados.equipesOperacionais, dados.estadoId]);

  useEffect(() => {
    const primeiraRegiao = dados.regioesSelect[0] ?? "";
    const municipiosDaPrimeira = dadosComRegiao.municipiosPorRegiao?.[primeiraRegiao];
    setRegiaoSel(primeiraRegiao);
    setMunicipioSel(
      municipiosDaPrimeira?.[0] ?? dados.municipiosSelect[0] ?? "",
    );
  }, [dados.estadoId, dados.regioesSelect, dados.municipiosSelect, dadosComRegiao.municipiosPorRegiao]);

  const dias = useMemo(
    () => diasNoIntervalo(dataInicio, dataFim),
    [dataInicio, dataFim],
  );

  const processosPorDiaAgregado = useMemo(() => {
    let t = 0;
    dados.equipesOperacionais.forEach((e) => {
      if (equipesSel.has(e.id)) t += e.processosPorDia;
    });
    return t;
  }, [dados.equipesOperacionais, equipesSel]);

  const titulosCalculados = useMemo(
    () => Math.round(dias * processosPorDiaAgregado),
    [dias, processosPorDiaAgregado],
  );

  const titulosKpi =
    dados.kpiTitulosExibicao != null
      ? dados.kpiTitulosExibicao
      : titulosCalculados;
  const indicadorMunicipio = INDICADORES_MA_POR_MUNICIPIO[municipioSel];
  const ocupacoesPerfilTotal = indicadorMunicipio
    ? indicadorMunicipio.ocupacoes.toLocaleString("pt-BR")
    : dados.perfilBeneficiariosTotal;
  const titulosProjetadosExibicao = indicadorMunicipio
    ? indicadorMunicipio.titulosProjetados.toLocaleString("pt-BR")
    : titulosKpi;
  const titulosProjetadosValor = indicadorMunicipio
    ? indicadorMunicipio.titulosProjetados
    : titulosKpi;
  const distribuicaoTamanhoAtual = DISTRIBUICAO_TAMANHO_IMOVEIS[municipioSel] ?? [];
  const maxFaixaQuantidade = distribuicaoTamanhoAtual.reduce(
    (acc, item) => Math.max(acc, item.quantidade),
    1,
  );
  const areaRegularizavelCalculada = estimarAreaRegularizavelHa(
    distribuicaoTamanhoAtual,
  );
  const areaRegularizavelExibicao =
    areaRegularizavelCalculada > 0
      ? areaRegularizavelCalculada.toLocaleString("pt-BR", {
          maximumFractionDigits: 0,
        })
      : dados.areaRegularizavelHa;
  const areaRegularizavelValor =
    areaRegularizavelCalculada > 0
      ? areaRegularizavelCalculada
      : Number(dados.areaRegularizavelHa.replace(/\D/g, "")) || 0;
  const ocupacoesTotalValor =
    indicadorMunicipio?.ocupacoes ||
    Number(dados.perfilBeneficiariosTotal.replace(/\D/g, "")) ||
    0;

  const municipiosDisponiveis = useMemo(() => {
    const porRegiao = dadosComRegiao.municipiosPorRegiao?.[regiaoSel];
    if (porRegiao?.length) return porRegiao;
    return dados.municipiosSelect;
  }, [dadosComRegiao.municipiosPorRegiao, dados.municipiosSelect, regiaoSel]);

  useEffect(() => {
    setMunicipioSel((atual) =>
      municipiosDisponiveis.includes(atual)
        ? atual
        : (municipiosDisponiveis[0] ?? ""),
    );
  }, [municipiosDisponiveis]);

  useEffect(() => {
    setPaginaImoveis(1);
  }, [municipioSel]);

  useEffect(() => {
    setPrevisaoTitulos(titulosCalculados);
  }, [titulosCalculados, setPrevisaoTitulos]);

  useEffect(() => {
    const modalidadesSelecionadas = Array.from(modalidadesSel).map((m) =>
      m.trim().toUpperCase(),
    );
    setParametrosProjecao({
      municipioSelecionado: municipioSel || null,
      titulosProjetados: titulosProjetadosValor || null,
      ocupacoesTotal: ocupacoesTotalValor || null,
      areaRegularizavelHa: areaRegularizavelValor || null,
      modalidadesSelecionadas,
    });
  }, [
    areaRegularizavelValor,
    modalidadesSel,
    municipioSel,
    ocupacoesTotalValor,
    setParametrosProjecao,
    titulosProjetadosValor,
  ]);

  const fatiasPerfil = useMemo(() => {
    function normalizarModalidade(valor: string): string {
      return valor.trim().toUpperCase();
    }
    const selecionadasNormalizadas = new Set(
      Array.from(modalidadesSel).map(normalizarModalidade),
    );
    if (!modalidadesSel.size) {
      return dados.perfilBeneficiariosFatias.map((f) => ({ ...f, pct: 0 }));
    }
    const base = dados.perfilBeneficiariosFatias.filter((f) =>
      selecionadasNormalizadas.has(normalizarModalidade(f.rotulo)),
    );
    if (base.length === 1) {
      return dados.perfilBeneficiariosFatias.map((f) => ({
        ...f,
        pct: selecionadasNormalizadas.has(normalizarModalidade(f.rotulo))
          ? 100
          : 0,
      }));
    }
    const somaBase = base.reduce((acc, f) => acc + f.pct, 0) || 1;
    let acumulado = 0;
    return dados.perfilBeneficiariosFatias.map((f, idx, arr) => {
      if (!selecionadasNormalizadas.has(normalizarModalidade(f.rotulo))) {
        return { ...f, pct: 0 };
      }
      const ehUltimaSelecionada =
        arr
          .slice(idx + 1)
          .every(
            (n) =>
              !selecionadasNormalizadas.has(normalizarModalidade(n.rotulo)),
          );
      if (ehUltimaSelecionada) {
        return { ...f, pct: Math.max(0, 100 - acumulado) };
      }
      const pct = Math.round((f.pct / somaBase) * 100);
      acumulado += pct;
      return { ...f, pct };
    });
  }, [dados.perfilBeneficiariosFatias, modalidadesSel]);

  function alternarModalidadePerfil(modalidade: string) {
    setModalidadesSel((prev) => {
      const next = new Set(prev);
      if (next.has(modalidade)) next.delete(modalidade);
      else next.add(modalidade);
      return next;
    });
  }

  const imoveisFiltrados = useMemo(
    () =>
      IMOVEIS_ELEGIVEIS_CAR_DEMO.filter(
        (imovel) => imovel.municipio === municipioSel,
      ),
    [municipioSel],
  );
  const IMOVEIS_POR_PAGINA = 10;
  const totalPaginasImoveis = Math.max(
    1,
    Math.ceil(imoveisFiltrados.length / IMOVEIS_POR_PAGINA),
  );
  const paginaAtualImoveis = Math.min(paginaImoveis, totalPaginasImoveis);
  const inicio = (paginaAtualImoveis - 1) * IMOVEIS_POR_PAGINA;
  const fim = inicio + IMOVEIS_POR_PAGINA;
  const imoveisPagina = imoveisFiltrados.slice(inicio, fim);

  return (
    <div className="space-y-4">
      <SecTitle icon={ClipboardList}>
        Simulador de Campanha de Regularização Fundiária
      </SecTitle>
      <SubDesc>
        Configure os parâmetros da campanha para gerar projeções de títulos,
        custos e aptidão territorial (REURB).
      </SubDesc>

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(260px,320px)]">
        <div className="space-y-4">
          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              1. Seleção de área de atuação
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <FieldLabel htmlFor={idRegiao} obrigatorio>
                  Região / Mesorregião
                </FieldLabel>
                <FormSelect
                  id={idRegiao}
                  value={regiaoSel}
                  onChange={(e) => setRegiaoSel(e.target.value)}
                >
                  {dados.regioesSelect.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <FieldLabel htmlFor={idMunicipio} obrigatorio>
                  Município
                </FieldLabel>
                <FormSelect
                  id={idMunicipio}
                  value={municipioSel}
                  onChange={(e) => setMunicipioSel(e.target.value)}
                >
                  {municipiosDisponiveis.map((m: string) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </div>
          </PanelCard>

          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              2. Perfil do beneficiário e modalidade
            </div>
            <div className="flex flex-wrap gap-2">
              {modalidadesPerfil.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => alternarModalidadePerfil(t)}
                  aria-pressed={modalidadesSel.has(t)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    modalidadesSel.has(t)
                      ? t === "REURB"
                        ? "border-sicarf-green-dark bg-sicarf-green-light text-sicarf-green-dark"
                        : t === "RURAL"
                          ? "border-sicarf-blue bg-sicarf-blue/10 text-sicarf-blue"
                          : "border-purple-700 bg-purple-100 text-purple-700"
                      : "border-sicarf-gray-200 bg-sicarf-gray-50 text-sicarf-gray-700 hover:bg-sicarf-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor={idAreaMax} obrigatorio>
                  Área máxima por processo (ha)
                </FieldLabel>
                <FormTextInput
                  id={idAreaMax}
                  type="number"
                  defaultValue={100}
                />
              </div>
              <div>
                <FieldLabel htmlFor={idFiltroAmbiental} obrigatorio>
                  Filtro de regularidade ambiental
                </FieldLabel>
                <FormSelect id={idFiltroAmbiental} defaultValue="todos">
                  <option value="todos">Todos (com e sem passivo)</option>
                  <option value="car">
                    Somente com CAR ativo e sem passivo
                  </option>
                </FormSelect>
              </div>
            </div>
          </PanelCard>

          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              3. Capacidade operacional da equipe
            </div>
            <div className="flex w-full flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="min-w-0">
                  <FieldLabel htmlFor={idEquipes} obrigatorio>
                    Equipes
                  </FieldLabel>
                  <SelectMultiEquipes
                    id={idEquipes}
                    equipes={dados.equipesOperacionais}
                    selecionados={equipesSel}
                    onChange={setEquipesSel}
                  />
                </div>
                <div className="min-w-0">
                  <FieldLabel htmlFor={idProcDia}>
                    Processos/dia
                  </FieldLabel>
                  <FormTextInput
                    id={idProcDia}
                    readOnly
                    tabIndex={-1}
                    aria-readonly
                    className="bg-sicarf-gray-50"
                    value={
                      processosPorDiaAgregado > 0
                        ? processosPorDiaAgregado.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "—"
                    }
                  />
                </div>
                <div className="min-w-0">
                  <FieldLabel htmlFor={idDataInicio} obrigatorio>
                    Data inicial
                  </FieldLabel>
                  <FormTextInput
                    id={idDataInicio}
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="min-w-0">
                  <FieldLabel htmlFor={idDataFim} obrigatorio>
                    Data final
                  </FieldLabel>
                  <FormTextInput
                    id={idDataFim}
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </PanelCard>

          <div className="text-[11px] font-bold uppercase tracking-wide text-sicarf-gray-500">
            Projeção estimada
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              value={titulosProjetadosExibicao}
              label="Títulos projetados"
            />
            <MetricCard
              value={previsaoTitulos}
              label="Previsão de títulos"
            />
            <MetricCard
              value={areaRegularizavelExibicao}
              label="Área regularizável (ha)"
            />
            <MetricCard
              value={dados.custoEstTitulo}
              label="Custo est. por título"
            />
          </div>

          <PanelCard>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
                Imóveis elegíveis (CAR)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border border-sicarf-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-sicarf-gray-600 hover:bg-sicarf-gray-50"
                >
                  Filtrar
                </button>
                <button
                  type="button"
                  className="rounded border border-sicarf-green bg-white px-2.5 py-1 text-[11px] font-semibold text-sicarf-green hover:bg-sicarf-green-light"
                >
                  Exportar lista
                </button>
              </div>
            </div>
            <Tabela
              colunas={[
                "Imóvel",
                "Município",
                "Código CAR",
                "Área total (ha)",
                "Status CAR",
              ]}
              linhas={imoveisPagina}
              renderLinha={(imovel) => (
                <>
                  <Td>
                    <strong>{imovel.idImovel}</strong>
                  </Td>
                  <Td>{imovel.municipio}</Td>
                  <Td>{imovel.codigoCar}</Td>
                  <Td>{imovel.areaTotalHa}</Td>
                  <Td>{imovel.statusCar}</Td>
                </>
              )}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-sicarf-gray-500">
                Página {paginaAtualImoveis} de {totalPaginasImoveis}
              </span>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPaginasImoveis }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPaginaImoveis(p)}
                    className={`rounded border px-2 py-1 text-[11px] font-semibold ${
                      paginaAtualImoveis === p
                        ? "border-sicarf-green bg-sicarf-green text-white"
                        : "border-sicarf-gray-200 bg-white text-sicarf-gray-700 hover:bg-sicarf-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </PanelCard>
        </div>

        <div className="space-y-4">
          <PainelPerfilBeneficiarios
            total={ocupacoesPerfilTotal}
            fatias={fatiasPerfil}
          />
          <PanelCard>
            <div className="mb-3 border-b border-sicarf-gray-200 pb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Distribuição do tamanho dos imóveis
            </div>
            <div className="mb-2 text-[11px] font-semibold text-sicarf-gray-700">
              {municipioSel}
            </div>
            <div className="space-y-2.5">
              {distribuicaoTamanhoAtual.map((item) => (
                <div key={item.faixa}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-sicarf-gray-700">{item.faixa}</span>
                    <span className="font-semibold text-sicarf-gray-800">
                      {item.quantidade.toLocaleString("pt-BR")} imóveis
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-sicarf-gray-200">
                    <div
                      className="h-full rounded-full bg-sicarf-blue"
                      style={{
                        width: `${Math.max(
                          6,
                          Math.round((item.quantidade / maxFaixaQuantidade) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}

function IndicadorTendencia({
  tipo,
}: {
  tipo: "alta-verde" | "baixa-amarelo" | "alta-verde-2" | "baixa-roxo";
}) {
  if (tipo === "alta-verde" || tipo === "alta-verde-2") {
    return (
      <ArrowUp
        className={`inline-block size-3.5 align-middle ${tipo === "alta-verde" ? "text-sicarf-green" : "text-emerald-600"}`}
        strokeWidth={2.5}
        aria-hidden
      />
    );
  }
  if (tipo === "baixa-amarelo") {
    return (
      <ArrowDown
        className="inline-block size-3.5 align-middle text-amber-500"
        strokeWidth={2.5}
        aria-hidden
      />
    );
  }
  return (
    <ArrowDown
      className="inline-block size-3.5 align-middle text-purple-600"
      strokeWidth={2.5}
      aria-hidden
    />
  );
}

export function StepProjecao() {
  const { dados, previsaoTitulos, parametrosProjecao } = useInteligenciaDemo();
  const [perfilCronograma, setPerfilCronograma] = useState<
    "otimista" | "realista" | "conservador"
  >("otimista");
  const titulosProjetadosValor =
    parametrosProjecao.titulosProjetados ??
    (Number(dados.funilTitulosProj.replace(/\D/g, "")) || 0);
  const ocupacoesTotalValor =
    parametrosProjecao.ocupacoesTotal ??
    (Number(dados.ocupacoesIdentificadas.replace(/\D/g, "")) || 1);
  const areaRegularizavelValor =
    parametrosProjecao.areaRegularizavelHa ??
    (Number(dados.areaRegularizavelHa.replace(/\D/g, "")) || 0);
  const titulosProjetadosFmt = titulosProjetadosValor.toLocaleString("pt-BR");
  const ocupacoesTotalFmt = ocupacoesTotalValor.toLocaleString("pt-BR");
  const areaRegularizavelFmt = areaRegularizavelValor.toLocaleString("pt-BR", {
    maximumFractionDigits: 0,
  });
  const areaPrevTitulosHa = areaRegularizavelValor / Math.max(1, previsaoTitulos);
  const areaPrevTitulosFmt = areaPrevTitulosHa.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const carAtivoQtd = Math.round(ocupacoesTotalValor * 0.78);
  const sobreposicaoCriticaQtd = Math.round(ocupacoesTotalValor * 0.14);
  const modalidadesNormalizadas =
    parametrosProjecao.modalidadesSelecionadas.length > 0
      ? parametrosProjecao.modalidadesSelecionadas
      : ["REURB", "RURAL", "QUILOMBOLA"];

  const linhasModalidade = useMemo(() => {
    const base = dados.projecaoModalidades.filter((row) =>
      modalidadesNormalizadas.includes(row.modalidade.trim().toUpperCase()),
    );
    if (base.length === 0) return [];
    const peso = 1 / base.length;
    return base.map((row) => {
      const processos = Math.round(previsaoTitulos * peso);
      const area = areaRegularizavelValor * peso;
      const pctTotal = Math.round(
        (processos / Math.max(1, previsaoTitulos)) * 100,
      );
      const conversaoPct = Math.round(
        (processos / Math.max(1, titulosProjetadosValor)) * 100,
      );
      return {
        ...row,
        processos: processos.toLocaleString("pt-BR"),
        areaHa: area.toLocaleString("pt-BR", { maximumFractionDigits: 0 }),
        pctTotal: `${pctTotal}%`,
        conversaoPct,
      };
    });
  }, [
    areaRegularizavelValor,
    dados.projecaoModalidades,
    modalidadesNormalizadas,
    previsaoTitulos,
    titulosProjetadosValor,
  ]);

  const cronogramaSemanasCalc = useMemo(() => {
    const pesos = [0.14, 0.24, 0.27, 0.35];
    const fases = [
      {
        semana: "Semana 1",
        fase: "Triagem e priorização",
        barClass: "bg-sicarf-green",
      },
      {
        semana: "Semana 2",
        fase: "Validação CAR e georreferência",
        barClass: "bg-sicarf-green-dark",
      },
      {
        semana: "Semana 3",
        fase: "Análise jurídica e saneamento",
        barClass: "bg-sicarf-green-border",
      },
      {
        semana: "Semana 4",
        fase: "Emissão de títulos",
        barClass: "bg-sicarf-orange",
      },
    ];
    return fases.map((f, idx) => {
      const qtd = Math.round(previsaoTitulos * pesos[idx]);
      return {
        ...f,
        larguraPct: Math.max(
          18,
          Math.round((qtd / Math.max(1, previsaoTitulos)) * 100),
        ),
        processosOuTitulos: `${qtd.toLocaleString("pt-BR")} ${
          idx === 3 ? "títulos" : "proc."
        }`,
      };
    });
  }, [previsaoTitulos]);

  const funilSegmentos = useMemo(() => {
    const o = ocupacoesTotalValor || 1;
    return [
      {
        rotulo: "Áreas identificadas",
        valor: ocupacoesTotalFmt,
        pct: 1,
        cor: "bg-sicarf-blue",
        textoCor: "text-white",
      },
      {
        rotulo: "Com CAR ativo",
        valor: carAtivoQtd.toLocaleString("pt-BR"),
        pct: carAtivoQtd / o,
        cor: "bg-sicarf-green",
        textoCor: "text-white",
      },
      {
        rotulo: "Com sobreposição crítica",
        valor: sobreposicaoCriticaQtd.toLocaleString("pt-BR"),
        pct: sobreposicaoCriticaQtd / o,
        cor: "bg-sicarf-red",
        textoCor: "text-white",
      },
    ];
  }, [carAtivoQtd, ocupacoesTotalFmt, ocupacoesTotalValor, sobreposicaoCriticaQtd]);

  const historicoRegiaoBarras = [42, 48, 55, 62, 78];

  return (
    <div className="space-y-4">
      <SecTitle icon={LineChart}>
        {parametrosProjecao.municipioSelecionado
          ? `Projeção de resultados — ${parametrosProjecao.municipioSelecionado}`
          : dados.projecaoTituloCampanha}
      </SecTitle>
      <SubDesc>
        Visualize o cronograma de produção, o funil de conversão e a projeção
        por modalidade conforme os parâmetros da campanha.
      </SubDesc>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          value={
            <span className="inline-flex items-center justify-center gap-1">
              {titulosProjetadosFmt}
            </span>
          }
          label="Títulos projetados"
        />
        <MetricCard
          value={
            <span className="inline-flex items-center justify-center gap-1">
              {previsaoTitulos}
            </span>
          }
          label="Previsão de títulos"
        />
        <MetricCard
          value={
            <span className="inline-flex items-center justify-center gap-1">
              {areaRegularizavelFmt}
              <IndicadorTendencia tipo="alta-verde" />
            </span>
          }
          label="Área regularizável (ha)"
        />
        <MetricCard
          value={
            <span className="inline-flex items-center justify-center gap-1">
              {dados.custoTotalEstimado}
              <IndicadorTendencia tipo="baixa-amarelo" />
            </span>
          }
          label="Custo total estimado"
        />
        <MetricCard
          value={
            <span className="inline-flex items-center justify-center gap-1">
              {areaPrevTitulosFmt}
              <IndicadorTendencia tipo="alta-verde-2" />
            </span>
          }
          label="Área de previsão de títulos (ha)"
        />
        <MetricCard
          value={
            <span className="inline-flex items-center justify-center gap-1">
              {dados.tempoMedioProcesso}
              <IndicadorTendencia tipo="baixa-roxo" />
            </span>
          }
          label="Tempo médio/processo"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(260px,300px)]">
        <div className="space-y-4">
          <PanelCard>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
                Cronograma de produção semanal
              </span>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    ["otimista", "Otimista"],
                    ["realista", "Realista"],
                    ["conservador", "Conservador"],
                  ] as const
                ).map(([id, rotulo]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPerfilCronograma(id)}
                    className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      perfilCronograma === id
                        ? "bg-sicarf-green text-white"
                        : "border border-sicarf-gray-200 bg-white text-sicarf-gray-600 hover:bg-sicarf-gray-50"
                    }`}
                  >
                    {rotulo}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              {cronogramaSemanasCalc.map((s) => (
                <div
                  key={s.semana + s.fase}
                  className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
                >
                  <span className="w-24 shrink-0 text-[11px] font-semibold text-sicarf-gray-600">
                    {s.semana}
                  </span>
                  <div className="min-h-8 min-w-0 flex-1">
                    <div className="h-8 overflow-hidden rounded bg-sicarf-gray-100">
                      <div
                        className={`flex h-full items-center px-2 text-[11px] font-bold ${s.barClass} ${s.barClass.includes("green-light") ? "text-sicarf-green-dark" : "text-white"}`}
                        style={{ width: `${s.larguraPct}%` }}
                      >
                        <span className="truncate">{s.fase}</span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-right text-[11px] font-semibold text-sicarf-gray-700">
                    {s.processosOuTitulos}
                  </span>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Funil de conversão — da ocupação ao título
            </div>
            <div className="flex w-full overflow-hidden rounded-md border border-sicarf-gray-200">
              {funilSegmentos.map((seg) => (
                <div
                  key={seg.rotulo}
                  className={`flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-2 text-center ${seg.cor} ${seg.textoCor}`}
                  style={{
                    flex: `${Math.max(seg.pct, 0.08)} 1 0%`,
                    minWidth: "2.75rem",
                  }}
                  title={seg.rotulo}
                >
                  <span className="text-[9px] font-semibold leading-tight opacity-95">
                    {seg.rotulo}
                  </span>
                  <span className="text-[10px] font-bold leading-tight">
                    {seg.valor}
                  </span>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Projeção por modalidade
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-[12px]">
                <thead>
                  <tr className="bg-sicarf-gray-50">
                    {[
                      "Modalidade",
                      "Processos proj.",
                      "Área proj (ha)",
                      "Custo médio",
                      "% total",
                      "Conversão",
                    ].map((c) => (
                      <th
                        key={c}
                        className="border-b border-sicarf-gray-200 px-2 py-2 text-left text-xs font-semibold text-sicarf-gray-500"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {linhasModalidade.map((row, i) => (
                    <tr
                      key={row.modalidade}
                      className={
                        i % 2 === 0 ? "bg-white" : "bg-sicarf-gray-50"
                      }
                    >
                      <td className="border-b border-sicarf-gray-200 px-2 py-2 font-semibold text-sicarf-gray-800">
                        {row.modalidade}
                      </td>
                      <td className="border-b border-sicarf-gray-200 px-2 py-2">
                        {row.processos}
                      </td>
                      <td className="border-b border-sicarf-gray-200 px-2 py-2">
                        {row.areaHa}
                      </td>
                      <td className="border-b border-sicarf-gray-200 px-2 py-2">
                        {row.custoMedio}
                      </td>
                      <td className="border-b border-sicarf-gray-200 px-2 py-2">
                        {row.pctTotal}
                      </td>
                      <td className="border-b border-sicarf-gray-200 px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 min-w-[72px] flex-1 overflow-hidden rounded-full bg-sicarf-gray-200">
                            <div
                              className={`h-full rounded-full ${row.barClass}`}
                              style={{ width: `${row.conversaoPct}%` }}
                            />
                          </div>
                          <span className="w-9 text-right text-[11px] font-bold text-sicarf-gray-700">
                            {row.conversaoPct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PanelCard>
        </div>

        <div className="space-y-4">
          <PanelCard>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Índice de viabilidade
            </div>
            <div className="flex flex-col items-center">
              <svg
                viewBox="0 0 120 72"
                className="mx-auto w-40 max-w-full"
                aria-hidden
              >
                <path
                  d="M 12 60 A 48 48 0 0 1 108 60"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 12 60 A 48 48 0 0 1 108 60"
                  fill="none"
                  stroke="#1a9e6e"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(Number(dados.indiceViabilidadeReurb) / 100) * 151} 151`}
                />
              </svg>
              <div className="-mt-6 text-center">
                <div className="text-3xl font-bold text-sicarf-gray-800">
                  {dados.indiceViabilidadeReurb}
                </div>
                <div className="mt-2">
                  <Pill
                    label={
                      dados.estadoId === "MA"
                        ? "Boa viabilidade — recomendada com ressalvas"
                        : "Alta viabilidade — recomendada"
                    }
                    bg={S.greenLight}
                    color={S.greenDark}
                  />
                </div>
              </div>
            </div>
          </PanelCard>

          <PanelCard>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Fatores de risco
            </div>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 size-2 shrink-0 rounded-full bg-sicarf-red"
                  aria-hidden
                />
                <span className="text-sicarf-gray-700">
                  <strong className="text-sicarf-red">Alto:</strong> sobreposição
                  SIGEF.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 size-2 shrink-0 rounded-full bg-sicarf-orange"
                  aria-hidden
                />
                <span className="text-sicarf-gray-700">
                  <strong className="text-sicarf-orange">Médio:</strong> passivo
                  ambiental.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 size-2 shrink-0 rounded-full bg-sicarf-orange"
                  aria-hidden
                />
                <span className="text-sicarf-gray-700">
                  <strong className="text-sicarf-orange">Médio:</strong> conflitos
                  fundiários.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 size-2 shrink-0 rounded-full bg-sicarf-green"
                  aria-hidden
                />
                <span className="text-sicarf-gray-700">
                  <strong className="text-sicarf-green">Baixo:</strong> logística
                  de acesso.
                </span>
              </li>
            </ul>
          </PanelCard>

          <PanelCard>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Histórico da região
            </div>
            <div className="flex h-24 items-end justify-between gap-1.5 px-1">
              {historicoRegiaoBarras.map((h, idx) => (
                <div
                  key={idx}
                  className="flex flex-1 flex-col items-center justify-end gap-1"
                >
                  <div
                    className={`w-full max-w-[28px] rounded-t ${
                      idx >= historicoRegiaoBarras.length - 2
                        ? "bg-sicarf-green"
                        : "bg-sicarf-gray-200"
                    } ${idx === historicoRegiaoBarras.length - 1 ? "opacity-90" : ""}`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      </div>

      <SubDesc>{dados.crescimentoRegional}</SubDesc>
    </div>
  );
}

function RotuloMelhorCenario({ melhor }: { melhor: "A" | "B" | "C" }) {
  const cfg =
    melhor === "A"
      ? { cor: S.blue, rotulo: "Cen. A" }
      : melhor === "B"
        ? { cor: S.greenDark, rotulo: "Cen. B" }
        : { cor: "#6a1b9a", rotulo: "Cen. C" };
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold"
      style={{ color: cfg.cor }}
    >
      <Star className="size-3.5 fill-current" strokeWidth={0} aria-hidden />
      {cfg.rotulo}
    </span>
  );
}

export function StepComparar() {
  const { dados } = useInteligenciaDemo();

  const headerCenario: Record<"A" | "B" | "C", string> = {
    A: "bg-sicarf-blue",
    B: "bg-sicarf-green",
    C: "bg-purple-700",
  };

  const graficos = [
    {
      titulo: "Títulos projetados (escala relativa)",
      valores: dados.graficoComparacaoTitulos,
    },
    {
      titulo: "Taxa de conversão (%)",
      valores: dados.graficoComparacaoConversao,
    },
    {
      titulo: "Índice de viabilidade geral",
      valores: dados.graficoComparacaoViabilidade,
    },
  ] as const;

  return (
    <div className="space-y-4">
      <SecTitle icon={BarChart3}>Comparação de cenários de campanha</SecTitle>
      <SubDesc>
        Confronte até 3 configurações para escolher a campanha com melhor
        custo-benefício e aptidão territorial.
      </SubDesc>

      <div className="grid gap-4 xl:grid-cols-[1fr_minmax(260px,300px)]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {dados.cenariosComparacaoCards.map((c) => (
              <div
                key={c.variant}
                className="overflow-hidden rounded-md border border-sicarf-gray-200 bg-white shadow-sm"
              >
                <div
                  className={`flex items-center justify-between px-3 py-2 text-white ${headerCenario[c.variant]}`}
                >
                  <span className="text-sm font-bold">{c.titulo}</span>
                </div>
                <div className="space-y-1.5 px-3 py-2.5 text-[11px] text-sicarf-gray-600">
                  <p className="font-semibold text-sicarf-gray-800">
                    {c.alcance}
                  </p>
                  <p>
                    {c.municipios}{" "}
                    {c.municipios === 1 ? "município" : "municípios"} ·{" "}
                    {c.tecnicos} técnicos · {c.dias} dias
                  </p>
                  <p className="text-sicarf-gray-500">{c.modalidades}</p>
                </div>
                <div className="border-t border-sicarf-gray-100 px-3 py-2">
                  {c.variant === "A" ? (
                    <Pill label={c.badge} bg={S.blueBg} color={S.blue} />
                  ) : c.variant === "B" ? (
                    <Pill
                      label={
                        <span className="inline-flex items-center gap-1">
                          <Star
                            className="size-3 fill-current"
                            strokeWidth={0}
                            aria-hidden
                          />
                          {c.badge}
                        </span>
                      }
                      bg={S.greenLight}
                      color={S.greenDark}
                    />
                  ) : (
                    <Pill label={c.badge} bg="#ede7f6" color="#6a1b9a" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Matriz comparativa
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-[12px]">
                <thead>
                  <tr className="bg-sicarf-gray-50">
                    <th className="border-b border-sicarf-gray-200 px-2 py-2 text-left text-xs font-semibold uppercase text-sicarf-gray-500">
                      Critério
                    </th>
                    <th className="border-b border-sicarf-gray-200 px-2 py-2 text-left text-xs font-semibold text-sicarf-blue">
                      Cenário A
                    </th>
                    <th className="border-b border-sicarf-gray-200 px-2 py-2 text-left text-xs font-semibold text-sicarf-green-dark">
                      <span className="inline-flex items-center gap-1">
                        Cenário B
                        <Star
                          className="size-3 fill-sicarf-green-dark"
                          strokeWidth={0}
                          aria-label="Recomendado"
                        />
                      </span>
                    </th>
                    <th className="border-b border-sicarf-gray-200 px-2 py-2 text-left text-xs font-semibold text-purple-700">
                      Cenário C
                    </th>
                    <th className="border-b border-sicarf-gray-200 px-2 py-2 text-left text-xs font-semibold text-sicarf-gray-500">
                      Melhor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dados.matrizComparacao.map((linha, idx) => (
                    <Fragment key={`${linha.criterio}-${idx}`}>
                      {linha.grupo ? (
                        <tr className="bg-sicarf-green-light/60">
                          <td
                            colSpan={5}
                            className="border-b border-sicarf-gray-200 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-sicarf-green-dark"
                          >
                            {linha.grupo}
                          </td>
                        </tr>
                      ) : null}
                      <tr
                        className={
                          idx % 2 === 0 && !linha.grupo
                            ? "bg-white"
                            : !linha.grupo
                              ? "bg-sicarf-gray-50"
                              : "bg-white"
                        }
                      >
                        <td className="border-b border-sicarf-gray-200 px-2 py-2 font-semibold text-sicarf-gray-700">
                          {linha.criterio}
                        </td>
                        <td
                          className={`border-b border-sicarf-gray-200 px-2 py-2 ${linha.alertaAltoRiscoCenA ? "bg-sicarf-red-bg font-bold text-sicarf-red" : "text-sicarf-gray-800"}`}
                        >
                          {linha.cenA}
                        </td>
                        <td className="border-b border-sicarf-gray-200 px-2 py-2 font-bold text-sicarf-green-dark">
                          {linha.cenB}
                        </td>
                        <td className="border-b border-sicarf-gray-200 px-2 py-2 text-sicarf-gray-800">
                          {linha.cenC}
                        </td>
                        <td className="border-b border-sicarf-gray-200 px-2 py-2">
                          <RotuloMelhorCenario melhor={linha.melhor} />
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </PanelCard>

          <div className="grid gap-3 lg:grid-cols-3">
            {graficos.map((g) => (
              <PanelCard key={g.titulo}>
                <div className="mb-2 text-xs font-bold text-sicarf-gray-600">
                  {g.titulo}
                </div>
                <div className="space-y-2">
                  {(["A", "B", "C"] as const).map((letra, i) => {
                    const v = g.valores[i] ?? 0;
                    const cor =
                      letra === "A"
                        ? "bg-sicarf-blue"
                        : letra === "B"
                          ? "bg-sicarf-green"
                          : "bg-purple-600";
                    return (
                      <div
                        key={letra}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        <span className="w-4 font-bold text-sicarf-gray-600">
                          {letra}
                        </span>
                        <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-sicarf-gray-200">
                          <div
                            className={`h-full rounded-full ${cor}`}
                            style={{
                              width: `${Math.min(100, v)}%`,
                            }}
                          />
                        </div>
                        <span className="w-10 text-right font-semibold text-sicarf-gray-800">
                          {v}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </PanelCard>
            ))}
          </div>

          <div className="flex gap-3 rounded-md border border-sicarf-green-light bg-sicarf-green-light/80 px-4 py-3 text-[12px] text-sicarf-green-dark">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-sicarf-green"
              strokeWidth={2}
              aria-hidden
            />
            <p className="leading-relaxed">
              <strong className="font-bold">Recomendação do sistema.</strong>{" "}
              {dados.textoRecomendacaoComparacao}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <PanelCard>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Radar multidimensional
            </div>
            <svg
              viewBox="0 0 120 120"
              className="mx-auto w-full max-w-[220px]"
              aria-hidden
            >
              <polygon
                points="60,10 100,35 95,80 60,105 25,80 20,35"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <polygon
                points="60,18 92,40 88,72 60,92 32,72 28,40"
                fill="rgb(43 108 176 / 0.15)"
                stroke={S.blue}
                strokeWidth="1.5"
              />
              <polygon
                points="60,22 90,44 82,68 60,88 38,68 30,44"
                fill="rgb(26 158 110 / 0.18)"
                stroke={S.green}
                strokeWidth="1.5"
              />
              <polygon
                points="60,26 84,48 78,64 60,82 42,64 36,48"
                fill="rgb(147 51 234 / 0.12)"
                stroke="#7e22ce"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
            </svg>
            <p className="mt-2 text-center text-[10px] text-sicarf-gray-500">
              Comparativo visual em seis dimensões (demonstração).
            </p>
          </PanelCard>

          <PanelCard>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Pontuação por critério
            </div>
            <div className="space-y-2.5">
              {(
                [
                  ["A", dados.pontuacaoCenarios.A, "bg-sicarf-blue", S.blue],
                  [
                    "B",
                    dados.pontuacaoCenarios.B,
                    "bg-sicarf-green",
                    S.greenDark,
                  ],
                  ["C", dados.pontuacaoCenarios.C, "bg-purple-600", "#6a1b9a"],
                ] as const
              ).map(([letra, nota, bar, cor]) => (
                <div key={letra}>
                  <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
                    <span style={{ color: cor }} className="inline-flex gap-1">
                      Cenário {letra}
                      {letra === "B" ? (
                        <Star
                          className="size-3 fill-current"
                          strokeWidth={0}
                          aria-hidden
                        />
                      ) : null}
                    </span>
                    <span className="text-sicarf-gray-600">
                      {nota}
                      /10
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-sicarf-gray-200">
                    <div
                      className={`h-full rounded-full ${bar}`}
                      style={{ width: `${nota * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-full rounded border-2 border-sicarf-green bg-white px-3 py-2 text-center text-xs font-semibold text-sicarf-green hover:bg-sicarf-green-light"
            >
              ← Projeção
            </button>
            <button
              type="button"
              className="w-full rounded bg-sicarf-green px-3 py-2 text-center text-xs font-semibold text-white hover:bg-sicarf-green-dark"
            >
              Acompanhar campanha →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function estiloAlertaGargalo(nivel: AlertaGargaloDemo["nivel"]) {
  if (nivel === "critico") {
    return "border-l-sicarf-red bg-sicarf-red-bg text-sicarf-red";
  }
  if (nivel === "alerta") {
    return "border-l-sicarf-orange bg-sicarf-orange-bg text-sicarf-orange";
  }
  if (nivel === "info") {
    return "border-l-amber-400 bg-amber-50 text-amber-900";
  }
  return "border-l-sicarf-green bg-sicarf-green-light text-sicarf-green-dark";
}

export function StepAcompanhamento() {
  const { dados } = useInteligenciaDemo();
  const idBuscaMunicipio = useId();
  const [expandidaChave, setExpandidaChave] = useState<string>("principal");

  const totalCampanhasAtivas = 1 + dados.outrasCampanhas.length;

  const kpisAcompanhamento = [
    {
      label: "Campanhas ativas",
      valor: String(totalCampanhasAtivas),
    },
    {
      label: "Processos abertos",
      valor: dados.kpiProcessosAbertos,
    },
    {
      label: "Títulos emitidos",
      valor: dados.kpiTitulosEmitidosGeral,
    },
    {
      label: "Gargalos detectados",
      valor: "3",
    },
    {
      label: "Aguardando CDI",
      valor: "306",
    },
    {
      label: "Taxa de conversão",
      valor:
        dados.estadoId === "MA"
          ? dados.funilTextoBarra.match(/\d+%/)?.[0] ?? "91%"
          : "89%",
    },
  ] as const;

  function TabelaAcompanhamento({
    titulo,
    tituloClass,
    colunas,
    linhas,
  }: {
    titulo: string;
    tituloClass: string;
    colunas: readonly string[];
    linhas: readonly AcompanhamentoTabelaLinha[];
  }) {
    return (
      <div className="overflow-x-auto rounded-md border border-sicarf-gray-200">
        <div
          className={`px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-white ${tituloClass}`}
        >
          {titulo}
        </div>
        <table className="w-full min-w-[520px] border-collapse text-[11px]">
          <thead>
            <tr className="bg-sicarf-gray-100">
              {colunas.map((c) => (
                <th
                  key={c}
                  className="border-b border-sicarf-gray-200 px-1.5 py-1.5 text-left font-semibold text-sicarf-gray-600"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.rotulo} className="bg-white">
                <td className="border-b border-sicarf-gray-200 px-1.5 py-1.5 font-semibold text-sicarf-gray-800">
                  {linha.rotulo}
                </td>
                {linha.valores.map((v: string | number, i: number) => (
                  <td
                    key={i}
                    className={`border-b border-sicarf-gray-200 px-1.5 py-1.5 tabular-nums ${
                      linha.destaqueIdx === i
                        ? "bg-amber-100 font-semibold text-sicarf-orange"
                        : "text-sicarf-gray-700"
                    }`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function DetalheCampanhaReurb() {
    return (
      <div className="mt-4 space-y-4 border-t border-sicarf-gray-200 pt-4">
        <TabelaAcompanhamento
          titulo="Processos REURB em andamento"
          tituloClass="bg-sicarf-green-border"
          colunas={dados.acompColunasRural}
          linhas={dados.acompLinhasRural}
        />
        <TabelaAcompanhamento
          titulo="Títulos emitidos — REURB"
          tituloClass="bg-sicarf-green-dark"
          colunas={dados.acompColunasFinalizados}
          linhas={dados.acompLinhasFinalizados}
        />

        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-sicarf-gray-500">
            Alertas de gargalo e ações recomendadas
          </div>
          <ul className="space-y-2">
            {dados.alertasGargalo.map((a) => (
              <li
                key={a.texto}
                className={`flex items-center justify-between gap-2 rounded border border-sicarf-gray-200 border-l-4 px-3 py-2 text-[11px] ${estiloAlertaGargalo(a.nivel)}`}
              >
                <span className="font-medium">{a.texto}</span>
                <span className="shrink-0 font-bold tabular-nums">
                  {a.valor}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sicarf-gray-200 pt-3 text-[11px]">
          <div className="flex flex-wrap gap-4 text-sicarf-gray-600">
            <span>
              <strong className="text-sicarf-gray-900">
                Total em curso (REURB)
              </strong>{" "}
              {dados.acompRodapeTotalCurso}
            </span>
            <span>
              <strong className="text-sicarf-gray-900">
                Títulos emitidos (REURB)
              </strong>{" "}
              {dados.acompRodapeTitulosEmitidos}
            </span>
            <span>
              <strong className="text-sicarf-gray-900">
                Dias restantes
              </strong>{" "}
              {dados.acompRodapeDiasRestantes}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-sicarf-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-sicarf-gray-700 hover:bg-sicarf-gray-50"
            >
              Exportar relatório
            </button>
            <button
              type="button"
              className="rounded border border-sicarf-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-sicarf-gray-700 hover:bg-sicarf-gray-50"
            >
              Redistribuir processos
            </button>
            <button
              type="button"
              className="rounded bg-sicarf-green px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-sicarf-green-dark"
            >
              Acionar análise em lote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SecTitle icon={MapPinned}>
        Acompanhamento de campanhas em curso
      </SecTitle>
      <SubDesc>
        Painel do simulador de campanha: fluxo de processos, gargalos detectados
        e ações corretivas.
      </SubDesc>

      <div className="flex flex-wrap items-end gap-2 rounded-md border border-sicarf-gray-200 bg-white px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-sicarf-gray-500">
            Ano
          </span>
          <FormSelect
            compact
            className="w-auto min-w-18"
            defaultValue="2025"
            aria-label="Ano da campanha"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </FormSelect>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-sicarf-gray-500">
            Tipo
          </span>
          <FormSelect
            compact
            className="w-auto min-w-28"
            defaultValue={dados.acompanhamentoTipoFiltroPadrao}
            aria-label="Tipo de processo"
          >
            <option value="reurb">REURB</option>
            <option value="todos">Todos (visão REURB)</option>
          </FormSelect>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-sicarf-gray-500">
            Status
          </span>
          <FormSelect
            compact
            className="w-auto min-w-28"
            defaultValue="todos"
            aria-label="Status da campanha"
          >
            <option value="todos">Todos</option>
            <option value="andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </FormSelect>
        </div>
        <div className="min-w-[160px] flex-1">
          <label className="sr-only" htmlFor={idBuscaMunicipio}>
            Buscar município
          </label>
          <FormTextInput
            id={idBuscaMunicipio}
            placeholder="Buscar município…"
            className="w-full"
          />
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded border border-sicarf-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-sicarf-gray-700 hover:bg-sicarf-gray-50"
          >
            Exportar tabela
          </button>
          <button
            type="button"
            className="rounded border border-sicarf-green bg-sicarf-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-sicarf-green-dark"
          >
            + Nova campanha
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpisAcompanhamento.map((k) => (
          <MetricCard
            key={k.label}
            value={k.valor}
            label={k.label}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_minmax(260px,300px)]">
        <div className="space-y-4">
          <PanelCard>
            <button
              type="button"
              onClick={() =>
                setExpandidaChave((k) =>
                  k === "principal" ? "" : "principal",
                )
              }
              className="flex w-full flex-col gap-2 text-left"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-sicarf-gray-900">
                  {dados.campanhaAcompTitulo}
                </span>
                <Pill
                  label="Em andamento"
                  bg={S.greenLight}
                  color={S.greenDark}
                />
              </div>
              <p className="text-[11px] text-sicarf-gray-600">
                {dados.campanhaAcompMeta}
              </p>
              <TagsRitmoCampanha
                pctTempo={dados.campanhaAcompPctTempo}
                pctTitulos={dados.campanhaAcompPctTitulos}
              />
            </button>

            {expandidaChave === "principal" ? <DetalheCampanhaReurb /> : null}
          </PanelCard>

          <div className="space-y-2">
            {dados.outrasCampanhas.map((o) => (
              <PanelCard key={o.titulo}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandidaChave((k) => (k === o.titulo ? "" : o.titulo))
                  }
                  className="w-full text-left"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-sicarf-gray-800">
                      {o.titulo}
                    </span>
                    <span className="text-[11px] text-sicarf-gray-600">
                      {o.resumo}
                    </span>
                  </div>
                  <TagsRitmoCampanha
                    pctTempo={o.pctTempo}
                    pctTitulos={o.pctTitulos}
                  />
                </button>
                {expandidaChave === o.titulo ? <DetalheCampanhaReurb /> : null}
              </PanelCard>
            ))}
          </div>

          <PanelCard>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full bg-sicarf-blue" />
              <span className="text-sm font-bold text-sicarf-gray-800">
                {dados.campanhaConcluidaTitulo}
              </span>
              <Pill label="Concluída" bg={S.blueBg} color={S.blue} />
            </div>
            <p className="text-xs text-sicarf-gray-600">
              Títulos emitidos na campanha anterior:{" "}
              <strong>{dados.titulosCampanhaAnterior}</strong>
            </p>
          </PanelCard>
        </div>

        <div className="space-y-4">
          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Gargalos por setor
            </div>
            <div className="space-y-2.5">
              {dados.gargalosSetor.map((g) => (
                <div key={g.setor}>
                  <div className="mb-1 flex justify-between text-[11px] font-semibold text-sicarf-gray-700">
                    <span>{g.setor}</span>
                    <span>{g.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-sicarf-gray-200">
                    <div
                      className="h-full rounded-full bg-sicarf-orange"
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Histórico recente
            </div>
            <ul className="space-y-3">
              {dados.historicoCampanha.map((h) => (
                <li
                  key={h.quando + h.texto}
                  className="border-l-2 border-sicarf-green pl-2 text-[11px] text-sicarf-gray-700"
                >
                  <div className="font-semibold text-sicarf-gray-800">
                    {h.quando}
                  </div>
                  <div>{h.texto}</div>
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
              Ações rápidas
            </div>
            <div className="flex flex-col gap-2">
              {[
                "Acionar análise em lote",
                "Redistribuir processos",
                "Notificar setor gargalado",
                "Relatório geral PDF",
              ].map((rotulo) => (
                <button
                  key={rotulo}
                  type="button"
                  className="rounded border border-sicarf-gray-200 bg-sicarf-gray-50 px-3 py-2 text-left text-[11px] font-semibold text-sicarf-gray-800 hover:bg-sicarf-gray-100"
                >
                  {rotulo}
                </button>
              ))}
              <button
                type="button"
                className="rounded bg-sicarf-green px-3 py-2 text-center text-[11px] font-semibold text-white hover:bg-sicarf-green-dark"
              >
                + Nova campanha
              </button>
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}

export function StepExportar() {
  const { dados, previsaoTitulos } = useInteligenciaDemo();
  const idNomePlano = useId();
  const idCenario = useId();
  const idJustificativa = useId();
  const [gerando, setGerando] = useState(false);
  const [ok, setOk] = useState(false);
  const [nomePlano, setNomePlano] = useState(dados.nomePlanoDefault);
  const [justificativa, setJustificativa] = useState(
    dados.justificativaExport,
  );

  useEffect(() => {
    setNomePlano(dados.nomePlanoDefault);
    setJustificativa(dados.justificativaExport);
    setOk(false);
  }, [dados.estadoId, dados.nomePlanoDefault, dados.justificativaExport]);

  return (
    <div className="space-y-4">
      <SecTitle icon={Layers}>Exportar plano de campanha</SecTitle>
      <SubDesc>
        Gere o documento de planejamento operacional para aprovação interna e
        arquivamento no SICARF.
      </SubDesc>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <PanelCard>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
            Identificação e aprovação do plano
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={idNomePlano} obrigatorio>
                Nome do plano
              </FieldLabel>
              <FormTextInput
                id={idNomePlano}
                type="text"
                value={nomePlano}
                onChange={(e) => setNomePlano(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor={idCenario} obrigatorio>
                Cenário selecionado
              </FieldLabel>
              <FormSelect id={idCenario} defaultValue="b">
                <option value="b">Cenário B — Focado (recomendado)</option>
                <option value="a">Cenário A — Ampliado</option>
              </FormSelect>
            </div>
          </div>
          <div className="mt-3">
            <FieldLabel htmlFor={idJustificativa} obrigatorio>
              Justificativa e objetivos
            </FieldLabel>
            <FormTextarea
              id={idJustificativa}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              rows={4}
            />
          </div>
        </PanelCard>
        <PanelCard>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
            Formato de exportação
          </div>
          <div className="grid gap-2">
            <button
              type="button"
              className="rounded border-2 border-sicarf-green bg-sicarf-green-light/50 px-3 py-2 text-left text-sm font-bold text-sicarf-green-dark"
            >
              PDF Oficial
            </button>
            <button
              type="button"
              className="rounded border border-sicarf-gray-200 px-3 py-2 text-left text-sm font-semibold text-sicarf-gray-700 hover:bg-sicarf-gray-50"
            >
              Excel / CSV
            </button>
          </div>
        </PanelCard>
      </div>

      <PanelCard>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-sicarf-gray-500">
            Pré-visualização do documento oficial
          </span>
          <span className="text-[10px] text-sicarf-gray-400">Rascunho</span>
        </div>
        <div className="rounded border border-sicarf-gray-200 bg-sicarf-gray-50 p-4 text-[11px] leading-relaxed text-sicarf-gray-800">
          <div className="mb-4 border-b-2 border-sicarf-green pb-3 text-center">
            <div className="text-[10px] text-sicarf-gray-500">
              {dados.docUfOrgao}
            </div>
            <h3 className="mt-1 text-sm font-bold uppercase text-sicarf-green-dark">
              {dados.docTituloPlano}
            </h3>
            <p className="mt-1 text-[10px] text-sicarf-gray-500">
              Inteligência Fundiária SICARF — documento de planejamento
            </p>
          </div>
          <div className="mb-3">
            <h4 className="mb-2 border-b border-sicarf-gray-200 pb-1 text-[11px] font-bold uppercase text-sicarf-green">
              1. Identificação
            </h4>
            <div className="flex justify-between py-0.5">
              <span className="text-sicarf-gray-500">Campanha</span>
              <span className="font-semibold">{dados.docCampanha}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-sicarf-gray-500">Cenário</span>
              <span className="font-semibold">{dados.docCenario}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-sicarf-gray-500">Órgão gestor</span>
              <span className="font-semibold">{dados.orgSigla}</span>
            </div>
          </div>
          <div className="mb-3">
            <h4 className="mb-2 border-b border-sicarf-gray-200 pb-1 text-[11px] font-bold uppercase text-sicarf-green">
              2. Metas da campanha
            </h4>
            <div className="flex justify-between py-0.5">
              <span className="text-sicarf-gray-500">Títulos projetados</span>
              <span className="font-semibold">{dados.docTitulosProj}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-sicarf-gray-500">Área regularizável</span>
              <span className="font-semibold">{dados.docAreaReg}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-sicarf-gray-500">Custo/título</span>
              <span className="font-semibold">{dados.docCustoTitulo}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-sicarf-gray-500">Previsão de títulos</span>
              <span className="font-semibold">{previsaoTitulos}</span>
            </div>
          </div>
          <div>
            <h4 className="mb-2 border-b border-sicarf-gray-200 pb-1 text-[11px] font-bold uppercase text-sicarf-green">
              3. Glebas prioritárias
            </h4>
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="bg-sicarf-gray-100">
                  <th className="border border-sicarf-gray-200 px-1 py-0.5 text-left">
                    Gleba
                  </th>
                  <th className="border border-sicarf-gray-200 px-1 py-0.5 text-left">
                    ha disp.
                  </th>
                  <th className="border border-sicarf-gray-200 px-1 py-0.5 text-left">
                    Aptidão
                  </th>
                </tr>
              </thead>
              <tbody>
                {dados.docGlebas.map((g) => (
                  <tr key={g.gleba}>
                    <td className="border border-sicarf-gray-200 px-1 py-0.5">
                      {g.gleba.replace(/^Gleba /, "")}
                    </td>
                    <td className="border border-sicarf-gray-200 px-1 py-0.5">
                      {g.area}
                    </td>
                    <td className="border border-sicarf-gray-200 px-1 py-0.5">
                      {g.aptidao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 border-t border-sicarf-gray-200 pt-2 text-center text-[10px] text-sicarf-gray-500">
            Gerado pelo módulo de Inteligência Fundiária — {dados.orgNome}
          </p>
        </div>
      </PanelCard>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-sicarf-gray-200 bg-white px-4 py-3">
        <span className="text-[11px] text-sicarf-gray-500">
          Rascunho salvo automaticamente
        </span>
        <button
          type="button"
          disabled={gerando}
          onClick={() => {
            setGerando(true);
            setOk(false);
            setTimeout(() => {
              setGerando(false);
              setOk(true);
            }, 1200);
          }}
          className="rounded bg-sicarf-green px-4 py-2 text-xs font-semibold text-white hover:bg-sicarf-green-dark disabled:opacity-60"
        >
          {gerando ? "Gerando…" : ok ? "Plano registrado" : "Gerar e registrar no SICARF"}
        </button>
      </div>
    </div>
  );
}
