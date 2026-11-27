import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FlotaModule } from './flota/flota.module';
import { BaseDatosModule } from './base-datos/base-datos.module';
import { SaludBaseDatosController } from './salud-base-datos.controller';
import { SaludController } from './salud.controller';
import { ViajesModule } from './viajes/viajes.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BaseDatosModule, ViajesModule, FlotaModule],
  controllers: [SaludController, SaludBaseDatosController],
})
export class AppModule {}