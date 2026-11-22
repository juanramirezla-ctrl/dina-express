import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PUERTO_POR_DEFECTO = 3000;
const ORIGEN_FRONTEND_POR_DEFECTO = 'http://localhost:8100';

async function arrancar(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL ?? ORIGEN_FRONTEND_POR_DEFECTO });
  await app.listen(process.env.PORT ?? PUERTO_POR_DEFECTO);
}

void arrancar();