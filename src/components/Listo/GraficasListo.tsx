import type { Kpi } from "../../Models/Kpi.ts";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  LineElement,
  PointElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "./GraficasListo.css";
import type { RespuestaKpi } from "../../Services/IndicadoresApi.ts";
import type { CSSProperties } from "react";
import { ChartColumn, ChartPie, ChartLine } from "lucide-react";
import TarjetaKpi from "../TarjetaKpi/TarjetaKpi.tsx";

const COLOR_EN_ATENCION = "#0881f3";
const COLOR_FUERA_DE_TIEMPO = "#f32415";
const COLOR_PAUSADO = "#f5a623";
const COLOR_CERRADOS = "#22a06b";
const COLOR_CREADOS = "#fd8105";

const fecha = (f: string) => `${f.slice(8, 10)}/${f.slice(5, 7)}`;

const nombreMes = (f: string) =>
  `${MESES_CORTOS[Number(f.slice(5, 7)) - 1]} ${f.slice(0, 4)}`;

const MESES_CORTOS = "Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic".split(
  " ",
);

function porcentaje(parte: number, total: number): string {
  if (total === 0) return "0%";
  return `${((parte / total) * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })}%`;
}
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  LineElement,
  PointElement,
);

export function MedidorCumplimientoGeneral({ kpi }: { kpi: Kpi }) {
  const valor = Math.min(Math.max(kpi.resultado ?? 0, 0), 100);
  return (
    <div className="medidor-general">
      <div className="medidor-dona">
        <Doughnut
          data={{
            datasets: [
              {
                data: [valor, 100 - valor],
                backgroundColor: ["#3b6fd8", "#e8ecf7"],
                borderWidth: 0,
              },
            ],
          }}
          options={{
            rotation: -90,
            circumference: 180,
            cutout: "78%",
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          }}
        />

        <span className="medidor-valor">
          {kpi.resultado === null
            ? "—"
            : `${kpi.resultado.toLocaleString("es-CO", { maximumFractionDigits: 2 })}%`}
        </span>
      </div>

      <div className="medidor-cuadros">
        <div>
          <span>Total</span>
          <strong>{kpi.detalle?.ticketsTotal ?? "—"}</strong>
        </div>
        <div>
          <span>A tiempo</span>
          <strong>{kpi.detalle?.ticketsATiempo ?? "—"}</strong>
        </div>
      </div>
    </div>
  );
}

