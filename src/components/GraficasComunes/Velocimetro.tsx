import ReactEChartsCore from "echarts-for-react/esm/core";

import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import type { Kpi } from "../../Models/Kpi.ts";
import "./Velocimetro.css";

echarts.use([GaugeChart, CanvasRenderer]);

export function Velocimetro({ kpi }: { kpi: Kpi }) {
  const maximo = kpi.maximo ?? 100;
  const valor = Math.min(Math.max(kpi.resultado ?? 0, 0), maximo);
  const sufijoEtiqueta = kpi.unidad === "%" ? "%" : "";
  const texto =
    kpi.resultado === null
      ? "—"
      : `${kpi.resultado.toLocaleString("es-CO", { maximumFractionDigits: 2 })}${kpi.unidad.trim()}`;

  const base = {
    type: "gauge" as const,
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: maximo,
    center: ["50%", "75%"],
    radius: "95%",
  };

  return (
    <div className="velocimetro">
      <ReactEChartsCore
        echarts={echarts}
        style={{ height: "100%", width: "100%" }}
        option={{
          series: [
            {
              ...base,
              progress: {
                show: true,
                width: 14,
                itemStyle: { color: kpi.color },
              },
              axisLine: { lineStyle: { width: 14, color: [[1, "#e8ecf7"]] } },
              pointer: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              splitNumber: 1,
              axisLabel: {
                show: false,
              },
              detail: {
                offsetCenter: [0, "-15%"],
                fontSize: 28,
                fontWeight: 700,
                formatter: () => texto,
              },

              data: [{ value: valor }],
            },

            {
              ...base,
              z: 10,
              pointer: {
                icon: "rect",
                length: "18%",
                width: 3,
                offsetCenter: [0, "-84%"],
                itemStyle: { color: "#ef4444" },
              },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              detail: { show: false },
              data: [{ value: kpi.meta }],
            },
          ],
        }}
      />
      <div className="velocimetro-extremos">
        <span>0{sufijoEtiqueta}</span>
        <span>
          {maximo}
          {sufijoEtiqueta}
        </span>
      </div>
    </div>
  );
}
