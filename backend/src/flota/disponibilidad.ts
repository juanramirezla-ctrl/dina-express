/** Estados en los que puede estar un vehículo o un conductor. */
export type EstadoRecurso = 'disponible' | 'en_servicio';

/** Vehículo de la flota. `disponibleDesde` es cuándo quedó libre por última vez. */
export interface Vehiculo {
  placa: string;
  estado: EstadoRecurso;
  disponibleDesde: Date;
}

/** Conductor de la empresa. */
export interface Conductor {
  nombre: string;
  estado: EstadoRecurso;
}

/** Resultado de evaluar si un conductor y un vehículo se pueden asignar a un servicio. */
export type ResultadoAsignacion = { asignable: true } | { asignable: false; motivo: string };

const ESTADOS_VALIDOS: readonly string[] = ['disponible', 'en_servicio'];

const MOTIVO_CONDUCTOR = 'El conductor no está disponible';
const MOTIVO_VEHICULO = 'El vehículo no está disponible';
const MOTIVO_AMBOS = 'El conductor y el vehículo no están disponibles';
const MENSAJE_ESTADO_INVALIDO = 'El estado no es válido';
const MENSAJE_FECHA_INVALIDA = 'La fecha de disponibilidad no es válida';

/**
 * Comprueba que un estado sea `disponible` o `en_servicio`.
 *
 * @param estado Estado a comprobar.
 * @throws Error si el estado no es uno de los dos permitidos.
 */
function validarEstado(estado: string): void {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new Error(MENSAJE_ESTADO_INVALIDO);
  }
}

/**
 * Comprueba que un vehículo tenga un estado y una fecha de disponibilidad válidos.
 *
 * @param vehiculo Vehículo a comprobar.
 * @throws Error si el estado no es válido.
 * @throws Error si `disponibleDesde` no es una fecha válida.
 */
function validarVehiculo(vehiculo: Vehiculo): void {
  validarEstado(vehiculo.estado);
  if (!(vehiculo.disponibleDesde instanceof Date) || Number.isNaN(vehiculo.disponibleDesde.getTime())) {
    throw new Error(MENSAJE_FECHA_INVALIDA);
  }
}

/**
 * Lista los vehículos disponibles para un servicio (HU-03 y HU-05).
 * Solo incluye los que están `disponible`; el que quedó libre más recientemente va de primero.
 * Si dos vehículos quedaron libres en el mismo instante, se conserva el orden en que llegaron.
 * No modifica la lista recibida.
 *
 * @param vehiculos Todos los vehículos de la flota.
 * @returns Una lista nueva con los vehículos disponibles, del más reciente al más antiguo.
 * @throws Error si algún vehículo tiene un estado o una fecha de disponibilidad no válidos.
 */
export function listarVehiculosDisponibles(vehiculos: readonly Vehiculo[]): Vehiculo[] {
  vehiculos.forEach(validarVehiculo);
  return vehiculos
    .filter((vehiculo) => vehiculo.estado === 'disponible')
    .sort((a, b) => b.disponibleDesde.getTime() - a.disponibleDesde.getTime());
}

/**
 * Evalúa si un servicio se puede asignar a un conductor y un vehículo (HU-04).
 * Solo se puede si los dos están `disponible`. Si no, indica quién falla.
 *
 * @param conductor Conductor que se quiere asignar.
 * @param vehiculo Vehículo que se quiere asignar.
 * @returns `{ asignable: true }`, o `{ asignable: false, motivo }` con el motivo exacto.
 * @throws Error si el estado del conductor o del vehículo no es válido.
 */
export function evaluarAsignacion(conductor: Conductor, vehiculo: Vehiculo): ResultadoAsignacion {
  validarEstado(conductor.estado);
  validarEstado(vehiculo.estado);
  const conductorLibre = conductor.estado === 'disponible';
  const vehiculoLibre = vehiculo.estado === 'disponible';
  if (conductorLibre && vehiculoLibre) {
    return { asignable: true };
  }
  if (!conductorLibre && !vehiculoLibre) {
    return { asignable: false, motivo: MOTIVO_AMBOS };
  }
  return { asignable: false, motivo: conductorLibre ? MOTIVO_VEHICULO : MOTIVO_CONDUCTOR };
}