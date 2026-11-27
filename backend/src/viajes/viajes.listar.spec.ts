import { GUARDS_METADATA } from '@nestjs/common/constants';
import { BaseDatosService } from '../base-datos/base-datos.service';
import { CoordinadoraGuard } from '../flota/coordinadora.guard';
import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';

describe('Solicitudes para la coordinadora', () => {
  it('lista las solicitudes con los datos de contacto', async () => {
    const filas = [{ id_viaje: 1, nombre: 'Camila Rojas', telefono: '3000000000' }];
    const consultar = jest.fn().mockResolvedValue({ rows: filas });
    const servicio = new ViajesService({ consultar } as unknown as BaseDatosService);

    await expect(servicio.listar()).resolves.toEqual(filas);
    expect(consultar.mock.calls[0][0]).toContain('JOIN cliente');
  });

  it('abuso: la lista tiene datos personales y exige la clave de la coordinadora', () => {
    const guardias = Reflect.getMetadata(GUARDS_METADATA, ViajesController.prototype.listar);

    expect(guardias).toEqual([CoordinadoraGuard]);
  });

  it('enviar una solicitud sigue siendo publico', () => {
    expect(Reflect.getMetadata(GUARDS_METADATA, ViajesController.prototype.crear)).toBeUndefined();
  });
});
