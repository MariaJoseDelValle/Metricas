import { Controller, Get, Query } from '@nestjs/common';
import { ProcesosService } from './procesos.service.js';
import { validarFiltros } from '../comun/filtros-kpi.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFiltrosKpi } from '../comun/api-filtros-kpi.decorator.js';

@ApiTags('Indicadores · Procesos ')
@Controller('indicadores/procesos')
export class ProcesosController {
  constructor(private readonly procesosService: ProcesosService) {}
  @ApiOperation({
    summary: 'Documentación de Procesos',
    description: 'Promedio de tickets planificados y estandarizados',
  })
  @ApiFiltrosKpi()
  @Get('documentacion')
  documentacion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.procesosService.documentacion(
      validarFiltros(desde, hasta, usuario),
    );
  }
  @ApiOperation({
    summary: 'Cumplimiento de entregables',
    description: 'Cumplimiento de la planificación de trabajo comprometido',
  })
  @ApiFiltrosKpi()
  @Get('entregables')
  entregables(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.procesosService.entregables(
      validarFiltros(desde, hasta, usuario),
    );
  }
  @ApiOperation({
    summary: 'Mejoras Implementadas %',
    description:
      'Medir la efectividad del área para lograr que las mejoras propuestas se concreten',
  })
  @ApiFiltrosKpi()
  @Get('mejoras')
  mejoras(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.procesosService.mejoras(validarFiltros(desde, hasta, usuario));
  }

  @ApiOperation({
    summary: 'Devolución',
    description: 'Medir cuantos entregables requieren mas de una iteración',
  })
  @ApiFiltrosKpi()
  @Get('devolucion')
  devolucion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.procesosService.devolucion(
      validarFiltros(desde, hasta, usuario),
    );
  }
  @ApiOperation({
    summary: 'Todas las métricas de Procesos',
    description:
      'Devuelve en una sola respuestas las métricas del dashboard de Procesos',
  })
  @ApiFiltrosKpi()
  @Get()
  todas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.procesosService.todas(validarFiltros(desde, hasta, usuario));
  }
}
