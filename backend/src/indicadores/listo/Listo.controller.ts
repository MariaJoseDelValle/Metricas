import { ListoService } from './listo.service.js';
import { ESTADOS_LISTO, validarFiltros } from '../comun/filtros-kpi.js';
import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFiltrosKpi } from '../comun/api-filtros-kpi.decorator.js';

@ApiTags('Indicadores · Listo')
@Controller('indicadores/listo')
export class ListoController {
  constructor(private readonly listoService: ListoService) {}

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
    @Query('estado') estado?: string,
  ) {
    if (estado !== undefined && !Object.hasOwn(ESTADOS_LISTO, estado)) {
      throw new BadRequestException('El parametro "estado" no es valido');
    }
    return this.listoService.todas({
      ...validarFiltros(desde, hasta),
      usuario,
      estado,
    });
  }
}
