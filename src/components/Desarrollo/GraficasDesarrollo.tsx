import type { Kpi } from "../../Models/Kpi.ts";
import { Bar } from "react-chartjs-2";
import "./GraficasDesarrollo.css";
import type { CSSProperties } from "react";
import { ChartColumn } from "lucide-react";
import TarjetaKpi from "../TarjetaKpi/TarjetaKpi.tsx";

export function MedidorCumplimiento({ kpis }: { kpis: Kpi[] }) {
  const cumplimiento = kpis.filter((k) =>
    ["resolucion-fallas", "satisfaccion"].includes(k.id),
  );

  return (
    <article
      className="tarjeta-kpi tarjeta-grafica"
      style={{ "--color-kpi": "#22e85e" } as CSSProperties}
    >
      <header className="tarjeta-kpi-encabezado">
        <div className="tarjeta-kpi-titulo">
          <span className="tarjeta-kpi-icono">
            <ChartColumn size={18} />
          </span>
          <h3 className="tarjeta-kpi-nombre">
            Cumplimiento por Resolución de fallas, Satisfacción del cliente
            interno
          </h3>
        </div>
        <span className="tarjeta-kpi-meta">Fuente · PRISMA</span>
      </header>

      <div className="barras">
        <Bar
          data={{
            labels: cumplimiento.map((k) => k.nombre),
            datasets: [
              {
                data: cumplimiento.map((k) => {
                  if (k.resultado === null) return 0;
                  if (k.operador === "<" || k.operador === "<=") {
                    return k.resultado <= k.meta
                      ? 100
                      : (k.meta / k.resultado) * 100;
                  }
                  return Math.min(100, (k.resultado / k.meta) * 100);
                }),
                backgroundColor: cumplimiento.map((k) => `${k.color}40`),
                borderColor: cumplimiento.map((k) => k.color),
                borderRadius: 8,
                barPercentage: 0.28,
                borderWidth: 1.5,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false } },
              y: {
                min: 0,
                max: 100,
                title: { display: true, text: "Cumplimiento (%)" },
                ticks: { stepSize: 25, callback: (v) => `${v}%` },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const k = cumplimiento[ctx.dataIndex];
                    return ` ${k.resultado}${k.unidad} (Cumplimiento: ${Math.round(Number(ctx.raw))}%)`;
                  },
                  afterLabel: (ctx) =>
                    `Fórmula:${cumplimiento[ctx.dataIndex].formula}`,
                },
              },
            },
          }}
        />
      </div>

      <div className="seccion-tarjetas-mini">
        {cumplimiento.map((kpi) => (
          <div className="mini-tarjeta-wrapper" key={kpi.id}>
            <TarjetaKpi kpi={kpi} />
          </div>
        ))}
      </div>
    </article>
  );
}
