import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseDatosModule } from './base-datos/base-datos.module';
import { SaludBaseDatosController } from './salud-base-datos.controller';
import { SaludController } from './salud.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BaseDatosModule],
  controllers: [SaludController, SaludBaseDatosController],
})
export class AppModule {}