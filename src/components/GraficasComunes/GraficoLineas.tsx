import "./GraficoLineas.css";
import type { CSSProperties } from "react";
import type { Kpi } from "../../Models/Kpi.ts";
import { Line } from "react-chartjs-2";
import { ChartLine } from "lucide-react";
import { simbolos, formato } from "../TarjetaKpi/TarjetaKpi.tsx";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
);

const MESES_CORTOS = "Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic".split(
  " ",
);

// "2026-09-01" → "Sep 2026"
const nombreMes = (f: string) =>
  `${MESES_CORTOS[Number(f.slice(5, 7)) - 1]} ${f.slice(0, 4)}`;

export function GraficoLineas({ kpi }: { kpi: Kpi }) {
  const tendencia = kpi.tendencia ?? [];
  const sinDatos = tendencia.every((p) => p.valor === null);
  const sufijo = kpi.unidad === "%" ? "%" : "";
  const menorEsMejor = kpi.operador === "<" || kpi.operador === "<=";

  return (
    <article
      className="tarjeta-kpi tarjeta-grafica-lineas"
      style={{ "--color-kpi": kpi.color } as CSSProperties}
    >
      <header className="tarjeta-kpi-encabezado">
        <div className="tarjeta-kpi-titulo">
          <span className="tarjeta-kpi-icono">
            <ChartLine size={18} />
          </span>
          <h3 className="tarjeta-kpi-nombre">{kpi.nombre}</h3>
        </div>
        <span className="tarjeta-kpi-meta">
          Meta: {simbolos[kpi.operador]} {formato(kpi.meta)}
          {kpi.unidad}
          {menorEsMejor && <small>(Menor es mejor)</small>}
        </span>
      </header>

      {sinDatos ? (
        <p className="lineas-vacia">Sin datos en los últimos 3 meses</p>
      ) : (
        <div className="lineas-contenedor">
          <Line
            data={{
              labels: tendencia.map((p) => nombreMes(p.mes)),
              datasets: [
                {
                  label: "Resultado",
                  data: tendencia.map((p) => p.valor),
                  borderColor: kpi.color,
                  backgroundColor: kpi.color,
                  tension: 0.3,
                },
                {
                  label: `Meta ${kpi.operador} ${kpi.meta}${sufijo}`,
                  data: tendencia.map(() => kpi.meta),
                  borderColor: "#1cd619",
                  backgroundColor: "#1cd619",
                  borderDash: [6, 4],
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              scales: {
                y: {
                  min: 0,
                  suggestedMax: kpi.maximo,
                  ticks: { callback: (v) => `${v}${sufijo}` },
                },
                x: { grid: { display: false } },
              },
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    generateLabels: (chart) =>
                      Chart.defaults.plugins.legend.labels
                        .generateLabels(chart)
                        .map((etiqueta) => ({ ...etiqueta, lineDash: [] })),
                  },
                },
              },
            }}
          />
        </div>
      )}
    </article>
  );
}
