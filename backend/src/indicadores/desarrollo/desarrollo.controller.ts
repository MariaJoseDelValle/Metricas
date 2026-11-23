import { DesarrolloService } from './desarrollo.service.js';
import { validarFiltros } from '../comun/filtros-kpi.js';
import {
  BadGatewayException,
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ApiFiltrosKpi } from '../comun/api-filtros-kpi.decorator.js';
import { ETIQUETAS_PROYECTO_DESARROLLO } from './etiquetas-proyecto.js';

@ApiTags('Indicadores · Desarrollo')
@Controller('indicadores/desarrollo')
export class DesarrolloController {
  constructor(private readonly desarrolloService: DesarrolloService) {}

  @ApiOperation({
    summary: 'Todas las métricas de Desarrollo',
    description:
      'Devuelve en una sola respuesta las métricas del dashboard de Desarrollo.',
  })
  @ApiFiltrosKpi()
  @ApiQuery({
    name: 'etiqueta',
    required: false,
    type: Number,
    description: 'Id de la etiqueta de proyecto.',
  })
  @Get()
  todas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
    @Query('etiqueta') etiqueta?: string,
  ) {
    const idEtiqueta = etiqueta === undefined ? undefined : Number(etiqueta);
    if (
      idEtiqueta !== undefined &&
      !ETIQUETAS_PROYECTO_DESARROLLO.some((e) => e.id === idEtiqueta)
    ) {
      throw new BadRequestException('El parametro "etiqueta" no es válido');
    }

    return this.desarrolloService.todas({
      ...validarFiltros(desde, hasta, usuario),
      etiqueta: idEtiqueta,
    });
  }
}
