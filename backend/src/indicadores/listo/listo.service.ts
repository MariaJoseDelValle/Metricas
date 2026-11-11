import { Injectable } from '@nestjs/common';
import { TrimestreComun } from '../comun/periodo.js';
import { ListoRepository } from './listo.repository.js';
import type { FiltrosListo } from '../comun/filtros-kpi.js';

const META_GENERAL = 85;
const META_ANS = 85;

@Injectable()
export class ListoService {
  constructor(private readonly repositorio: ListoRepository) {}

  async general(filtros: FiltrosListo) {
    const fila = await this.repositorio.general(filtros);
    const resultado =
      fila.ticketsTotal === 0
        ? null
        : (fila.ticketsATiempo / fila.ticketsTotal) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado >= META_GENERAL ? 'cumple' : 'no_cumple';
    }

    return {
      id: 'cumplimiento-general',
      nombre: ' Cumplimiento General',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_GENERAL,
      operador: '>=',
      unidad: '%',
      estado,
      detalle: {
        ticketsTotal: fila.ticketsTotal,
        ticketsATiempo: fila.ticketsATiempo,
      },
    };
  }

  async ANS(filtros: FiltrosListo, nivel: number) {
    const fila = await this.repositorio.ANS(filtros, nivel);
    const resultado =
      fila.ticketsTotal === 0
        ? null
        : (fila.ticketsATiempo / fila.ticketsTotal) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado >= META_ANS ? 'cumple' : 'no_cumple';
    }
    return {
      id: `cumplimiento-ANS${nivel}`,
      nombre: `Cumplimiento ANS ${nivel}`,
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_ANS,
      operador: '>=',
      unidad: '%',
      estado,
      detalle: {
        ticketsTotal: fila.ticketsTotal,
        ticketsATiempo: fila.ticketsATiempo,
      },
    };
  }
  async ConteoCreados(filtros: FiltrosListo) {
    const trimestre = TrimestreComun(filtros.hasta);
    const serie = await this.repositorio.ConteoCreados({
      ...filtros,
      ...trimestre,
    });
    const creados = serie.reduce((s, f) => s + f.creados, 0);
    const cerrados = serie.reduce((s, f) => s + f.cerrados, 0);

    return {
      id: 'creados-cerrados',
      nombre: 'Tickets creados vs cerrados Trimestral',
      resultado: creados === 0 && cerrados === 0 ? null : creados,
      meta: 0,
      operador: '>=',
      unidad: 'tickets',
      estado: 'sin_datos' as const,
      detalle: {
        creados,
        cerrados,
        desde: trimestre.desde,
        hasta: trimestre.hasta,
      },
      serie,
    };
  }

  async todas(filtros: FiltrosListo) {
    const [kpis, usuarios] = await Promise.all([
      Promise.all([
        this.general(filtros),
        this.ANS(filtros, 1),
        this.ANS(filtros, 2),
        this.ANS(filtros, 3),
        this.ANS(filtros, 4),
        this.ANS(filtros, 5),
        this.Abiertos(filtros),
        this.ConteoCreados(filtros),
      ]),
      this.repositorio.usuarios(filtros),
    ]);
    return { kpis, usuarios };
  }

  async Abiertos(filtros: FiltrosListo) {
    const fila = await this.repositorio.Abiertos(filtros);
    const total = fila.enAtencion + fila.fueraDeTiempo + fila.pausados;
    return {
      id: 'tickets-abiertos',
      nombre: 'Tickets abiertos',
      resultado: total === 0 ? null : total,
      meta: 0,
      operador: '>=',
      unidad: 'tickets',
      estado: 'sin_datos' as const,
      detalle: {
        enAtencion: fila.enAtencion,
        fueraDeTiempo: fila.fueraDeTiempo,
        pausados: fila.pausados,
      },
    };
  }
}
