import { Module } from '@nestjs/common';

import { ComunModule } from '../comun/comun.module.js';
import { BaseDatosModule } from '../../base-datos/base-datos.module.js';
import { ListoController } from './Listo.controller.js';
import { ListoService } from './listo.service.js';
import { ListoRepository } from './listo.repository.js';

@Module({
  imports: [ComunModule, BaseDatosModule],
  controllers: [ListoController],
  providers: [ListoService, ListoRepository],
})
export class ListoModule {}
