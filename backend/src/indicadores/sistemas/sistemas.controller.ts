import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SistemasService } from './sistemas.service.js';
import { validarFiltros } from '../comun/filtros-kpi.js';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiFiltrosKpi } from '../comun/api-filtros-kpi.decorator.js';

@ApiTags('Indicadores · Sistemas de Información')
@Controller('indicadores/sistemas')
export class SistemasController {
  constructor(private readonly sistemasService: SistemasService) {}

  @ApiOperation({
    summary: 'Todas las métricas de Sistemas de Información',
    description:
      'Devuelve en una sola respuesta las métricas del dashboard de Sistemas de Información.',
  })
  @ApiFiltrosKpi()
  @ApiQuery({
    name: 'etiqueta',
    required: false,
    type: Number,
    description: 'Id de una etiqueta del equipo de Sistemas.',
  })
  @Get()
  async todas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuario') usuario?: string,
    @Query('etiqueta') etiqueta?: string,
  ) {
    const idEtiqueta = etiqueta === undefined ? undefined : Number(etiqueta);
    if (idEtiqueta !== undefined) {
      const etiquetas = await this.sistemasService.etiquetas();
      if (!etiquetas.some((e) => e.id === idEtiqueta)) {
        throw new BadRequestException('El parametro "etiqueta" no es válido');
      }
    }

    return this.sistemasService.todas({
      ...validarFiltros(desde, hasta, usuario),
      etiqueta: idEtiqueta,
    });
  }
}
