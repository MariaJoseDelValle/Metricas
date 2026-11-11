import PaginaKpis from "../PaginaKpi/PaginaKpi.tsx";
import { GraficoLineas } from "../GraficasComunes/GraficoLineas.tsx";

import { kpisSistemasInformacion } from "./kpisSistemasInformacion.ts";
import type { Periodo, Usuario } from "../../Services/IndicadoresApi.ts";

type PageSistemasInformacionProps = {
  periodo: Periodo;
  usuario: string | null;
  alRecibirUsuarios: (usuarios: Usuario[]) => void;
};

function PageSistemasInformacion({
  periodo,
  usuario,
  alRecibirUsuarios,
}: PageSistemasInformacionProps) {
  return (
    <PaginaKpis
      titulo="KPIs y Métricas — Sistemas de Información"
      subtitulo="Atención de soporte funcional,Disponibilidad de servicios criticos,Tiempo de resolución de fallas en servicios críticos (ETL, Vtex) "
      area="sistemas"
      kpis={kpisSistemasInformacion}
      usuario={usuario}
      alRecibirUsuarios={alRecibirUsuarios}
      periodo={periodo}
      graficas={(_, kpis) =>
        kpis.map((kpi) => <GraficoLineas key={kpi.id} kpi={kpi} />)
      }
    />
  );
}
export default PageSistemasInformacion;
