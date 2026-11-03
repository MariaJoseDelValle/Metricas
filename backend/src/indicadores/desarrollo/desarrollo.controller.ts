import { DesarrolloService } from './desarrollo.service.js';
import { validarFiltros } from '../comun/filtros-kpi.js';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFiltrosKpi } from '../comun/api-filtros-kpi.decorator.js';

@ApiTags('Indicadores · Desarrollo')
@Controller('indicadores/desarrollo')
export class DesarrolloController {
  constructor(private readonly desarrolloService: DesarrolloService) {}

  @ApiOperation({
    summary: 'Satisfacción del cliente interno',
    description:
      'Promedio de las calificaciones de solución (1 a 5). Meta: ≥ 4,0.',
  })
  @ApiFiltrosKpi()
  @Get('satisfaccion')
  satisfaccion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.desarrolloService.satisfaccion(
      validarFiltros(desde, hasta, usuario),
    );
  }

  @ApiOperation({
    summary: 'Resolución de fallas',
    description:
      "Porcentaje de tickets con etiqueta 'Caso de soporte' sobre los tickets totales. Meta: < 15%.",
  })
  @ApiFiltrosKpi()
  @Get('resolucion-fallas')
  resolucionFallas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.desarrolloService.resolucionFallas(
      validarFiltros(desde, hasta, usuario),
    );
  }

  @ApiOperation({
    summary: 'Tiempo de resolución de soporte',
    description:
      "Promedio de días hábiles entre la creación y el cierre de los tickets 'Caso de soporte' cerrados en el período. Meta: ≤ 3 días.",
  })
  @ApiFiltrosKpi()
  @Get('tiempo-resolucion')
  tiempoResolucion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.desarrolloService.tiempoResolucion(
      validarFiltros(desde, hasta, usuario),
    );
  }

  @ApiOperation({
    summary: 'Todas las métricas de Desarrollo',
    description:
      'Devuelve en una sola respuesta las métricas del dashboard de Desarrollo.',
  })
  @ApiFiltrosKpi()
  @Get()
  todas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.desarrolloService.todas(validarFiltros(desde, hasta, usuario));
  }
}
