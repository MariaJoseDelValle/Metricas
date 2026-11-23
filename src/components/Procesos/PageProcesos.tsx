import PaginaKpis from "../PaginaKpi/PaginaKpi";
import { kpisProcesos } from "./kpisProcesos";
import type { FiltrosPagina } from "../Filtros/FiltrosComunes.tsx";
import { GraficaGeneral } from "./GraficasProcesos";

function PageProcesos(filtros: FiltrosPagina) {
  return (
    <PaginaKpis
      {...filtros}
      titulo="KPIs y Métricas — Procesos"
      subtitulo="Documentacion de procesos,Cumplimiento de entregables,Devolución, Mejoras implementadas."
      area="procesos"
      kpis={kpisProcesos}
      graficas={(_, kpisConDatos) => <GraficaGeneral kpis={kpisConDatos} />}
    />
  );
}

export default PageProcesos;
