import { Bug, Smile, Clock } from "lucide-react";
import { Velocimetro } from "../GraficasComunes/Velocimetro.tsx";
import type { Kpi } from "../../Models/Kpi.ts";

export const kpisDesarrollo: Kpi[] = [
  {
    id: "tiempo-resolucion",
    nombre: "Tiempo de resolución de soporte",
    resultado: null,
    estado: "sin_datos",
    meta: 3,
    unidad: "días",
    operador: "<=",
    color: "#eee01d",
    icono: Clock,
    fuente: "PRISMA",
    maximo: 10,
    formula:
      "Promedio  de tiempo de resolucion entre Fecha creación y Fecha cierre",
    nota: 'Solo tickets "Caso de soporte" cerrados, filtrados por fecha de cierre',
    apoyo: { etiqueta: "Tickets cerrados", valor: "—" },

    textoApoyo: (d) => `${d.ticketsCerrados} tickets cerrados`,

    grafica: Velocimetro,
  },
  {
    id: "resolucion-fallas",
    nombre: "Resolución de fallas",
    resultado: null,
    estado: "sin_datos",
    meta: 15,
    unidad: "%",
    color: "#7c3aed",
    icono: Bug,
    fuente: "PRISMA",
    operador: "<",
    formula: 'Tickets "Caso de soporte" / Tickets totales × 100',
    nota: 'Tickets con la etiqueta "Caso de soporte" registrados en PRISMA.',
    apoyo: { etiqueta: "Tickets del período", valor: "—" },

    textoApoyo: (d) =>
      `${d.ticketsFallas} fallas de ${d.ticketsTotales} tickets`,
  },
  {
    id: "satisfaccion",
    nombre: "Satisfacción cliente interno",
    resultado: null,
    estado: "sin_datos",
    meta: 4,
    unidad: " / 5",
    operador: ">=",
    color: "#10b981",
    icono: Smile,
    fuente: "PRISMA",
    maximo: 5,

    formula: "Suma de calificaciones (1 a 5) / N.º de respuestas",
    nota: "Calificación de la Solución",
    apoyo: { etiqueta: "Muestra", valor: "—" }, // satisfacción

    textoApoyo: (d) => `${d.calificaciones} calificaciones`,
  },
];
