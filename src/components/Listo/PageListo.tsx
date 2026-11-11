import PaginaKpis, { combinar } from "../PaginaKpi/PaginaKpi.tsx";

import { kpisListo, kpisANS } from "./kpisListo.ts";
import type { Periodo, Usuario } from "../../Services/IndicadoresApi.ts";
import {
  GraficaTickets,
  MedidorCumplimientoANS,
  MedidorTicketAbierto,
} from "./GraficasListo.tsx";

type PageListoProps = {
  periodo: Periodo;
  usuario: string | null;
  alRecibirUsuarios: (usuarios: Usuario[]) => void;
};

function PageListo({ periodo, usuario, alRecibirUsuarios }: PageListoProps) {
  return (
    <PaginaKpis
      titulo="KPIs y Métricas — Listo"
      subtitulo="Cumplimiento general, Cumplimiento por ANS"
      area="listo"
      kpis={kpisListo}
      usuario={usuario}
      periodo={periodo}
      alRecibirUsuarios={alRecibirUsuarios}
      graficas={(dtos) => {
        const ans = kpisANS.map((kpi) => {
          const datos = dtos.find((r) => r.id === kpi.id);
          return datos ? combinar(kpi, datos) : kpi;
        });
        return (
          <>
            <MedidorCumplimientoANS kpis={ans} />
            <MedidorTicketAbierto
              datos={dtos.find((r) => r.id === "tickets-abiertos")}
            />

            <GraficaTickets
              datos={dtos.find((r) => r.id === "creados-cerrados")}
            />
          </>
        );
      }}
    />
  );
}

export default PageListo;
