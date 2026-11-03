import { File, Undo2, ArrowUpRight } from "lucide-react";
import type { Kpi } from "../../Models/Kpi";

// "2026-10-01" → "01/10"
const diaMes = (fecha: number | string) =>
  String(fecha).split("-").reverse().slice(0, 2).join("/");

export const kpisProcesos: Kpi[] = [
  {
    id: "documentacion-procesos",
    nombre: "Documentación de Procesos",
    resultado: null,
    estado: "sin_datos",
    meta: 70,
    unidad: "%",
    operador: ">=",
    color: "#10b981",
    icono: File,
    fuente: "PRISMA",
    formula: "Procesos estandarizados/Procesos Planificados x 100",
    nota: 'Tickets con la etiqueta "Estandarizado" y"Planificado.',
    apoyo: { etiqueta: "Tickets del período", valor: "—" },
    ruta: "procesos/documentacion-procesos",
    textoApoyo: (d) =>
      `${d.ticketsEstandarizados} estandarizados de ${d.ticketsPlanificados} planificados`,
  },
  {
    id: "cumplimiento-entregables",
    nombre: "Cumplimiento de entregables",
    resultado: null,
    estado: "sin_datos",
    meta: 90,
    unidad: "%",
    operador: ">=",
    color: "#f59e0b",
    icono: File,
    fuente: "PRISMA",
    formula:
      "Entregables completados en el mes/Entregables comprometidos para el mes x 100",
    nota: 'Tickets con la etiqueta "Diagrama de flujo", "Reglas de negocio" o "Prototipo".',
    apoyo: { etiqueta: "Tickets del período", valor: "—" },
    ruta: "procesos/cumplimiento-entregables",
    textoApoyo: (d) =>
      `${d.ticketsCompletados} completados de ${d.ticketsComprometidos} tickets`,
  },

  {
    id: "devolucion",
    nombre: "Devolución",
    resultado: null,
    estado: "sin_datos",
    meta: 20,
    unidad: "%",
    operador: "<=",
    color: "#1199dd",
    icono: Undo2,
    fuente: "PRISMA",
    formula: "Cantidad de devoluciones/ Total de entregables presentados x 100",
    nota: 'Entregables con la etiqueta "Devolución Documento". Ideal <= 15%, tolerable hasta 20%.',
    apoyo: { etiqueta: "Tickets del período", valor: "—" },
    ruta: "procesos/devolucion",
    textoApoyo: (d) =>
      `${d.ticketsDevueltos} devueltos de ${d.ticketsPresentados} presentados `,
  },

  {
    id: "mejoras-implementadas",
    nombre: "Mejoras Implementadas",
    resultado: null,
    estado: "sin_datos",
    meta: 70,
    unidad: "%",
    operador: ">=",
    color: "#dcf617",
    icono: ArrowUpRight,
    fuente: "PRISMA",
    formula: "Mejoras implementadas/ Mejoras entregadas x 100",
    nota: 'Tickets con la etiqueta "Entregado" e "Implementado".',
    apoyo: { etiqueta: "Acumulado del trimestre", valor: "—" },
    ruta: "procesos/mejoras-implementadas",
    textoApoyo: (d) =>
      `${d.ticketsImplementados} implementadas de ${d.ticketsEntregados} entregadas (${diaMes(d.desde)} – ${diaMes(d.hasta)})`,
  },
];
