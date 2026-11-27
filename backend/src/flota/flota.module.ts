import { Module } from '@nestjs/common';
import { CoordinadoraGuard } from './coordinadora.guard';
import { FlotaController } from './flota.controller';
import { FlotaService } from './flota.service';

@Module({
  controllers: [FlotaController],
  providers: [FlotaService, CoordinadoraGuard],
})
export class FlotaModule {}
