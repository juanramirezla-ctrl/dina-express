import { Injectable } from '@nestjs/common';
import { BaseDatosService } from '../base-datos/base-datos.service';
import { validarSolicitud } from './validar-solicitud';

/** Crea el cliente y el viaje en una sola consulta, así que se guardan los dos o ninguno. */
const SQL_CREAR_VIAJE = `
  WITH nuevo_cliente AS (
    INSERT INTO cliente (tipo, nombre, telefono, email)
    VALUES ('persona_natural', $1, $2, $3)
    RETURNING id_cliente
  )
  INSERT INTO viaje (id_cliente, fecha_hora, origen, destino)
  SELECT id_cliente, $4::timestamptz, $5::text, $6::text FROM nuevo_cliente
  RETURNING id_viaje
`;

/** Reglas y acceso a datos de las solicitudes de viaje. */
@Injectable()
export class ViajesService {
  constructor(private readonly baseDatos: BaseDatosService) {}

  /**
   * Guarda la solicitud de viaje de una persona natural (HU-01).
   *
   * @param datos Cuerpo recibido en la petición.
   * @returns El id del viaje creado.
   * @throws BadRequestException si los datos no son válidos (no se consulta la base de datos).
   */
  async crear(datos: unknown): Promise<{ idViaje: number }> {
    const solicitud = validarSolicitud(datos);
    const resultado = await this.baseDatos.consultar<{ id_viaje: number }>(SQL_CREAR_VIAJE, [
      solicitud.nombre,
      solicitud.telefono,
      solicitud.email,
      solicitud.fechaServicio,
      solicitud.origen,
      solicitud.destino,
    ]);
    return { idViaje: resultado.rows[0].id_viaje };
  }
}