import { Injectable } from '@nestjs/common';

import { inicioTrimestre } from '../comun/periodo.js';
import { ProcesosRepository } from '../procesos/procesos.repository.js';
import type { FiltrosKpi } from '../comun/filtros-kpi.js';

const META_DOCUMENTACION = 70;
const META_ENTREGABLES = 90;
const META_MEJORAS = 70;
const META_DEVOLUCION = 20;
@Injectable()
export class ProcesosService {
  constructor(private readonly repositorio: ProcesosRepository) {}
  async documentacion(filtros: FiltrosKpi) {
    const fila = await this.repositorio.contarDocumentacion(filtros);
    const resultado =
      fila.ticketsPlanificados === 0
        ? null
        : (fila.ticketsEstandarizados / fila.ticketsPlanificados) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado >= META_DOCUMENTACION ? 'cumple' : 'no_cumple';
    }
    return {
      id: 'documentacion-procesos',
      nombre: 'Documentación de Procesos',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_DOCUMENTACION,
      operador: '>=',
      unidad: '%',
      estado,
      detalle: { ...fila },
    };
  }

  async entregables(filtros: FiltrosKpi) {
    const fila = await this.repositorio.entregables(filtros);
    const resultado =
      fila.ticketsComprometidos === 0
        ? null
        : (fila.ticketsCompletados / fila.ticketsComprometidos) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado >= META_ENTREGABLES ? 'cumple' : 'no_cumple';
    }
    return {
      id: 'cumplimiento-entregables',
      nombre: 'Cumplimiento de Entregables',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_ENTREGABLES,
      operador: '>=',
      unidad: '%',
      estado,
      detalle: { ...fila },
    };
  }
  async mejoras(filtros: FiltrosKpi) {
    const trimestre = { ...filtros, desde: inicioTrimestre(filtros.hasta) };
    const fila = await this.repositorio.mejoras(trimestre);
    const resultado =
      fila.ticketsEntregados === 0
        ? null
        : (fila.ticketsImplementados / fila.ticketsEntregados) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado >= META_MEJORAS ? 'cumple' : 'no_cumple';
    }
    return {
      id: 'mejoras-implementadas',
      nombre: 'Mejoras Implementadas',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_MEJORAS,
      operador: '>=',
      unidad: '%',
      estado,
      detalle: { ...fila, desde: trimestre.desde, hasta: trimestre.hasta },
    };
  }
  async devolucion(filtros: FiltrosKpi) {
    const fila = await this.repositorio.devolucion(filtros);
    const resultado =
      fila.ticketsPresentados === 0
        ? null
        : (fila.ticketsDevueltos / fila.ticketsPresentados) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado <= META_DEVOLUCION ? 'cumple' : 'no_cumple';
    }
    return {
      id: 'devolucion',
      nombre: 'Devolución',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_DEVOLUCION,
      operador: '<=',
      unidad: '%',
      estado,
      detalle: { ...fila },
    };
  }

  async todas(filtros: FiltrosKpi) {
    const [kpis, usuarios] = await Promise.all([
      Promise.all([
        this.documentacion(filtros),
        this.entregables(filtros),
        this.mejoras(filtros),
        this.devolucion(filtros),
      ]),
      this.repositorio.usuarios(),
    ]);
    return { kpis, usuarios };
  }
}
