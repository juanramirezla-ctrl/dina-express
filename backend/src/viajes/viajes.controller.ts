import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CoordinadoraGuard } from '../flota/coordinadora.guard';
import { SolicitudRecibida, ViajesService } from './viajes.service';

/** Rutas de los viajes. */
@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajes: ViajesService) {}

  /** Solicitudes con datos de contacto: solo para la coordinadora. */
  @Get()
  @UseGuards(CoordinadoraGuard)
  listar(): Promise<SolicitudRecibida[]> {
    return this.viajes.listar();
  }

  /**
   * Recibe la solicitud de viaje de una persona natural (HU-01).
   *
   * @param cuerpo Datos enviados en la petición.
   * @returns El mensaje «Solicitud recibida» y el id del viaje (código 201).
   * @throws BadRequestException (400) si los datos no son válidos.
   */
  @Post()
  async crear(@Body() cuerpo: unknown): Promise<{ mensaje: string; idViaje: number }> {
    const { idViaje } = await this.viajes.crear(cuerpo);
    return { mensaje: 'Solicitud recibida', idViaje };
  }
}