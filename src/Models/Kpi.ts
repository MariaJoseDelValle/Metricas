import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type EstadoKpi = "cumple" | "no_cumple" | "sin_datos";

export type OperadordeMeta = ">" | ">=" | "<" | "<=";

export type ApoyoKpi = {
  etiqueta: string;
  valor: string;
};
export type PuntoSerie = {
  mes: string;
  valor: number | null;
};

export type Kpi = {
  id: string;
  nombre: string;
  resultado: number | null;
  meta: number;
  unidad: string;
  operador: OperadordeMeta;
  estado: EstadoKpi;
  color: string;
  icono: LucideIcon;
  fuente: string;
  apoyo?: ApoyoKpi;
  formula: string;
  nota: string;
  detalle?: Record<string, number | string>;

  maximo?: number;
  tendencia?: PuntoSerie[];
  grafica?: ComponentType<{ kpi: Kpi }>;
  textoApoyo?: (detalle: Record<string, number | string>) => string;
};
