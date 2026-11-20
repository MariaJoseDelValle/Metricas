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
