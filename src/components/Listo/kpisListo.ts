import {
  Settings,
  FileClock,
  Clock,
  FileArchive,
  File,
  FileText,
} from "lucide-react";

import { MedidorCumplimientoGeneral } from "./GraficasListo.tsx";

import type { Kpi } from "../../Models/Kpi.ts";

export const kpisListo: Kpi[] = [
  {
    id: "cumplimiento-general",
    nombre: "Cumplimiento General",
    resultado: null,
    estado: "sin_datos",
    meta: 85,
    unidad: "%",
    operador: ">=",
    color: "#6ba1f1",
    icono: Clock,
    fuente: "SOLVI",
    formula: "(# de tickets a tiempo /Cantidad de tickets) x 100",
    nota: "Excluir tickets que se encuentren en estado 'Pausado'",

    grafica: MedidorCumplimientoGeneral,
  },
];
export const kpisANS: Kpi[] = [
  {
    id: "cumplimiento-ANS1",
    nombre: "Cumplimiento ANS 1",
    resultado: null,
    estado: "sin_datos",
    meta: 85,
    unidad: "%",
    operador: ">=",
    color: "#cee659",
    icono: FileClock,
    fuente: "PRISMA",
    formula:
      "(Cantidad de tickets  ANS 1 a tiempo /Cantidad de tickets ANS 1) x 100",
    nota: "Excluir tickets que se encuentren en estado 'Pausado'",

    textoApoyo: (d) =>
      `${d.ticketsTotal} tickets totales, ${d.ticketsATiempo} a tiempo`,
  },

  {
    id: "cumplimiento-ANS2",
    nombre: "Cumplimiento ANS 2",
    resultado: null,
    estado: "sin_datos",
    meta: 85,
    unidad: "%",
    operador: ">=",
    color: "#8e2f9b",
    icono: Settings,
    fuente: "PRISMA",
    formula:
      "(Cantidad de tickets  ANS 2 a tiempo /Cantidad de tickets ANS 2) x 100",
    nota: "Excluir tickets que se encuentren en estado 'Pausado'",
  },

  {
    id: "cumplimiento-ANS3",
    nombre: "Cumplimiento ANS 3",
    resultado: null,
    estado: "sin_datos",
    meta: 85,
    unidad: "%",
    operador: ">=",
    color: "#f5af54",
    icono: FileArchive,
    fuente: "PRISMA",
    formula:
      "(Cantidad de tickets  ANS 3 a tiempo /Cantidad de tickets ANS 3) x 100",
    nota: "Excluir tickets que se encuentren en estado 'Pausado'",
  },
  {
    id: "cumplimiento-ANS4",
    nombre: "Cumplimiento ANS 4",
    resultado: null,
    estado: "sin_datos",
    meta: 85,
    unidad: "%",
    operador: ">=",
    color: "#9b5e25",
    icono: FileText,
    fuente: "PRISMA",
    formula:
      "(Cantidad de tickets  ANS 4 a tiempo /Cantidad de tickets ANS 4) x 100",
    nota: "Excluir tickets que se encuentren en estado 'Pausado'",
  },

  {
    id: "cumplimiento-ANS5",
    nombre: "Cumplimiento ANS 5",
    resultado: null,
    estado: "sin_datos",
    meta: 85,
    unidad: "%",
    operador: ">=",
    color: "#328f5a",
    icono: File,
    fuente: "PRISMA",
    formula:
      "(Cantidad de tickets  ANS 5 a tiempo /Cantidad de tickets ANS 5) x 100",
    nota: "Excluir tickets que se encuentren en estado 'Pausado'",
  },
];
