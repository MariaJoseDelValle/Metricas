import PaginaKpis from "../PaginaKpi/PaginaKpi.tsx";
import { GraficoLineas } from "../GraficasComunes/GraficoLineas.tsx";

import { kpisSistemasInformacion } from "./kpisSistemasInformacion.ts";
import type { Etiqueta } from "../../Services/IndicadoresApi.ts";
import type { FiltrosPagina } from "../Filtros/FiltrosComunes.tsx";

type PageSistemasInformacionProps = FiltrosPagina & {
  etiqueta: string | null;
  alRecibirEtiquetas: (etiquetas: Etiqueta[]) => void;
};

function PageSistemasInformacion(props: PageSistemasInformacionProps) {
  return (
    <PaginaKpis
      {...props}
      titulo="KPIs y Métricas — Sistemas de Información"
      subtitulo="Atención de soporte funcional,Disponibilidad de servicios criticos,Tiempo de resolución de fallas en servicios críticos (ETL, Vtex) "
      area="sistemas"
      kpis={kpisSistemasInformacion}
      graficas={(_, kpis) =>
        kpis.map((kpi) => <GraficoLineas key={kpi.id} kpi={kpi} />)
      }
    />
  );
}
export default PageSistemasInformacion;
