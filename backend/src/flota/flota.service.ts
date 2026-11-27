import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseDatosService } from '../base-datos/base-datos.service';
import { EstadoRecurso, listarVehiculosDisponibles } from './disponibilidad';

/** Tipos de vehículo según los servicios que ofrece la empresa. */
export const TIPOS: readonly string[] = [
  'camioneta',
  'microbus_buseta',
  'turbo',
  'carrotanque',
  'volqueta',
  'carga_pesada',
];

const PATRON_PLACA = /^[A-Z0-9]{5,7}$/;
/** Coincide con el VARCHAR(40) de marca y modelo. */
const LONGITUD_MAXIMA = 40;
/** Código de PostgreSQL para un valor repetido en una columna única. */
const VALOR_REPETIDO = '23505';

const COLUMNAS = 'id_vehiculo, placa, tipo, marca, modelo, estado, disponible_desde';
const SQL_DISPONIBLES = `SELECT ${COLUMNAS} FROM vehiculo WHERE tipo = $1`;
const SQL_TODOS = `SELECT ${COLUMNAS} FROM vehiculo ORDER BY tipo, placa`;
const SQL_REGISTRAR = 'INSERT INTO vehiculo (placa, tipo, marca, modelo) VALUES ($1, $2, $3, $4) RETURNING id_vehiculo';
/** La fecha de disponibilidad solo cambia cuando el vehículo vuelve a quedar libre (HU-05). */
const SQL_ESTADO = `
  UPDATE vehiculo
  SET estado = $1::varchar,
      disponible_desde = CASE WHEN $1::varchar = 'disponible' AND estado <> 'disponible'
                              THEN now() ELSE disponible_desde END
  WHERE id_vehiculo = $2
  RETURNING id_vehiculo
`;

export interface FilaVehiculo {
  id_vehiculo: number;
  placa: string;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  estado: EstadoRecurso;
  disponible_desde: Date;
}

/** Lo que ve el cliente de un vehículo disponible. */
export interface VehiculoPublico {
  id_vehiculo: number;
  placa: string;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
}

function comoObjeto(datos: unknown): Record<string, unknown> {
  if (typeof datos !== 'object' || datos === null) {
    throw new BadRequestException('Los datos del vehículo no son válidos');
  }
  return datos as Record<string, unknown>;
}

function texto(valor: unknown, campo: string): string {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new BadRequestException(`Falta el campo: ${campo}`);
  }
  if (valor.trim().length > LONGITUD_MAXIMA) {
    throw new BadRequestException(`El campo ${campo} supera ${LONGITUD_MAXIMA} caracteres`);
  }
  return valor.trim();
}

function tipoValido(valor: unknown): string {
  if (typeof valor !== 'string' || !TIPOS.includes(valor)) {
    throw new BadRequestException('El tipo de vehículo no es válido');
  }
  return valor;
}

/** Registro y disponibilidad de los vehículos (HU-03 y HU-05). */
@Injectable()
export class FlotaService {
  constructor(private readonly baseDatos: BaseDatosService) {}

  /**
   * @param tipo Tipo de vehículo que pide el cliente.
   * @returns Los disponibles de ese tipo, el que quedó libre más recientemente de primero.
   * @throws BadRequestException si el tipo no existe.
   */
  async disponibles(tipo: unknown): Promise<VehiculoPublico[]> {
    const { rows } = await this.baseDatos.consultar<FilaVehiculo>(SQL_DISPONIBLES, [tipoValido(tipo)]);
    const flota = rows.map((fila) => ({ ...fila, disponibleDesde: fila.disponible_desde }));
    return listarVehiculosDisponibles(flota).map((vehiculo) => {
      const { id_vehiculo, placa, tipo: clase, marca, modelo } = vehiculo as unknown as FilaVehiculo;
      return { id_vehiculo, placa, tipo: clase, marca, modelo };
    });
  }

  /** @returns Toda la flota, para el panel de la coordinadora. */
  async todos(): Promise<FilaVehiculo[]> {
    const { rows } = await this.baseDatos.consultar<FilaVehiculo>(SQL_TODOS);
    return rows;
  }

  /**
   * Registra un vehículo nuevo, que queda disponible.
   *
   * @throws BadRequestException si los datos no son válidos.
   * @throws ConflictException si la placa ya existe.
   */
  async registrar(datos: unknown): Promise<{ idVehiculo: number }> {
    const cuerpo = comoObjeto(datos);
    const placa = texto(cuerpo.placa, 'placa').toUpperCase();
    if (!PATRON_PLACA.test(placa)) {
      throw new BadRequestException('La placa no es válida');
    }
    const parametros = [placa, tipoValido(cuerpo.tipo), texto(cuerpo.marca, 'marca'), texto(cuerpo.modelo, 'modelo')];
    try {
      const { rows } = await this.baseDatos.consultar<{ id_vehiculo: number }>(SQL_REGISTRAR, parametros);
      return { idVehiculo: rows[0].id_vehiculo };
    } catch (error) {
      if ((error as { code?: string }).code === VALOR_REPETIDO) {
        throw new ConflictException('La placa ya existe');
      }
      throw error;
    }
  }

  /**
   * Marca un vehículo como disponible o en servicio.
   *
   * @throws BadRequestException si el estado no es válido.
   * @throws NotFoundException si el vehículo no existe.
   */
  async cambiarEstado(id: number, datos: unknown): Promise<void> {
    const { estado } = comoObjeto(datos);
    if (estado !== 'disponible' && estado !== 'en_servicio') {
      throw new BadRequestException('El estado no es válido');
    }
    const { rows } = await this.baseDatos.consultar(SQL_ESTADO, [estado, id]);
    if (rows.length === 0) {
      throw new NotFoundException('El vehículo no existe');
    }
  }
}
