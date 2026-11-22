import { Controller, Get } from '@nestjs/common';

/** Ruta de comprobación: indica que la API está viva. */
@Controller('salud')
export class SaludController {
  /**
   * @returns Un objeto con el estado de la API.
   */
  @Get()
  estado(): { estado: string } {
    return { estado: 'ok' };
  }
}