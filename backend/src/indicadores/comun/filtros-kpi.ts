import type { BaseDatosService } from '../../base-datos/base-datos.service.js';
import { BadRequestException } from '@nestjs/common';
const DEPARTAMENTO_TI = 7;
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export type Usuario = {
  id: number;
  nombre: string;
};

export type FiltrosKpi = {
  desde: string; // AAAA-MM-DD, incluido
  hasta: string; // AAAA-MM-DD, incluido
  usuario?: number;
};

export function filtroUsuario(parametros: unknown[], usuario?: number): string {
  if (usuario === undefined) return '';

  parametros.push(usuario);
  return `AND EXISTS(

   SELECT 1 FROM "TBL_Requests_Assignments" a
    WHERE a."Request_Assignment_ID" = r."Request_ID"
      AND a."Request_Assignment_User_ID" = $${parametros.length}
  )`;
}

export function listarUsuarios(
  bd: BaseDatosService,
  equipo: number,
): Promise<Usuario[]> {
  return bd.consultar<Usuario>(
    `
   SELECT u."User_ID" AS id, u."User_Name" AS nombre
    FROM "TBL_Users" u
    WHERE u."Department_ID" = ${DEPARTAMENTO_TI}
      AND u."Is_Active" = true
     AND EXISTS (
        SELECT 1
        FROM "TBL_Requests_Assignments" a
        INNER JOIN "TBL_Request_Team" rt
          ON rt."Request_Team_Request_ID" = a."Request_Assignment_ID"
        WHERE a."Request_Assignment_User_ID" = u."User_ID"
          AND rt."Request_Team_ID" = $1
      )
    ORDER BY u."User_Name"`,
    [equipo],
  );
}

export function validarFiltros(
  desde?: string,
  hasta?: string,
  usuario?: string,
): FiltrosKpi {
  if (
    !desde ||
    !hasta ||
    !FORMATO_FECHA.test(desde) ||
    !FORMATO_FECHA.test(hasta)
  ) {
    throw new BadRequestException(
      'Los parámetros "desde" y "hasta" son obligatorios,con formato AAAA-MM-DD',
    );
  }
  if (usuario !== undefined && !Number.isInteger(Number(usuario))) {
    throw new BadRequestException('El parámetro "usuario" dede ser un número');
  }
  return {
    desde,
    hasta,
    usuario: usuario === undefined ? undefined : Number(usuario),
  };
}
