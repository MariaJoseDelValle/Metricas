import { ListoService } from './listo.service.js';
import { validarFiltros } from '../comun/filtros-kpi.js';
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFiltrosKpi } from '../comun/api-filtros-kpi.decorator.js';

@ApiTags('Indicadores · Listo')
@Controller('indicadores/listo')
export class ListoController {
  constructor(private readonly listoService: ListoService) {}

  @ApiOperation({
    summary: 'Cumplimiento General',
    description:
      'Calculo del cumplimiento general del area de Listo. Meta: ≥ 85%.',
  })
  @ApiFiltrosKpi()
  @Get('general')
  general(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.listoService.general({
      ...validarFiltros(desde, hasta),
      usuario,
    });
  }
  @ApiOperation({
    summary: 'Cumplimiento por ANS',
    description: 'Calculo del cumplimiento por ANS. Meta: ≥ 85%.',
  })
  @ApiFiltrosKpi()
  @Get('ANS/:Nivel')
  ANS(
    @Query('nivel', ParseIntPipe) nivel: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.listoService.ANS(
      {
        ...validarFiltros(desde, hasta),
        usuario,
      },
      nivel,
    );
  }

  @ApiOperation({
    summary: 'En Atencion vs Fuera de Tiempo',
    description: 'Mostrar los tickets en estado: Atencion y Fuera de Tiempo',
  })
  @ApiFiltrosKpi()
  @Get('Abiertos')
  Abiertos(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.listoService.Abiertos({
      ...validarFiltros(desde, hasta),
      usuario,
    });
  }

  @ApiOperation({
    summary: 'Todas las métricas de Listo',
    description:
      'Devuelve en una sola respuesta las métricas del dashboard de Listo.',
  })
  @ApiFiltrosKpi()
  @Get()
  todas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
  ) {
    return this.listoService.todas({
      ...validarFiltros(desde, hasta),
      usuario,
    });
  }
}
