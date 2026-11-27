import { GUARDS_METADATA } from '@nestjs/common/constants';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { BaseDatosService } from '../base-datos/base-datos.service';
import { CoordinadoraGuard } from '../flota/coordinadora.guard';
import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';

const solicitud = {
  nombre: 'Camila Rojas',
  telefono: '3000000000',
  origen: 'Neiva',
  destino: 'Pitalito',
  fechaServicio: '2026-12-01',
  idVehiculo: 2,
};

function crear(rows: unknown[]) {
  const consultar = jest.fn().mockResolvedValue({ rows });
  return { servicio: new ViajesService({ consultar } as unknown as BaseDatosService), consultar };
}

describe('Reserva del vehiculo elegido', () => {
  it('reserva el vehiculo y guarda el viaje en una sola consulta', async () => {
    const { servicio, consultar } = crear([{ id_viaje: 5 }]);

    await expect(servicio.crear(solicitud)).resolves.toEqual({ idViaje: 5 });
    expect(consultar).toHaveBeenCalledTimes(1);
    expect(consultar.mock.calls[0][0]).toContain("estado = 'disponible'");
    expect(consultar.mock.calls[0][1][6]).toBe(2);
  });

  it('rechaza si otra persona ya reservo ese vehiculo', async () => {
    const { servicio } = crear([]);

    await expect(servicio.crear(solicitud)).rejects.toThrow(
      new ConflictException('Ese vehículo ya no está disponible'),
    );
  });

  it.each([0, -1, 1.5, '2'])('rechaza un vehiculo no valido: %j', async (idVehiculo) => {
    const { servicio, consultar } = crear([]);

    await expect(servicio.crear({ ...solicitud, idVehiculo })).rejects.toThrow(
      new BadRequestException('El vehículo no es válido'),
    );
    expect(consultar).not.toHaveBeenCalled();
  });

  it('cancela la solicitud y libera el vehiculo', async () => {
    const { servicio, consultar } = crear([{ id_viaje: 5 }]);

    await servicio.cancelar(5);

    expect(consultar.mock.calls[0][0]).toContain("estado = 'cancelado'");
    expect(consultar.mock.calls[0][0]).toContain("estado = 'disponible'");
    expect(consultar.mock.calls[0][1]).toEqual([5]);
  });

  it('avisa si la solicitud no existe o ya estaba cancelada', async () => {
    const { servicio } = crear([]);

    await expect(servicio.cancelar(99)).rejects.toThrow(new NotFoundException('La solicitud no existe'));
  });

  it('abuso: solo la coordinadora puede eliminar solicitudes', () => {
    expect(Reflect.getMetadata(GUARDS_METADATA, ViajesController.prototype.cancelar)).toEqual([CoordinadoraGuard]);
  });
});
