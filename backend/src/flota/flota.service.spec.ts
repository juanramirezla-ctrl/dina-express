import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { BaseDatosService } from '../base-datos/base-datos.service';
import { FlotaService } from './flota.service';

const nuevo = { placa: 'abc123', tipo: 'camioneta', marca: 'Toyota', modelo: 'Hilux 2024' };

function crear(rows: unknown[] = []) {
  const consultar = jest.fn().mockResolvedValue({ rows });
  return { servicio: new FlotaService({ consultar } as unknown as BaseDatosService), consultar };
}

const fila = (placa: string, hora: number) => ({
  id_vehiculo: hora,
  placa,
  tipo: 'camioneta',
  marca: 'Nissan',
  modelo: 'Frontier',
  estado: 'disponible',
  disponible_desde: new Date(Date.UTC(2026, 10, 26, hora)),
});

describe('FlotaService (HU-03 y HU-05)', () => {
  it('registra el vehiculo con parametros y la placa en mayusculas', async () => {
    const { servicio, consultar } = crear([{ id_vehiculo: 9 }]);

    await expect(servicio.registrar(nuevo)).resolves.toEqual({ idVehiculo: 9 });
    expect(consultar.mock.calls[0][1]).toEqual(['ABC123', 'camioneta', 'Toyota', 'Hilux 2024']);
  });

  it('rechaza una placa repetida (HU-03, escenario 2)', async () => {
    const { servicio, consultar } = crear();
    consultar.mockRejectedValue({ code: '23505' });

    await expect(servicio.registrar(nuevo)).rejects.toThrow(new ConflictException('La placa ya existe'));
  });

  it.each([
    [{ ...nuevo, placa: "A'; DROP" }, 'La placa no es válida'],
    [{ ...nuevo, tipo: 'avion' }, 'El tipo de vehículo no es válido'],
    [{ ...nuevo, marca: ' ' }, 'Falta el campo: marca'],
    [{ ...nuevo, modelo: 'x'.repeat(41) }, 'El campo modelo supera 40 caracteres'],
    [null, 'Los datos del vehículo no son válidos'],
  ])('no consulta la base de datos con datos invalidos: %j', async (datos, mensaje) => {
    const { servicio, consultar } = crear();

    await expect(servicio.registrar(datos)).rejects.toThrow(new BadRequestException(mensaje));
    expect(consultar).not.toHaveBeenCalled();
  });

  it('lista los disponibles de un tipo, el mas reciente primero y sin datos internos', async () => {
    const { servicio, consultar } = crear([fila('AAA111', 8), fila('BBB222', 10)]);

    await expect(servicio.disponibles('camioneta')).resolves.toEqual([
      { placa: 'BBB222', tipo: 'camioneta', marca: 'Nissan', modelo: 'Frontier' },
      { placa: 'AAA111', tipo: 'camioneta', marca: 'Nissan', modelo: 'Frontier' },
    ]);
    expect(consultar.mock.calls[0][1]).toEqual(['camioneta']);
  });

  it('rechaza consultar un tipo desconocido', async () => {
    const { servicio } = crear();

    await expect(servicio.disponibles('avion')).rejects.toThrow('El tipo de vehículo no es válido');
  });

  it('cambia el estado de un vehiculo', async () => {
    const { servicio, consultar } = crear([{ id_vehiculo: 3 }]);

    await servicio.cambiarEstado(3, { estado: 'en_servicio' });

    expect(consultar.mock.calls[0][1]).toEqual(['en_servicio', 3]);
  });

  it('rechaza un estado desconocido y avisa si el vehiculo no existe', async () => {
    const { servicio } = crear([]);

    await expect(servicio.cambiarEstado(3, { estado: 'roto' })).rejects.toThrow('El estado no es válido');
    await expect(servicio.cambiarEstado(99, { estado: 'disponible' })).rejects.toThrow(NotFoundException);
  });
});
