import { Headset, Server, Timer } from "lucide-react";
import type { Kpi } from "../../Models/Kpi.ts";
import { Velocimetro } from "../GraficasComunes/Velocimetro.tsx";

export const kpisSistemasInformacion: Kpi[] = [
  {
    id: "disponibilidad",
    nombre: "Disponibilidad de servicios criticos",
    resultado: null,
    estado: "sin_datos",
    meta: 95,
    unidad: "%",
    operador: ">=",
    color: "#10b981",
    icono: Server,
    fuente: "PRISMA",
    formula: "(Horas del mes − Horas de corrección) / Horas del mes × 100",
    nota: 'Horario laboral de 8,5 h por día. Horas de los tickets con etiqueta "corrección indisponibilidad".',
    apoyo: { etiqueta: "Horas de corrección", valor: "—" },
    ruta: "sistemas/disponibilidad",
    textoApoyo: (d) =>
      `${d.horasindisponibilidad ?? 0} h de corrección de ${d.horasfuncionamiento} h`,

    grafica: Velocimetro,
  },
  {
    id: "resolucion-fallas-criticas",
    nombre: "Tiempo de resolución de fallas críticas",
    resultado: null,
    estado: "sin_datos",
    meta: 100,
    unidad: "%",
    operador: "<=",
    color: "#7c3aed",
    icono: Timer,
    fuente: "PRISMA",
    formula:
      "# de horas para solucionar la falla/# de horas disponibles para fallas × 100",
    nota: ' Servicios críticos (ETL,Vtex):tickets con etiquetas "Proyectos ETL" e "Integraciones". 20 h disponibles por mes. ENTRE MÁS BAJO MEJOR',
    apoyo: { etiqueta: "Horas de solución", valor: "—" },
    ruta: "sistemas/resolucion-fallas-criticas",
    textoApoyo: (d) =>
      `${d.horasSolucion ?? 0} h de ${d.horasDisponibles} h disponibles`,

    grafica: Velocimetro,
  },
  {
    id: "soporte-funcional",
    nombre: "Atención de soporte funcional",
    resultado: null,
    estado: "sin_datos",
    meta: 83.33,
    unidad: "%",
    operador: ">=",
    color: "#0ea5e9",
    icono: Headset,
    fuente: "PRISMA",
    formula:
      "solicitudes de soporte a la operacion atendida/ solicitudes de soporte a la operacion recibidad x 100",
    nota: 'Tickets con etiqueta "Solicitud de soporte"',
    apoyo: { etiqueta: "Solicitudes del período", valor: "—" },
    ruta: "sistemas/soporte-funcional",
    textoApoyo: (d) => `${d.atendidos} atendidas de ${d.recibidos} recibidas`,

    grafica: Velocimetro,
  },
];
