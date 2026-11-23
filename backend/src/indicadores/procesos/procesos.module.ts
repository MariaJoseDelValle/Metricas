import { Module } from '@nestjs/common';

import { ComunModule } from '../comun/comun.module.js';
import { BaseDatosModule } from '../../base-datos/base-datos.module.js';
import { ProcesosController } from './procesos.controller.js';
import { ProcesosService } from './procesos.service.js';
import { ProcesosRepository } from './procesos.repository.js';

@Module({
  imports: [ComunModule, BaseDatosModule],
  controllers: [ProcesosController],
  providers: [ProcesosService, ProcesosRepository],
})
export class ProcesosModule {}
