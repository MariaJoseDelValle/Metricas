import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { DesarrolloModule } from './indicadores/desarrollo/desarrollo.module.js';
import { SistemasModule } from './indicadores/sistemas/sistemas.module.js';
import { ProcesosModule } from './indicadores/procesos/procesos.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DesarrolloModule,
    SistemasModule,
    ProcesosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
