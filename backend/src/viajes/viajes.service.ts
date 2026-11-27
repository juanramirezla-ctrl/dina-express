import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

/**
 * Reserva el vehículo y crea el viaje en una sola consulta. Si el vehículo ya no está disponible,
 * no se guarda nada. PostgreSQL bloquea la fila, así que dos clientes no pueden reservar el mismo.
 */
const SQL_CREAR_CON_VEHICULO = `
  WITH reservado AS (
    UPDATE vehiculo SET estado = 'en_servicio'
    WHERE id_vehiculo = $7 AND estado = 'disponible'
    RETURNING id_vehiculo
  ), nuevo_cliente AS (
    INSERT INTO cliente (tipo, nombre, telefono, email)
    SELECT 'persona_natural', $1::varchar, $2::varchar, $3::varchar FROM reservado
    RETURNING id_cliente
  )
  INSERT INTO viaje (id_cliente, id_vehiculo, fecha_hora, origen, destino)
  SELECT c.id_cliente, r.id_vehiculo, $4::timestamptz, $5::text, $6::text FROM nuevo_cliente c, reservado r
  RETURNING id_viaje
`;

/** Marca la solicitud como cancelada (se conserva el historial) y libera su vehículo. */
const SQL_CANCELAR = `
  WITH cancelado AS (
    UPDATE viaje SET estado = 'cancelado'
    WHERE id_viaje = $1 AND estado <> 'cancelado'
    RETURNING id_viaje, id_vehiculo
  ), liberado AS (
    UPDATE vehiculo SET estado = 'disponible', disponible_desde = now()
    WHERE id_vehiculo IN (SELECT id_vehiculo FROM cancelado)
  )
  SELECT id_viaje FROM cancelado
`;

const SQL_LISTAR = `
  SELECT v.id_viaje, c.nombre, c.telefono, c.email, v.origen, v.destino,
         to_char(v.fecha_hora, 'YYYY-MM-DD') AS fecha_servicio, v.estado, ve.placa
  FROM viaje v
  JOIN cliente c ON c.id_cliente = v.id_cliente
  LEFT JOIN vehiculo ve ON ve.id_vehiculo = v.id_vehiculo
  WHERE v.estado <> 'cancelado'
  ORDER BY v.creado_en DESC
  LIMIT 50
`;

/** Una solicitud como la ve la coordinadora. */
export interface SolicitudRecibida {
  id_viaje: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  origen: string;
  destino: string;
  fecha_servicio: string;
  estado: string;
  placa: string | null;
}

/**
 * @returns El id del vehículo elegido, o null si la solicitud no trae vehículo.
 * @throws BadRequestException si no es un entero positivo.
 */
function vehiculoElegido(datos: unknown): number | null {
  const { idVehiculo } = datos as { idVehiculo?: unknown };
  if (idVehiculo === undefined || idVehiculo === null) {
    return null;
  }
  if (typeof idVehiculo !== 'number' || !Number.isSafeInteger(idVehiculo) || idVehiculo <= 0) {
    throw new BadRequestException('El vehículo no es válido');
  }
  return idVehiculo;
}

/** Reglas y acceso a datos de las solicitudes de viaje. */
@Injectable()
export class ViajesService {
  constructor(private readonly baseDatos: BaseDatosService) {}

  /** @returns Las últimas 50 solicitudes, la más reciente primero. */
  async listar(): Promise<SolicitudRecibida[]> {
    const { rows } = await this.baseDatos.consultar<SolicitudRecibida>(SQL_LISTAR);
    return rows;
  }

  /**
   * Guarda la solicitud de viaje de una persona natural (HU-01).
   *
   * @param datos Cuerpo recibido en la petición.
   * @returns El id del viaje creado.
   * @throws BadRequestException si los datos no son válidos (no se consulta la base de datos).
   */
  async crear(datos: unknown): Promise<{ idViaje: number }> {
    const solicitud = validarSolicitud(datos);
    const idVehiculo = vehiculoElegido(datos);
    const parametros: unknown[] = [
      solicitud.nombre,
      solicitud.telefono,
      solicitud.email,
      solicitud.fechaServicio,
      solicitud.origen,
      solicitud.destino,
    ];
    if (idVehiculo !== null) {
      parametros.push(idVehiculo);
    }
    const sql = idVehiculo === null ? SQL_CREAR_VIAJE : SQL_CREAR_CON_VEHICULO;
    const resultado = await this.baseDatos.consultar<{ id_viaje: number }>(sql, parametros);
    if (resultado.rows.length === 0) {
      throw new ConflictException('Ese vehículo ya no está disponible');
    }
    return { idViaje: resultado.rows[0].id_viaje };
  }

  /**
   * Cancela una solicitud y deja libre su vehículo.
   *
   * @throws NotFoundException si no existe o ya estaba cancelada.
   */
  async cancelar(idViaje: number): Promise<void> {
    const { rows } = await this.baseDatos.consultar(SQL_CANCELAR, [idViaje]);
    if (rows.length === 0) {
      throw new NotFoundException('La solicitud no existe');
    }
  }
}