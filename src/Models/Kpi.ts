import type { LucideIcon } from "lucide-react";

export type EstadoKpi = "cumple" | "no_cumple" | "sin_datos";

export type OperadordeMeta = ">" | ">=" | "<" | "<=";

export type ApoyoKpi = {
  etiqueta: string;
  valor: string;
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
  apoyo: ApoyoKpi;
  formula: string;
  nota: string;
  ruta?: string;
  textoApoyo?: (detalle: Record<string, number | string>) => string;
};
