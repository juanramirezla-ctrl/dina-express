import { Module } from '@nestjs/common';
import { CoordinadoraGuard } from '../flota/coordinadora.guard';
import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';

@Module({
  controllers: [ViajesController],
  providers: [ViajesService, CoordinadoraGuard],
})
export class ViajesModule {}