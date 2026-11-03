import { Controller, Get, Query } from '@nestjs/common';
import { SistemasService } from './sistemas.service.js';
import { validarFiltros } from '../comun/filtros-kpi.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFiltrosKpi } from '../comun/api-filtros-kpi.decorator.js';

@ApiTags('Indicadores · Sistemas de Información')
@Controller('indicadores/sistemas')
export class SistemasController {
  constructor(private readonly sistemasService: SistemasService) {}

  @ApiOperation({
    summary: 'Atención de Soporte Funcional',
    description:
      'Contabilizar los requerimientos de soporte recibidos. Meta: ≥ 83.33%.',
  })
  @ApiFiltrosKpi()
  @Get('soporte-funcional')
  soporte(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.sistemasService.soporte(validarFiltros(desde, hasta, usuario));
  }

  @ApiOperation({
    summary: 'Disponibilidad de servicios críticos',
    description:
      'Medir el correcto funcionamiento por horas laborales. Meta: >= 95% .',
  })
  @ApiFiltrosKpi()
  @Get('disponibilidad')
  disponibilidad(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.sistemasService.disponibilidad(
      validarFiltros(desde, hasta, usuario),
    );
  }

  @ApiOperation({
    summary: 'Resolución Fallas críticas',
    description:
      "Mide el soporte brindado a los servicios críticos etiquetados como 'Proyecto ETL' e 'Integraciones' Meta <=100%",
  })
  @ApiFiltrosKpi()
  @Get('resolucion-fallas-criticas')
  resolucion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.sistemasService.fallascriticas(
      validarFiltros(desde, hasta, usuario),
    );
  }

  @ApiOperation({
    summary: 'Todas las métricas de Sistemas de Información',
    description:
      'Devuelve en una sola respuesta las métricas del dashboard de Sistemas de Información.',
  })
  @ApiFiltrosKpi()
  @Get()
  todas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.sistemasService.todas(validarFiltros(desde, hasta, usuario));
  }
}
