import type { EstadoKpi, OperadordeMeta } from "../Models/Kpi.ts";

// Lo que responde el backend por cada indicador.
export type RespuestaKpi = {
  id: string;
  nombre: string;
  resultado: number | null;
  meta: number;
  operador: OperadordeMeta;
  unidad: string;
  estado: EstadoKpi;
  detalle: Record<string, number | string>;
};

export type Periodo = {
  desde: string; // AAAA-MM-DD
  hasta: string; // AAAA-MM-DD
};

export type Usuario = {
  id: number;
  nombre: string;
};
export type RespuestaArea = {
  kpis: RespuestaKpi[];
  usuarios: Usuario[];
};

export async function obtenerArea(
  area: string,
  periodo: Periodo,
  usuario: number | null,
): Promise<RespuestaArea> {
  const parametros = new URLSearchParams({
    desde: periodo.desde,
    hasta: periodo.hasta,
  });
  if (usuario !== null) parametros.set("usuario", String(usuario));
  const url = `${import.meta.env.VITE_API_URL}/indicadores/${area}?${parametros}`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`El backend respondio ${respuesta.status} en ${area}`);
  }
  return respuesta.json();
}

function aTexto(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function periodoMesActual(): Periodo {
  const hoy = new Date();
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  return { desde: aTexto(primerDia), hasta: aTexto(ultimoDia) };
}

export async function obtenerKpi(
  ruta: string,
  periodo: Periodo,
): Promise<RespuestaKpi> {
  const parametros = new URLSearchParams({
    desde: periodo.desde,
    hasta: periodo.hasta,
  });
  const url = `${import.meta.env.VITE_API_URL}/indicadores/${ruta}?${parametros}`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`El backend respondió ${respuesta.status} en ${ruta}`);
  }
  return respuesta.json();
}