export function MedidorCumplimientoANS({ kpis }: { kpis: Kpi[] }) {
  const ans = kpis.filter((k) => k.id.startsWith("cumplimiento-ANS"));
  return (
    <article
      className="tarjeta-kpi tarjeta-grafica-ans"
      style={{ "--color-kpi": "#eac652" } as CSSProperties}
    >
      <header className="tarjeta-kpi-encabezado">
        <div className="tarjeta-kpi-titulo">
          <span className="tarjeta-kpi-icono">
            <ChartColumn size={18} />
          </span>
          <h3 className="tarjeta-kpi-nombre">Cumplimiento por ANS</h3>
        </div>
        <span className="tarjeta-kpi-meta">Meta ≥ 85% Fuente Solvi</span>
      </header>
      <div className="barras-ans">
        <Bar
          data={{
            labels: ans.map((k) => k.nombre.replace("Cumplimiento ", "")),
            datasets: [
              {
                data: ans.map((k) => k.resultado),
                backgroundColor: ans.map((k) => `${k.color}33`),
                borderColor: ans.map((k) => k.color),
                borderRadius: 4,
                barPercentage: 0.5,
                borderWidth: 1,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: { min: 0, max: 100, ticks: { callback: (v) => `${v}%` } },
            },
            plugins: { legend: { display: false } },
          }}
        />
      </div>

      <div className="seccion-tarjetas-mini">
        {ans.map((kpi) => (
          <div className="mini-tarjeta-wrapper" key={kpi.id}>
            <TarjetaKpi kpi={kpi} />
          </div>
        ))}
      </div>
    </article>
  );
}
export function MedidorTicketAbierto({ datos }: { datos?: RespuestaKpi }) {
  const enAtencion = Number(datos?.detalle?.enAtencion ?? 0);
  const fueraDeTiempo = Number(datos?.detalle?.fueraDeTiempo ?? 0);
  const pausados = Number(datos?.detalle.pausados ?? 0);
  const total = enAtencion + fueraDeTiempo + pausados;

  const estados = [
    { nombre: "En atención", valor: enAtencion, color: COLOR_EN_ATENCION },
    {
      nombre: "Fuera de tiempo",
      valor: fueraDeTiempo,
      color: COLOR_FUERA_DE_TIEMPO,
    },
    { nombre: "Pausados", valor: pausados, color: COLOR_PAUSADO },
  ];

  return (
    <article
      className="tarjeta-kpi tarjeta-grafica-abiertos"
      style={{ "--color-kpi": "#8e0a7c" } as CSSProperties}
    >
      <header className="tarjeta-kpi-encabezado">
        <div className="tarjeta-kpi-titulo">
          <span className="tarjeta-kpi-icono">
            <ChartPie size={18} />
          </span>
          <h3 className="tarjeta-kpi-nombre">En atención vs Vencidos</h3>
        </div>
        <span className="tarjeta-kpi-meta">Total {total} · Fuente Solvi</span>
      </header>

      {total === 0 ? (
        <p className="dona-vacia">Sin tickets abiertos en el período</p>
      ) : (
        <>
          <div className="dona-contenido">
            <div className="dona-abiertos">
              <Doughnut
                data={{
                  labels: estados.map((e) => e.nombre),
                  datasets: [
                    {
                      data: estados.map((e) => e.valor),
                      backgroundColor: estados.map((e) => e.color),
                      borderWidth: 2,
                      hoverOffset: 4,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  cutout: "50%",
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            <div className="dona-leyenda">
              {estados.map((e) => (
                <div
                  key={e.nombre}
                  className="leyenda-fila"
                  style={{ "--color-kpi": e.color } as CSSProperties}
                >
                  <div className="leyenda-encabezado">
                    <span className="leyenda-nombre">
                      <i className="dona-punto" />
                      {e.nombre}
                    </span>
                    <span className="leyenda-cifras">
                      <strong>{porcentaje(e.valor, total)}</strong>
                    </span>
                  </div>
                  <div className="leyenda-barra">
                    <div
                      className="leyenda-barra-relleno"
                      style={{
                        width: porcentaje(e.valor, total).replace(",", "."),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dona-cuadros">
            <div>
              <span>Total</span>
              <strong>{total}</strong>
            </div>
            <div>
              <span>En atención</span>
              <strong>{enAtencion}</strong>
            </div>
            <div>
              <span>Fuera de tiempo</span>
              <strong>{fueraDeTiempo}</strong>
            </div>
            <div>
              <span>Pausados</span>
              <strong>{pausados}</strong>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
export function GraficaTickets({ datos }: { datos?: RespuestaKpi }) {
  const serie = datos?.serie ?? [];
  const desde = String(datos?.detalle?.desde ?? "");
  const hasta = String(datos?.detalle?.hasta ?? "");

  return (
    <article
      className="tarjeta-kpi tarjeta-grafica-creados"
      style={{ "--color-kpi": COLOR_CREADOS } as CSSProperties}
    >
      <header className="tarjeta-kpi-encabezado">
        <div className="tarjeta-kpi-titulo">
          <span className="tarjeta-kpi-icono">
            <ChartLine size={18} />
          </span>
          <h3 className="tarjeta-kpi-nombre">Creados vs cerrados por mes</h3>
        </div>
        <span className="tarjeta-kpi-meta">
          {desde && `${fecha(desde)} – ${fecha(hasta)}`} · Fuente Solvi
        </span>
      </header>

      {serie.length === 0 ? (
        <p className="dona-vacia">Sin tickets en los últimos 3 meses</p>
      ) : (
        <div className="linea-creados">
          <Line
            data={{
              labels: serie.map((s) => nombreMes(s.mes)),

              datasets: [
                {
                  label: "Creados",
                  data: serie.map((s) => s.creados),
                  borderColor: COLOR_CREADOS,
                  backgroundColor: COLOR_CREADOS,
                  tension: 0.3,
                },
                {
                  label: "Cerrados",
                  data: serie.map((s) => s.cerrados),
                  borderColor: COLOR_CERRADOS,
                  backgroundColor: COLOR_CERRADOS,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>
      )}
    </article>
  );
}
