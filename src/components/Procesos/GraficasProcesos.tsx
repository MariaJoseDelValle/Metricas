import type { Kpi } from "../../Models/Kpi";
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import type { CSSProperties } from "react";
import { ChartColumn } from "lucide-react";
import "./GraficaProcesos.css";

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);
const PARES: Record<
  string,
  { etiqueta: string; logrado: string; base: string }
> = {
  "documentacion-procesos": {
    etiqueta: "Documentación",
    logrado: "ticketsEstandarizados",
    base: "ticketsPlanificados",
  },
  "cumplimiento-entregables": {
    etiqueta: "Entregables",
    logrado: "ticketsCompletados",
    base: "ticketsComprometidos",
  },
  devolucion: {
    etiqueta: "Devolución",
    logrado: "ticketsDevueltos",
    base: "ticketsPresentados",
  },
  "mejoras-implementadas": {
    etiqueta: "Mejoras",
    logrado: "ticketsImplementados",
    base: "ticketsEntregados",
  },
};

export function GraficaGeneral({ kpis }: { kpis: Kpi[] }) {
  const filas = kpis
    .filter((k) => PARES[k.id])
    .map((k) => {
      const par = PARES[k.id];
      return {
        etiqueta: par.etiqueta,
        logrado: Number(k.detalle?.[par.logrado] ?? 0),
        base: Number(k.detalle?.[par.base] ?? 0),
      };
    });

  return (
    <article
      className="tarjeta-kpi tarjeta-grafica-procesos"
      style={{ "--color-kpi": "#1d9e8c" } as CSSProperties}
    >
      <header className="tarjeta-kpi-encabezado">
        <div className="tarjeta-kpi-titulo">
          <span className="tarjeta-kpi-icono">
            <ChartColumn size={18} />
          </span>
          <h3 className="tarjeta-kpi-nombre">
            Numerador vs Denominador por KPI
          </h3>
        </div>
      </header>
      <div className="barras-procesos">
        <Bar
          data={{
            labels: filas.map((f) => f.etiqueta),
            datasets: [
              {
                label:
                  "Logrado (completados, estandarizados,devueltos,implementados)",
                data: filas.map((f) => f.logrado),
                backgroundColor: "#1d9e8c",

                borderRadius: 4,
                categoryPercentage: 0.25,
              },
              {
                label:
                  "Base (comprometidos, planificados, presentados, entregadas)",
                data: filas.map((f) => f.base),
                backgroundColor: "#a7a6af",
                borderRadius: 4,
                categoryPercentage: 0.25,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } },
              x: { grid: { display: false } },
            },
            plugins: { legend: { position: "bottom", align: "start" } },
          }}
        />
      </div>
    </article>
  );
}
