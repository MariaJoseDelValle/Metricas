import type { EstadoKpi, OperadordeMeta, PuntoSerie } from "../Models/Kpi.ts";

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
  serie?: MesSerie[];
  tendencia?: PuntoSerie[];
  personas?: PersonaANS[];
};

export type Periodo = {
  desde: string; // AAAA-MM-DD
  hasta: string; // AAAA-MM-DD
};

export type Usuario = {
  id: number | string;
  nombre: string;
};
export type Estado = {
  id: number | string;
  nombre: string;
};

export type CumplimientoANS = {
  cumplimiento: number;
  ticketsTotal: number;
  ticketsATiempo: number;
} | null;

export type PersonaANS = {
  correo: string;
  nombre: string;
  ans: CumplimientoANS[];
};

export type RespuestaArea = {
  kpis: RespuestaKpi[];
  usuarios: Usuario[];
  etiquetas?: Etiqueta[];
};
export type MesSerie = {
  mes: string;
  creados: number;
  cerrados: number;
};
export type Etiqueta = {
  id: number;
  nombre: string;
};
export const ESTADOS_TICKET: Estado[] = [
  { id: "en-atencion", nombre: "En atención" },
  { id: "fuera-de-tiempo", nombre: "Fuera de tiempo" },
  { id: "pausado", nombre: "Pausados" },
  { id: "cerrado", nombre: "Cerrado" },
  { id: "cerrado-fuera-de-tiempo", nombre: "Cerrado fuera de tiempo" },
];

export async function obtenerArea(
  area: string,
  periodo: Periodo,
  usuario: string | null,
  estado: string | null = null,
  etiqueta: string | null = null,
): Promise<RespuestaArea> {
  const parametros = new URLSearchParams({
    desde: periodo.desde,
    hasta: periodo.hasta,
  });
  if (usuario !== null) parametros.set("usuario", String(usuario));
  if (estado !== null) parametros.set("estado", estado);
  if (etiqueta !== null) parametros.set("etiqueta", etiqueta);
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
