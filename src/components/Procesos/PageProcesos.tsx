import PaginaKpis from "../PaginaKpi/PaginaKpi";
import { kpisProcesos } from "./kpisProcesos";
import type { Periodo, Usuario } from "../../Services/IndicadoresApi";

type PageProcesosProps = {
  periodo: Periodo;
  usuario: number | null;
  alRecibirUsuarios: (usuarios: Usuario[]) => void;
};

function PageProcesos({
  periodo,
  usuario,
  alRecibirUsuarios,
}: PageProcesosProps) {
  return (
    <PaginaKpis
      titulo="KPIs y Métricas — Procesos"
      subtitulo="Documentacion de procesos,Cumplimiento de entregables,Devolución, Mejoras implementadas."
      area="procesos"
      kpis={kpisProcesos}
      usuario={usuario}
      periodo={periodo}
      alRecibirUsuarios={alRecibirUsuarios}
    />
  );
}

export default PageProcesos;
