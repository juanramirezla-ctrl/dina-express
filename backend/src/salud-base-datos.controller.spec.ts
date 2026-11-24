import { ServiceUnavailableException } from '@nestjs/common';
import { BaseDatosService } from './base-datos/base-datos.service';
import { SaludBaseDatosController } from './salud-base-datos.controller';

describe('SaludBaseDatosController', () => {
  it('responde ok cuando la base de datos contesta', async () => {
    const servicioFalso = { consultar: jest.fn().mockResolvedValue({ rows: [{ ok: 1 }] }) };
    const controlador = new SaludBaseDatosController(servicioFalso as unknown as BaseDatosService);

    await expect(controlador.estado()).resolves.toEqual({ baseDatos: 'ok' });
    expect(servicioFalso.consultar).toHaveBeenCalledWith('SELECT 1 AS ok');
  });

  it('lanza un error 503 si la base de datos falla', async () => {
    const servicioFalso = { consultar: jest.fn().mockRejectedValue(new Error('sin conexion')) };
    const controlador = new SaludBaseDatosController(servicioFalso as unknown as BaseDatosService);

    await expect(controlador.estado()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});