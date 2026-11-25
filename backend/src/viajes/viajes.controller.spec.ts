import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';

describe('ViajesController', () => {
  it('VIA-04 responde «Solicitud recibida» con el id del viaje', async () => {
    const servicioFalso = { crear: jest.fn().mockResolvedValue({ idViaje: 7 }) };
    const controlador = new ViajesController(servicioFalso as unknown as ViajesService);

    await expect(controlador.crear({ nombre: 'Camila Rojas' })).resolves.toEqual({
      mensaje: 'Solicitud recibida',
      idViaje: 7,
    });
    expect(servicioFalso.crear).toHaveBeenCalledWith({ nombre: 'Camila Rojas' });
  });
});