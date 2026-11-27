import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CoordinadoraGuard } from './coordinadora.guard';
import { FilaVehiculo, FlotaService, VehiculoPublico } from './flota.service';

/** Rutas de los vehículos. Solo la consulta de disponibles es pública. */
@Controller('vehiculos')
export class FlotaController {
  constructor(private readonly flota: FlotaService) {}

  @Get('disponibles')
  disponibles(@Query('tipo') tipo: unknown): Promise<VehiculoPublico[]> {
    return this.flota.disponibles(tipo);
  }

  @Get()
  @UseGuards(CoordinadoraGuard)
  todos(): Promise<FilaVehiculo[]> {
    return this.flota.todos();
  }

  @Post()
  @UseGuards(CoordinadoraGuard)
  registrar(@Body() cuerpo: unknown): Promise<{ idVehiculo: number }> {
    return this.flota.registrar(cuerpo);
  }

  @Patch(':id/estado')
  @UseGuards(CoordinadoraGuard)
  async cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() cuerpo: unknown): Promise<{ mensaje: string }> {
    await this.flota.cambiarEstado(id, cuerpo);
    return { mensaje: 'Estado actualizado' };
  }
}
