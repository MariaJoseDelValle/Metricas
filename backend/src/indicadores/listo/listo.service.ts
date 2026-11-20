import { Injectable } from '@nestjs/common';
import { TrimestreComun } from '../comun/periodo.js';
import { ListoRepository } from './listo.repository.js';
import type { FiltrosListo } from '../comun/filtros-kpi.js';

const META_GENERAL = 85;
const META_ANS = 85;
const SIN_RESOLUTOR = { correo: 'sin-resolutor', nombre: 'Sin resolutor' };
type CumplimientoANS = {
  cumplimiento: number;
  ticketsTotal: number;
  ticketsATiempo: number;
} | null;

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

  // Una sola consulta alimenta los KPIs de ANS 1–5 (suma de todas las filas,
  // sin filtro de estado) y la gráfica por persona (con filtro de estado).
  async ANS(filtros: FiltrosListo) {
    const filas = await this.repositorio.ANSPorPersona(filtros);

    const globales = [1, 2, 3, 4, 5].map(() => ({
      ticketsTotal: 0,
      ticketsATiempo: 0,
    }));
    const personas = new Map<
      string,
      { correo: string; nombre: string; ans: CumplimientoANS[] }
    >();

    for (const fila of filas) {
      const nivel = Number(fila.ans.replace('ANS', '').trim());

      globales[nivel - 1].ticketsTotal += fila.globalTotal;
      globales[nivel - 1].ticketsATiempo += fila.globalATiempo;

      if (fila.ticketsTotal === 0) continue;

      const correo = fila.correo ?? SIN_RESOLUTOR.correo;
      let persona = personas.get(correo);
      if (!persona) {
        persona = {
          correo,
          nombre: fila.nombre ?? SIN_RESOLUTOR.nombre,
          ans: [null, null, null, null, null],
        };
        personas.set(correo, persona);
      }

      persona.ans[nivel - 1] = {
        cumplimiento:
          Math.round((fila.ticketsATiempo / fila.ticketsTotal) * 10000) / 100,
        ticketsTotal: fila.ticketsTotal,
        ticketsATiempo: fila.ticketsATiempo,
      };
    }

    const kpisANS = globales.map((g, i) => {
      const nivel = i + 1;
      const resultado =
        g.ticketsTotal === 0 ? null : (g.ticketsATiempo / g.ticketsTotal) * 100;
      let estado: 'cumple' | 'no_cumple' | 'sin_datos' = 'sin_datos';
      if (resultado !== null) {
        estado = resultado >= META_ANS ? 'cumple' : 'no_cumple';
      }
      return {
        id: `cumplimiento-ANS${nivel}`,
        nombre: `Cumplimiento ANS ${nivel}`,
        resultado:
          resultado === null ? null : Math.round(resultado * 100) / 100,
        meta: META_ANS,
        operador: '>=',
        unidad: '%',
        estado,
        detalle: g,
      };
    });

    const lista = [...personas.values()];
    const porPersona = {
      id: 'ans-por-persona',
      nombre: 'Cumplimiento ANS por persona',
      resultado: lista.length === 0 ? null : lista.length,
      meta: META_ANS,
      operador: '>=' as const,
      unidad: '%',
      estado: 'sin_datos' as const,
      detalle: {},
      personas: lista,
    };

    return { kpisANS, porPersona };
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
    const [general, ans, abiertos, creados, usuarios] = await Promise.all([
      this.general(filtros),
      this.ANS(filtros),
      this.Abiertos(filtros),
      this.ConteoCreados(filtros),
      this.repositorio.usuarios(filtros),
    ]);
    const kpis = [
      general,
      ...ans.kpisANS,
      abiertos,
      creados,
      ans.porPersona,
    ];
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
