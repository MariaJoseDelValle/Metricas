import { Injectable } from '@nestjs/common';
import { BaseDatosService } from '../../base-datos/base-datos.service.js';
import {
  filtroResolutorListo,
  type FiltrosListo,
} from '../comun/filtros-kpi.js';
export type Semana = {
  mes: string;
  creados: number;
  cerrados: number;
};

export type UsuarioListo = {
  id: string;
  nombre: string;
};

const ESTADO_PAUSADO = 'Pausado';
const ESTADOS_EN_ATENCION = ['En Atención', 'En atención'];
const ESTADO_FUERA_DE_TIEMPO = 'Fuera de tiempo';

const ESTADOS_A_TIEMPO = ['En Atención', 'En atención', 'Cerrado'];

const lista = (valores: string[]) => valores.map((v) => `'${v}'`).join(', ');

export type ConteoGeneral = {
  ticketsTotal: number;
  ticketsATiempo: number;
};

export type ConteoAbiertos = {
  enAtencion: number;
  fueraDeTiempo: number;
  pausados: number;
};

@Injectable()
export class ListoRepository {
  constructor(private readonly bd: BaseDatosService) {}

  usuarios(filtros: FiltrosListo): Promise<UsuarioListo[]> {
    return this.bd.consultar<UsuarioListo>(
      `
      SELECT id, nombre FROM (
        SELECT DISTINCT ON (LOWER(TRIM(r.resolutor_correo)))
          LOWER(TRIM(r.resolutor_correo)) AS id,
          TRIM(r.resolutor_nombre)        AS nombre
        FROM "TBL_Resolutor_Solvi" r
        WHERE r.resolutor_activo = true
          AND r.resolutor_correo LIKE '%@%'
          AND r.resolutor_nombre NOT ILIKE '%prueba%'
                  
         AND EXISTS (
            SELECT 1 FROM "TBL_Ticket_Solvi" t
            WHERE LOWER(TRIM(t.ticket_solvi_correo_resolutor)) = LOWER(TRIM(r.resolutor_correo))
              AND t.ticket_solvi_fechaapertura >= ($1::date)::timestamp AT TIME ZONE 'America/Bogota'
              AND t.ticket_solvi_fechaapertura <  ($2::date + 1)::timestamp AT TIME ZONE 'America/Bogota'
          )

        ORDER BY LOWER(TRIM(r.resolutor_correo)), TRIM(r.resolutor_nombre)
      ) x
      ORDER BY nombre`,
      [filtros.desde, filtros.hasta],
    );
  }

