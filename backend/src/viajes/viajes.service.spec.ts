import { BadRequestException } from '@nestjs/common';
import { BaseDatosService } from '../base-datos/base-datos.service';
import { ViajesService } from './viajes.service';

const solicitudValida = {
  nombre: 'Camila Rojas',
  telefono: '3000000000',
  origen: 'Neiva',
  destino: 'Bogotá',
  fechaServicio: '2026-11-15',
};

function crearServicio(filas: Array<{ id_viaje: number }>) {
  const consultar = jest.fn().mockResolvedValue({ rows: filas });
  const servicio = new ViajesService({ consultar } as unknown as BaseDatosService);
  return { servicio, consultar };
}

describe('ViajesService.crear (HU-01)', () => {
  it('VIA-01 guarda la solicitud con parámetros y devuelve el id (escenario 1)', async () => {
    const { servicio, consultar } = crearServicio([{ id_viaje: 7 }]);

    await expect(servicio.crear(solicitudValida)).resolves.toEqual({ idViaje: 7 });

    expect(consultar).toHaveBeenCalledTimes(1);
    expect(consultar.mock.calls[0][1]).toEqual(['Camila Rojas', '3000000000', null, '2026-11-15', 'Neiva', 'Bogotá']);
  });

  it('VIA-02 no consulta la base de datos si falta el contacto (escenario 2)', async () => {
    const { servicio, consultar } = crearServicio([{ id_viaje: 7 }]);

    await expect(servicio.crear({ ...solicitudValida, telefono: undefined })).rejects.toThrow(
      new BadRequestException('Falta un dato de contacto: teléfono o correo'),
    );

    expect(consultar).not.toHaveBeenCalled();
  });

  it('VIA-03 abuso: un nombre con SQL viaja como parámetro y no dentro del texto de la consulta', async () => {
    const intento = "Robert'); DROP TABLE cliente;--";
    const { servicio, consultar } = crearServicio([{ id_viaje: 8 }]);

    await servicio.crear({ ...solicitudValida, nombre: intento });

    const [texto, parametros] = consultar.mock.calls[0];
    expect(texto).not.toContain('DROP TABLE');
    expect(parametros[0]).toBe(intento);
  });
});