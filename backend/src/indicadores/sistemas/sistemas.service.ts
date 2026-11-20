import { Injectable } from '@nestjs/common';

import { SistemasRepository } from './sistemas.repository.js';
import type { FiltrosKpi } from '../comun/filtros-kpi.js';
import {
  contarDiasLaborales,
  contarMeses,
  tendencia,
} from '../comun/periodo.js';

const META_FALLAS_CRITICAS = 100;
const HORAS_DISPONIBLE_MES = 20;
const META_SOPORTE = 83.33;
const META_DISPONIBILIDAD = 95;
const HORAS_JORNADA_LABORAL = 8.5;
@Injectable()
export class SistemasService {
  constructor(private readonly repositorio: SistemasRepository) {}

  async soporte(filtros: FiltrosKpi) {
    const fila = await this.repositorio.contarSolicitudesSoporte(filtros);
    const resultado =
      fila.recibidas === 0 ? null : (fila.atendidas / fila.recibidas) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado >= META_SOPORTE ? 'cumple' : 'no_cumple';
    }

    return {
      id: 'soporte-funcional',
      nombre: 'Atención de soporte funcional',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_SOPORTE,
      operador: '>=',
      unidad: '%',
      estado,
      detalle: { atendidos: fila.atendidas, recibidos: fila.recibidas },
    };
  }
  async disponibilidad(filtros: FiltrosKpi) {
    const fila =
      await this.repositorio.disponibilidadServicioscriticos(filtros);
    const dias = contarDiasLaborales(filtros.desde, filtros.hasta);
    const horasfuncionamiento = dias * HORAS_JORNADA_LABORAL;
    const resultado =
      horasfuncionamiento === 0
        ? null
        : Math.max(
            0,
            ((horasfuncionamiento - fila.horasindisponibilidad) /
              horasfuncionamiento) *
              100,
          );
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado >= META_DISPONIBILIDAD ? 'cumple' : 'no_cumple';
    }

    return {
      id: 'disponibilidad',
      nombre: 'Disponibilidad de servicios críticos',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_DISPONIBILIDAD,
      operador: '>=',
      unidad: '%',
      estado,
      detalle: {
        diasLaborales: dias,
        horasindisponibilidad: fila.horasindisponibilidad,
        horasfuncionamiento,
      },
    };
  }

  async fallascriticas(filtros: FiltrosKpi) {
    const fila = await this.repositorio.sumarHorasFallasCriticas(filtros);
    const meses = contarMeses(filtros.desde, filtros.hasta);
    const horasDisponibles = meses * HORAS_DISPONIBLE_MES;
    const resultado =
      horasDisponibles <= 0
        ? null
        : (fila.horasSolucion / horasDisponibles) * 100;
    let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
    if (resultado !== null) {
      estado = resultado <= META_FALLAS_CRITICAS ? 'cumple' : 'no_cumple';
    }

    return {
      id: 'resolucion-fallas-criticas',
      nombre: 'Tiempo de resolución de fallas críticas',
      resultado: resultado === null ? null : Math.round(resultado * 100) / 100,
      meta: META_FALLAS_CRITICAS,
      operador: '<=',
      unidad: '%',
      estado,
      detalle: {
        meses: Math.round(meses * 100) / 100,
        horasSolucion: fila.horasSolucion,
        horasDisponibles: Math.round(horasDisponibles * 100) / 100,
      },
    };
  }
  etiquetas() {
    return this.repositorio.etiquetas();
  }

  async todas(filtros: FiltrosKpi) {
    const [kpis, usuarios, etiquetas] = await Promise.all([
      Promise.all([
        tendencia(filtros, (f) => this.disponibilidad(f)),
        tendencia(filtros, (f) => this.fallascriticas(f)),
        tendencia(filtros, (f) => this.soporte(f)),
      ]),

      this.repositorio.usuarios(),
      this.repositorio.etiquetas(),
    ]);
    return { kpis, usuarios, etiquetas };
  }
}
