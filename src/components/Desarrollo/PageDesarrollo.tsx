import PaginaKpis, { combinar } from "../PaginaKpi/PaginaKpi.tsx";
import { GraficoLineas } from "../GraficasComunes/GraficoLineas.tsx";
import { kpisDesarrollo } from "./kpisDesarrollo.ts";
import type { Etiqueta } from "../../Services/IndicadoresApi.ts";
import type { FiltrosPagina } from "../Filtros/FiltrosComunes.tsx";
import { MedidorCumplimiento } from "./GraficasDesarrollo.tsx";

type PageDesarrolloProps = FiltrosPagina & {
  etiqueta: string | null;
  alRecibirEtiquetas: (etiquetas: Etiqueta[]) => void;
};
const kpisTarjetas = kpisDesarrollo.filter(
  (kpi) => !["resolucion-fallas", "satisfaccion"].includes(kpi.id),
);

function PageDesarrollo(props: PageDesarrolloProps) {
  return (
    <PaginaKpis
      {...props}
      titulo="KPIs y Métricas — Desarrollo"
      subtitulo="Impacto de las mejoras, fallas reportadas y satisfacción del cliente interno."
      area="desarrollo"
      kpis={kpisTarjetas}
      graficas={(dtos) => {
        // Conservamos kpisDesarrollo completo para MedidorCumplimiento
        const general = kpisDesarrollo.map((kpi) => {
          const datos = dtos.find((r) => r.id === kpi.id);
          return datos ? combinar(kpi, datos) : kpi;
        });

        return (
          <>
            <MedidorCumplimiento kpis={general} />

            {general.map((kpi) => (
              <GraficoLineas key={kpi.id} kpi={kpi} />
            ))}
          </>
        );
      }}
    />
  );
}
export default PageDesarrollo;
