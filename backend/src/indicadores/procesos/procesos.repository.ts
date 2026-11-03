import { Injectable } from '@nestjs/common';
import { BaseDatosService } from '../../base-datos/base-datos.service.js';
import { ExclusionEstandarService } from '../comun/exclusion-estandar.service.js';
import type { FiltrosKpi } from '../comun/filtros-kpi.js';
import { filtroUsuario, listarUsuarios } from '../comun/filtros-kpi.js';

const EQUIPO_PROCESOS = 12;
const ETIQUETA_PLANIFICADO = 235;
const ETIQUETA_ESTANDARIZADO = 208;
const ETIQUETAS_ENTREGABLES = [199, 205, 206];
const COMPROMETIDOS = [4, 5];
const COMPLETADO = [6, 7, 8, 9, 10];
const ETIQUETA_IMPLEMENTADO = 207;
const ETIQUETA_ENTREGADO = 237;
const ETIQUETA_DEVOLUCION = 236;

const fechaEtiqueta = (etiqueta: number) => `(
  SELECT MIN(e."Request_Labels_Date") AT TIME ZONE 'America/Bogota'
  FROM "TBL_Request_Labels" e
  WHERE e."Request_Labels_Request_ID" = r."Request_ID"
    AND e."Request_Labels_Label_ID" = ${etiqueta}
)`;
const enPeriodo = (fecha: string) =>
  `(${fecha} >= $1::date AND ${fecha} < $2::date + 1)`;

export type ConteoDocumentacion = {
  ticketsPlanificados: number;
  ticketsEstandarizados: number;
};
export type CumplimientoEntregables = {
  ticketsComprometidos: number;
  ticketsCompletados: number;
};
export type ConteoMejoras = {
  ticketsEntregados: number;
  ticketsImplementados: number;
};

export type Devolucion = {
  ticketsPresentados: number;
  ticketsDevueltos: number;
};

@Injectable()
export class ProcesosRepository {
  constructor(
    private readonly bd: BaseDatosService,
    private readonly exclusion: ExclusionEstandarService,
  ) {}
  usuarios() {
    return listarUsuarios(this.bd, EQUIPO_PROCESOS);
  }
  async contarDocumentacion(filtros: FiltrosKpi): Promise<ConteoDocumentacion> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);
    const planificado = enPeriodo(fechaEtiqueta(ETIQUETA_PLANIFICADO));
    const estandarizado = enPeriodo(fechaEtiqueta(ETIQUETA_ESTANDARIZADO));

    const sql = `
    SELECT
      COUNT(*)::int AS "ticketsPlanificados",
      COUNT(*) FILTER (WHERE ${estandarizado})::int AS "ticketsEstandarizados"
    FROM "TBL_Requests" r
    INNER JOIN "TBL_Request_Team" rt
      ON rt."Request_Team_Request_ID" = r."Request_ID"
    WHERE rt."Request_Team_ID" = ${EQUIPO_PROCESOS}
      AND (${planificado} OR ${estandarizado})
      AND ${this.exclusion.condicion()}
      ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<ConteoDocumentacion>(
      sql,
      parametros,
    );
    return fila;
  }
  async entregables(filtros: FiltrosKpi): Promise<CumplimientoEntregables> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);

    const sql = `
    SELECT
      COUNT(*)::int AS "ticketsComprometidos",
      COUNT(*) FILTER (
        WHERE r."Request_Board_Column_ID" IN (${COMPLETADO.join(', ')})
      )::int AS "ticketsCompletados"
    FROM "TBL_Requests" r
    INNER JOIN "TBL_Request_Team" rt
      ON rt."Request_Team_Request_ID" = r."Request_ID"
    WHERE rt."Request_Team_ID" = ${EQUIPO_PROCESOS}
      AND r."Request_Board_Column_ID" IN (${[...COMPROMETIDOS, ...COMPLETADO].join(', ')})
      AND ${this.exclusion.condicion()}
      AND EXISTS (
        SELECT 1 FROM "TBL_Request_Labels" l
        WHERE l."Request_Labels_Request_ID" = r."Request_ID"
          AND l."Request_Labels_Label_ID" IN (${ETIQUETAS_ENTREGABLES.join(', ')})
      )
      AND r."Request_Created_At" >= $1::date
      AND r."Request_Created_At" <  $2::date + 1
      ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<CumplimientoEntregables>(
      sql,
      parametros,
    );
    return fila;
  }
  async mejoras(filtros: FiltrosKpi): Promise<ConteoMejoras> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);
    const entregado = enPeriodo(fechaEtiqueta(ETIQUETA_ENTREGADO));
    const implementado = enPeriodo(fechaEtiqueta(ETIQUETA_IMPLEMENTADO));

    const sql = `
    SELECT
      COUNT(*)::int AS "ticketsEntregados",
      COUNT(*) FILTER (WHERE ${implementado})::int AS "ticketsImplementados"
    FROM "TBL_Requests" r
    INNER JOIN "TBL_Request_Team" rt
      ON rt."Request_Team_Request_ID" = r."Request_ID"
    WHERE rt."Request_Team_ID" = ${EQUIPO_PROCESOS}
      AND (${entregado} OR ${implementado})
      AND ${this.exclusion.condicion()}
      ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<ConteoMejoras>(sql, parametros);
    return fila;
  }

  async devolucion(filtros: FiltrosKpi): Promise<Devolucion> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);
    const fechaDevolucion = fechaEtiqueta(ETIQUETA_DEVOLUCION);
    const fechaPresentacion = `COALESCE(
      (SELECT MIN(h."Request_History_Changed_At") AT TIME ZONE 'America/Bogota'
       FROM "TBL_Requests_History" h
       WHERE h."Request_History_Request_ID" = r."Request_ID"
         AND h."Request_History_Action" = 'column_move'
         AND (h."Request_History_Metadata"->>'toColumnId')::int IN (${COMPLETADO.join(', ')})),
      CASE WHEN r."Request_Board_Column_ID" IN (${COMPLETADO.join(', ')})
           THEN r."Request_Created_At" END
    )`;

    const sql = `
    SELECT
      COUNT(*)::int AS "ticketsPresentados",
      COUNT(*) FILTER (WHERE ${enPeriodo(fechaDevolucion)})::int AS "ticketsDevueltos"
    FROM "TBL_Requests" r
    INNER JOIN "TBL_Request_Team" rt
      ON rt."Request_Team_Request_ID" = r."Request_ID"
    WHERE rt."Request_Team_ID" = ${EQUIPO_PROCESOS}
      AND (${enPeriodo(fechaPresentacion)} OR ${enPeriodo(fechaDevolucion)})
      AND ${this.exclusion.condicion()}
      AND EXISTS (
        SELECT 1 FROM "TBL_Request_Labels" l
        WHERE l."Request_Labels_Request_ID" = r."Request_ID"
          AND l."Request_Labels_Label_ID" IN (${ETIQUETAS_ENTREGABLES.join(', ')})
      )
      ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<Devolucion>(sql, parametros);
    return fila;
  }
}
