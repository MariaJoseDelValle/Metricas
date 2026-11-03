import { isHoliday } from 'colombian-holidays/isHoliday';

// Se instala libreria para calular los festivos dee festivos sola.

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

export function inicioTrimestre(fecha: string): string {
  const [year, month] = fecha.split('-').map(Number);
  const primerMes = Math.floor((month - 1) / 3) * 3 + 1;
  return `${year}-${String(primerMes).padStart(2, '0')}-01`;
}
