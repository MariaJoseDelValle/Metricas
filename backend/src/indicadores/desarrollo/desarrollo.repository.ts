import { Injectable } from '@nestjs/common';
import { BaseDatosService } from '../../base-datos/base-datos.service.js';
import { ExclusionEstandarService } from '../comun/exclusion-estandar.service.js';
import type { FiltrosKpi } from '../comun/filtros-kpi.js';
import { filtroUsuario, listarUsuarios } from '../comun/filtros-kpi.js';

const EQUIPO_DESARROLLO_TI = 11;
const ETIQUETA_CASO_SOPORTE_DESARROLLO = 192;

export type ConteoCalificaciones = {
  calificaciones: number;
  sumaPuntajes: number;
};

export type ConteoFallas = {
  ticketsTotales: number;
  ticketsFallas: number;
};

export type TiempoResolucion = {
  creado: string;
  cerrado: string;
};

@Injectable()
export class DesarrolloRepository {
  constructor(
    private readonly bd: BaseDatosService,
    private readonly exclusion: ExclusionEstandarService,
  ) {}
  usuarios() {
    return listarUsuarios(this.bd, EQUIPO_DESARROLLO_TI);
  }
  async sumarCalificaciones(
    filtros: FiltrosKpi,
  ): Promise<ConteoCalificaciones> {
  const parametros: unknown[] = [filtros.desde, filtros.hasta];
let condicionUsuario = '';
if (filtros.usuario !== undefined) {
  parametros.push(filtros.usuario);
  condicionUsuario = `AND EXISTS (
    SELECT 1 FROM "TBL_Resolution_Rating_Resolvers" rv
    WHERE rv."Rating_ID" = rr."Rating_ID"
      AND rv."Resolver_User_ID" = $${parametros.length}
  )`;
}
    const sql = `
      SELECT
        COUNT(*)::int                  AS calificaciones,
        COALESCE(SUM(rr."Solution_Score"), 0):: int AS "sumaPuntajes"
      FROM "TBL_Resolution_Ratings" rr
      INNER JOIN "TBL_Requests" r ON r."Request_ID" = rr."Request_ID"
      INNER JOIN "TBL_Request_Team" rt ON rt."Request_Team_Request_ID" = r."Request_ID"
      WHERE rt."Request_Team_ID" = ${EQUIPO_DESARROLLO_TI}
        AND ${this.exclusion.condicion()}
        AND rr."Created_At" >= ($1::date)::timestamp AT TIME ZONE 'America/Bogota'
        AND rr."Created_At" <  ($2::date + 1)::timestamp AT TIME ZONE 'America/Bogota'
        ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<ConteoCalificaciones>(
      sql,
      parametros,
    );
    return fila;
  }

  async contarFallas(filtros: FiltrosKpi): Promise<ConteoFallas> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);

    const sql = `

        SELECT 
        COUNT (*)::int AS "ticketsTotales",
        COUNT(*) FILTER(
        WHERE EXISTS(
        SELECT 1 FROM "TBL_Request_Labels" l
        WHERE l."Request_Labels_Request_ID" = r."Request_ID"
        AND l."Request_Labels_Label_ID"= ${ETIQUETA_CASO_SOPORTE_DESARROLLO}
        
        )
        
        )::int AS "ticketsFallas"
       
          FROM "TBL_Requests" r
      INNER JOIN "TBL_Request_Team" rt
        ON rt."Request_Team_Request_ID" = r."Request_ID"
      WHERE rt."Request_Team_ID" = ${EQUIPO_DESARROLLO_TI}
         AND ${this.exclusion.condicion()}
      AND r."Request_Created_At" >= $1::date
      AND r."Request_Created_At" < $2::date + 1
      ${condicionUsuario}`;
    const [fila] = await this.bd.consultar<ConteoFallas>(sql, parametros);
    return fila;
  }

  async tiempoResolucion(filtros: FiltrosKpi): Promise<TiempoResolucion[]> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);
    const sql = `
  SELECT
      to_char(r."Request_Created_At",  'YYYY-MM-DD"T"HH24:MI:SS') AS creado,
      to_char(r."Request_Finished_At", 'YYYY-MM-DD"T"HH24:MI:SS') AS cerrado
    FROM "TBL_Requests" r
    INNER JOIN "TBL_Request_Team" rt
      ON rt."Request_Team_Request_ID" = r."Request_ID"
    WHERE rt."Request_Team_ID" = ${EQUIPO_DESARROLLO_TI}
      AND ${this.exclusion.condicion()}
      AND r."Request_Finished_At" IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM "TBL_Request_Labels" l
        WHERE l."Request_Labels_Request_ID" = r."Request_ID"
          AND l."Request_Labels_Label_ID" = ${ETIQUETA_CASO_SOPORTE_DESARROLLO}
      )
      AND r."Request_Finished_At" >= $1::date
      AND r."Request_Finished_At" <  $2::date + 1
      ${condicionUsuario}`;

    return this.bd.consultar<TiempoResolucion>(sql, parametros);
  }
}
