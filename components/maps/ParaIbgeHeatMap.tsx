"use client";

import type { Feature, FeatureCollection } from "geojson";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { HEAT_DATA } from "@/lib/data/mock";
import {
  heatLabel,
  heatToFillColor,
  PA_MUNICIPIOS_API_URL,
  PA_MUNICIPIOS_GEOJSON_URL,
} from "@/lib/para-heatmap";

type MunRecord = { id: number; nome: string };

function FitBounds({ data }: { data: FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    const layer = L.geoJSON(data);
    const b = layer.getBounds();
    if (b.isValid()) {
      map.fitBounds(b, { padding: [28, 28], maxZoom: 8 });
    }
  }, [data, map]);
  return null;
}

function enrichCollection(
  raw: FeatureCollection,
  codToNome: Map<string, string>,
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: raw.features.map((f) => {
      const cod = String(
        (f.properties as Record<string, string> | null)?.codarea ?? "",
      );
      const nome = codToNome.get(cod) ?? "";
      const heat = nome ? HEAT_DATA[nome] : undefined;
      return {
        ...f,
        properties: {
          ...(f.properties as object),
          nome: nome || `Cód. ${cod}`,
          heat,
        },
      };
    }),
  };
}

export function ParaIbgeHeatMap() {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [geoRes, munRes] = await Promise.all([
          fetch(PA_MUNICIPIOS_GEOJSON_URL),
          fetch(PA_MUNICIPIOS_API_URL),
        ]);
        if (!geoRes.ok || !munRes.ok) {
          throw new Error("Falha ao carregar malhas ou municípios do IBGE.");
        }
        const geo = (await geoRes.json()) as FeatureCollection;
        const municipios = (await munRes.json()) as MunRecord[];
        const codToNome = new Map(
          municipios.map((m) => [String(m.id), m.nome]),
        );
        if (!cancelled) {
          setData(enrichCollection(geo, codToNome));
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erro ao carregar mapa.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const styleFn = useCallback((feature: Feature | undefined) => {
    const heat = (feature?.properties as { heat?: number } | undefined)?.heat;
    return {
      fillColor: heatToFillColor(heat),
      fillOpacity: 0.78,
      color: "#a0aec0",
      weight: 0.45,
    };
  }, []);

  const onEach = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const path = layer as L.Path;
      const props = feature.properties as {
        nome?: string;
        heat?: number;
      };
      const nome = props.nome ?? "—";
      const heat = props.heat;
      const base = styleFn(feature);
      path.bindPopup(
        `<div style="font-family:system-ui,sans-serif;font-size:13px;line-height:1.45">
          <strong>${nome}</strong><br/>
          <span style="color:#4a5568">Índice de alertas / irregularidades:</span>
          <strong>${heat != null ? heat : "—"}</strong><br/>
          <span style="color:#718096;font-size:12px">${heatLabel(heat)}</span>
        </div>`,
      );
      path.on("mouseover", () => {
        path.setStyle({
          ...base,
          weight: 2,
          color: "#1a9e6e",
        });
      });
      path.on("mouseout", () => {
        path.setStyle(base);
      });
    },
    [styleFn],
  );

  if (error) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-md border border-sicarf-gray-200 bg-sicarf-gray-50 px-4 text-center text-sm text-sicarf-red">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[420px] animate-pulse rounded-md border border-sicarf-gray-200 bg-sicarf-gray-100" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative z-0 h-[min(52vh,480px)] min-h-[360px] w-full overflow-hidden rounded-md border border-sicarf-gray-200">
        <MapContainer
          center={[-4.5, -52]}
          zoom={6}
          className="size-full"
          scrollWheelZoom
          aria-label="Mapa de calor dos municípios do Pará"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Malhas IBGE'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds data={data} />
          <GeoJSON
            data={data}
            style={(feat) => styleFn(feat as Feature)}
            onEachFeature={(feat, layer) => onEach(feat as Feature, layer)}
          />
        </MapContainer>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-sicarf-gray-600">
        <span className="font-semibold text-sicarf-gray-700">Legenda:</span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block size-3 rounded-sm border border-sicarf-gray-200"
            style={{ background: "#e2e8f0" }}
          />
          Sem dado
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block size-3 rounded-sm border border-sicarf-gray-200"
            style={{ background: "#c6f6d5" }}
          />
          Baixa
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block size-3 rounded-sm border border-sicarf-gray-200"
            style={{ background: "#faf089" }}
          />
          Média
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block size-3 rounded-sm border border-sicarf-gray-200"
            style={{ background: "#f6ad55" }}
          />
          Alta
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block size-3 rounded-sm border border-sicarf-gray-200"
            style={{ background: "#fc8181" }}
          />
          Muito alta
        </span>
      </div>
    </div>
  );
}
