import { Injectable } from '@nestjs/common';
import { BaseDatosService } from '../../base-datos/base-datos.service.js';
import { ExclusionEstandarService } from '../comun/exclusion-estandar.service.js';
import {
  filtroUsuario,
  listarUsuarios,
  type FiltrosKpi,
} from '../comun/filtros-kpi.js';

const EQUIPO_SISTEMAS = 3;
const ETIQUETA_CASO_SOPORTE_SISTEMAS = 68;
const COLUMNAS_ATENDIDA = [6, 7, 8, 9, 10];
const ETIQUETA_DISPO_SERVICIOS_CRITICOS = 232;
const ETIQUETAS_FALLAS_CRITICAS = [76, 79];

export type ConteoSoporte = {
  recibidas: number;
  atendidas: number;
};

export type DispoServiciosCriticos = {
  horasindisponibilidad: number;
};

export type HorasFallasCriticas = {
  horasSolucion: number;
};

@Injectable()
export class SistemasRepository {
  constructor(
    private readonly bd: BaseDatosService,
    private readonly exclusion: ExclusionEstandarService,
  ) {}
  usuarios() {
    return listarUsuarios(this.bd, EQUIPO_SISTEMAS);
  }

  async contarSolicitudesSoporte(filtros: FiltrosKpi): Promise<ConteoSoporte> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);
    const sql = `
           SELECT
  COUNT(*)::int AS recibidas,
  COUNT(*) FILTER (
    WHERE r."Request_Board_Column_ID" IN  (${COLUMNAS_ATENDIDA.join(', ')})
     
  )::int AS atendidas
FROM "TBL_Requests" r
INNER JOIN "TBL_Request_Team" rt
  ON rt."Request_Team_Request_ID" = r."Request_ID"
WHERE rt."Request_Team_ID" = ${EQUIPO_SISTEMAS}
  AND  EXISTS (
    SELECT 1 FROM "TBL_Request_Labels" l
    WHERE l."Request_Labels_Request_ID" = r."Request_ID"
      AND l."Request_Labels_Label_ID" =${ETIQUETA_CASO_SOPORTE_SISTEMAS}
  )
 
   AND ${this.exclusion.condicion()}

 
  AND r."Request_Created_At" >= $1::date
      AND r."Request_Created_At" < $2::date + 1
      ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<ConteoSoporte>(sql, parametros);
    return fila;
  }

  async disponibilidadServicioscriticos(
    filtros: FiltrosKpi,
  ): Promise<DispoServiciosCriticos> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);

    const sql = `
      SELECT
        COALESCE (SUM(r."Request_Logged_Hours"), 0)::float AS horasindisponibilidad
        FROM "TBL_Requests" r
        INNER JOIN "TBL_Request_Team" rt
        ON rt."Request_Team_Request_ID"= r."Request_ID"
        WHERE rt."Request_Team_ID"= ${EQUIPO_SISTEMAS}
     
        AND EXISTS(
        SELECT 1 FROM "TBL_Request_Labels" l
        WHERE l."Request_Labels_Request_ID"=r."Request_ID"
        AND l."Request_Labels_Label_ID"=${ETIQUETA_DISPO_SERVICIOS_CRITICOS}

        )

        AND ${this.exclusion.condicion()}
        AND r."Request_Created_At" >= $1::date
        AND r."Request_Created_At" < $2::date + 1
        ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<DispoServiciosCriticos>(
      sql,
      parametros,
    );

    return fila;
  }

  async sumarHorasFallasCriticas(
    filtros: FiltrosKpi,
  ): Promise<HorasFallasCriticas> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroUsuario(parametros, filtros.usuario);

    const sql = `
      SELECT
        COALESCE (SUM(r."Request_Logged_Hours"), 0)::float AS "horasSolucion"
        FROM "TBL_Requests" r
        INNER JOIN "TBL_Request_Team" rt
        ON rt."Request_Team_Request_ID"= r."Request_ID"
        WHERE rt."Request_Team_ID"= ${EQUIPO_SISTEMAS}

        AND EXISTS(
        SELECT 1 FROM "TBL_Request_Labels" l
        WHERE l."Request_Labels_Request_ID"=r."Request_ID"
        AND l."Request_Labels_Label_ID" IN (${ETIQUETAS_FALLAS_CRITICAS.join(', ')})
        )

        AND ${this.exclusion.condicion()}
        AND r."Request_Created_At" >= $1::date
        AND r."Request_Created_At" < $2::date + 1
        ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<HorasFallasCriticas>(
      sql,
      parametros,
    );

    return fila;
  }
}
