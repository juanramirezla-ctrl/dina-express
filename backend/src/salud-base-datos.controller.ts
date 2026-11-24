import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { BaseDatosService } from './base-datos/base-datos.service';

/** Comprueba que la API tenga conexión con la base de datos. */
@Controller('salud/base-datos')
export class SaludBaseDatosController {
  constructor(private readonly baseDatos: BaseDatosService) {}

  /**
   * @returns `{ baseDatos: 'ok' }` si la base contesta.
   * @throws ServiceUnavailableException si no hay conexión con la base de datos.
   */
  @Get()
  async estado(): Promise<{ baseDatos: string }> {
    try {
      await this.baseDatos.consultar('SELECT 1 AS ok');
      return { baseDatos: 'ok' };
    } catch {
      throw new ServiceUnavailableException('No hay conexión con la base de datos');
    }
  }
}