  async general(filtros: FiltrosListo): Promise<ConteoGeneral> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];

    const condicionUsuario = filtroResolutorListo(parametros, filtros.usuario);

    const sql = `
      SELECT
        COUNT(*)::int AS "ticketsTotal",
        COUNT(*) FILTER (
          WHERE t.ticket_solvi_estado IN (${lista(ESTADOS_A_TIEMPO)})
        )::int AS "ticketsATiempo"
      FROM "TBL_Ticket_Solvi" t
      WHERE t.ticket_solvi_estado <> '${ESTADO_PAUSADO}'
        AND t.ticket_solvi_fechaapertura >= ($1::date)::timestamp AT TIME ZONE 'America/Bogota'
        AND t.ticket_solvi_fechaapertura <  ($2::date + 1)::timestamp AT TIME ZONE 'America/Bogota'
        ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<ConteoGeneral>(sql, parametros);
    return fila;
  }

  async ANS(filtros: FiltrosListo, nivel: number): Promise<ConteoGeneral> {
    const parametros: unknown[] = [
      filtros.desde,
      filtros.hasta,
      `ANS ${nivel}`,
    ];
    const condicionUsuario = filtroResolutorListo(parametros, filtros.usuario);

    const sql = `
        SELECT
        COUNT(*)::int AS "ticketsTotal",
        COUNT(*) FILTER (
        WHERE 
t.ticket_solvi_estado IN (${lista(ESTADOS_A_TIEMPO)})
        )::int AS "ticketsATiempo"
        FROM "TBL_Ticket_Solvi" t
        WHERE t.ticket_solvi_estado <> '${ESTADO_PAUSADO}'
         AND TRIM(t.ticket_solvi_ans) = $3
        AND t.ticket_solvi_fechaapertura >= ($1::date)::timestamp AT TIME ZONE 'America/Bogota'
        AND t.ticket_solvi_fechaapertura <  ($2::date + 1)::timestamp AT TIME ZONE 'America/Bogota'
       
        ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<ConteoGeneral>(sql, parametros);
    return fila;
  }

  async Abiertos(filtros: FiltrosListo): Promise<ConteoAbiertos> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];

    const condicionUsuario = filtroResolutorListo(parametros, filtros.usuario);

    const sql = `
      SELECT
        COUNT(*) FILTER (
          WHERE TRIM(t.ticket_solvi_estado) IN (${lista(ESTADOS_EN_ATENCION)})
        )::int AS "enAtencion",
        COUNT(*) FILTER (
          WHERE TRIM(t.ticket_solvi_estado) = '${ESTADO_FUERA_DE_TIEMPO}'
        )::int AS "fueraDeTiempo",
        COUNT(*) FILTER(
        WHERE TRIM (t.ticket_solvi_estado) ='${ESTADO_PAUSADO}'
  ):: int AS "pausados"
        
        
      FROM "TBL_Ticket_Solvi" t
      WHERE t.ticket_solvi_fechaapertura >= ($1::date)::timestamp AT TIME ZONE 'America/Bogota'
        AND t.ticket_solvi_fechaapertura <  ($2::date + 1)::timestamp AT TIME ZONE 'America/Bogota'
        ${condicionUsuario}`;

    const [fila] = await this.bd.consultar<ConteoAbiertos>(sql, parametros);
    return fila;
  }

  async ConteoCreados(filtros: FiltrosListo): Promise<Semana[]> {
    const parametros: unknown[] = [filtros.desde, filtros.hasta];
    const condicionUsuario = filtroResolutorListo(parametros, filtros.usuario);

    return this.bd.consultar<Semana>(
      `
      WITH meses AS (
        SELECT generate_series(
          date_trunc('month', $1::date),
          date_trunc('month', $2::date),
          interval '1 month'
        )::date AS mes
      ),
      creados AS (
        SELECT date_trunc('month', t.ticket_solvi_fechaapertura AT TIME ZONE 'America/Bogota')::date AS mes,
               COUNT(*)::int AS n
        FROM "TBL_Ticket_Solvi" t
        WHERE t.ticket_solvi_fechaapertura >= ($1::date)::timestamp AT TIME ZONE 'America/Bogota'
          AND t.ticket_solvi_fechaapertura <  ($2::date + 1)::timestamp AT TIME ZONE 'America/Bogota'
          ${condicionUsuario}
        GROUP BY 1
      ),
      cerrados AS (
        SELECT date_trunc('month', t."FechaCierreReal" AT TIME ZONE 'America/Bogota')::date AS mes,
               COUNT(*)::int AS n
        FROM "TBL_Ticket_Solvi" t
        WHERE t."FechaCierreReal" >= ($1::date)::timestamp AT TIME ZONE 'America/Bogota'
          AND t."FechaCierreReal" <  ($2::date + 1)::timestamp AT TIME ZONE 'America/Bogota'
          ${condicionUsuario}
        GROUP BY 1
      )
      SELECT to_char(m.mes, 'YYYY-MM-DD') AS mes,
             COALESCE(c.n, 0) AS creados,
             COALESCE(x.n, 0) AS cerrados
      FROM meses m
      LEFT JOIN creados  c USING (mes)
      LEFT JOIN cerrados x USING (mes)
      ORDER BY m.mes`,

      parametros,
    );
  }
}
