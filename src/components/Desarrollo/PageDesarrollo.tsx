import PaginaKpis from "../PaginaKpi/PaginaKpi.tsx";
import { GraficoLineas } from "../GraficasComunes/GraficoLineas.tsx";

import { kpisDesarrollo } from "./kpisDesarrollo.ts";
import type { Periodo, Usuario } from "../../Services/IndicadoresApi.ts";

type PageDesarrolloProps = {
  periodo: Periodo;
  usuario: string | null;
  alRecibirUsuarios: (usuarios: Usuario[]) => void;
};

function PageDesarrollo({
  periodo,
  usuario,
  alRecibirUsuarios,
}: PageDesarrolloProps) {
  return (
    <PaginaKpis
      titulo="KPIs y Métricas — Desarrollo"
      subtitulo="Impacto de las mejoras, fallas reportadas y satisfacción del cliente interno."
      area="desarrollo"
      kpis={kpisDesarrollo}
      usuario={usuario}
      periodo={periodo}
      alRecibirUsuarios={alRecibirUsuarios}
      graficas={(_, kpis) =>
        kpis.map((kpi) => <GraficoLineas key={kpi.id} kpi={kpi} />)
      }
    />
  );
}

export default PageDesarrollo;
