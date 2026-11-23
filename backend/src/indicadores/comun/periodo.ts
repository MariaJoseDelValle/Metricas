import { isHoliday } from 'colombian-holidays/isHoliday';
import type { FiltrosKpi } from './filtros-kpi.js';

// Se instala libreria para calular los festivos

export function contarDiasLaborales(desde: string, hasta: string): number {
  const [yearDesde, monthDesde, dayDesde] = desde.split('-').map(Number);
  const [yearHasta, monthHasta, dayHasta] = hasta.split('-').map(Number);

  const dia = new Date(yearDesde, monthDesde - 1, dayDesde);
  const fin = new Date(yearHasta, monthHasta - 1, dayHasta);

  let total = 0;
  while (dia <= fin) {
    const diaSemana = dia.getDay();
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

    if (!esFinDeSemana && !isHoliday(dia)) total++;

    dia.setDate(dia.getDate() + 1);
  }

  return total;
}

export function contarMeses(desde: string, hasta: string): number {
  const [yearDesde, monthDesde, dayDesde] = desde.split('-').map(Number);
  const [yearHasta, monthHasta, dayHasta] = hasta.split('-').map(Number);

  let total = 0;
  let year = yearDesde;
  let month = monthDesde;

  while (year < yearHasta || (year === yearHasta && month <= monthHasta)) {
    const diasDelMes = new Date(year, month, 0).getDate();

    const primerDia = year === yearDesde && month === monthDesde ? dayDesde : 1;
    const ultimoDia =
      year === yearHasta && month === monthHasta ? dayHasta : diasDelMes;
    total += (ultimoDia - primerDia + 1) / diasDelMes;

    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return total;
}
function fraccionDelDia(hora: string): number {
  const [h, m, s] = hora.split(':').map(Number);
  return (h * 3600 + m * 60 + s) / 86400;
}
function esDiaHabil(fecha: string): boolean {
  return contarDiasLaborales(fecha, fecha) === 1;
}

export function diasHabilesEntre(creado: string, cerrado: string): number {
  const [fechaCreado, horaCreado] = creado.split('T');
  const [fechaCerrado, horaCerrado] = cerrado.split('T');

  let total = contarDiasLaborales(fechaCreado, fechaCerrado);

  if (esDiaHabil(fechaCreado)) total -= fraccionDelDia(horaCreado);
  if (esDiaHabil(fechaCerrado)) total -= 1 - fraccionDelDia(horaCerrado);

  return total;
}

export type Trimestre = {
  desde: string;
  hasta: string;
};

export function TrimestreComun(hasta: string): Trimestre {
  const [year, month] = hasta.split('-').map(Number);
  const primerMes = new Date(year, month - 3, 1);
  const desde = `${primerMes.getFullYear()}-${String(primerMes.getMonth() + 1).padStart(2, '0')}-01`;
  return { desde, hasta };
}
export async function tendencia<T extends { resultado: number | null }>(
  filtros: FiltrosKpi,
  calcular: (f: FiltrosKpi) => Promise<T>,
) {
  const aTexto = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const trimestre = TrimestreComun(filtros.hasta);
  const [year, month] = trimestre.desde.split('-').map(Number);

  const meses: Trimestre[] = [];
  for (let i = 0; i < 3; i++) {
    const inicio = new Date(year, month - 1 + i, 1);
    const fin = new Date(year, month + i, 0);
    meses.push({
      desde: aTexto(inicio),
      hasta: i === 2 ? filtros.hasta : aTexto(fin),
    });
  }

  const [kpi, ...resultados] = await Promise.all([
    calcular(filtros),
    ...meses.map((m) =>
      calcular({ ...filtros, desde: m.desde, hasta: m.hasta }),
    ),
  ]);

  return {
    ...kpi,
    tendencia: meses.map((m, i) => ({
      mes: m.desde,
      valor: resultados[i].resultado,
    })),
  };
}
