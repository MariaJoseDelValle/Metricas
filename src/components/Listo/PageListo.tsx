import PaginaKpis from "../PaginaKpi/PaginaKpi.tsx";

import { kpisListo } from "./kpisListo.ts";
import type { FiltrosPagina } from "../Filtros/FiltrosComunes.tsx";
import {
  GraficaTickets,
  MedidorCumplimientoANS,
  MedidorTicketAbierto,
} from "./GraficasListo.tsx";

type PageListoProps = FiltrosPagina & {
  estado: string | null;
};

function PageListo(props: PageListoProps) {
  return (
    <PaginaKpis
      {...props}
      titulo="KPIs y Métricas — Listo"
      subtitulo="Cumplimiento general, Cumplimiento por ANS"
      area="listo"
      kpis={kpisListo}
      graficas={(dtos) => (
        <>
          <MedidorCumplimientoANS
            datos={dtos.find((r) => r.id === "ans-por-persona")}
            estado={props.estado}
          />
          <MedidorTicketAbierto
            datos={dtos.find((r) => r.id === "tickets-abiertos")}
          />
          <GraficaTickets
            datos={dtos.find((r) => r.id === "creados-cerrados")}
          />
        </>
      )}
    />
  );
}

export default PageListo;
