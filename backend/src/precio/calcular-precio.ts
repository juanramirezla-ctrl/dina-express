/**
 * Conceptos que componen el precio de un viaje.
 * Cada valor es un número entero de pesos colombianos, de 0 o más.
 */
export interface ConceptosPrecio {
  vehiculo: number;
  conductor: number;
  combustible: number;
  mantenimiento: number;
  gastosAdministrativos: number;
  ganancia: number;
}

type NombreConcepto = keyof ConceptosPrecio;

const NOMBRES_CONCEPTOS: readonly NombreConcepto[] = [
  'vehiculo',
  'conductor',
  'combustible',
  'mantenimiento',
  'gastosAdministrativos',
  'ganancia',
];

const MENSAJE_SIN_CONCEPTOS = 'Se necesitan los conceptos del precio';
const MENSAJE_PRECIO_EXCEDIDO = 'El precio total supera el máximo permitido';

const mensajeFalta = (nombre: string): string => `Falta el concepto: ${nombre}`;

const mensajeInvalido = (nombre: string): string =>
  `El concepto ${nombre} debe ser un número entero de 0 o más`;

/**
 * Indica si un valor es un número entero seguro de 0 o más.
 *
 * @param valor Valor a comprobar.
 * @returns `true` si es un entero seguro (hasta Number.MAX_SAFE_INTEGER) y no es negativo.
 */
function esEnteroSeguroNoNegativo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isSafeInteger(valor) && valor >= 0;
}

/**
 * Comprueba que se recibió un objeto con los conceptos del precio.
 *
 * @param conceptos Lo que recibió `calcularPrecio`.
 * @throws Error si no es un objeto (por ejemplo `undefined` o `null`).
 */
function validarConceptos(conceptos: unknown): void {
  if (typeof conceptos !== 'object' || conceptos === null) {
    throw new Error(MENSAJE_SIN_CONCEPTOS);
  }
}

/**
 * Comprueba que un concepto del precio exista y sea un entero válido.
 *
 * @param nombre Nombre del concepto, usado en el mensaje de error.
 * @param valor Valor recibido para ese concepto.
 * @throws Error si el concepto falta (`undefined` o `null`).
 * @throws Error si el valor no es un entero seguro de 0 o más.
 */
function validarConcepto(nombre: string, valor: unknown): void {
  if (valor === undefined || valor === null) {
    throw new Error(mensajeFalta(nombre));
  }
  if (!esEnteroSeguroNoNegativo(valor)) {
    throw new Error(mensajeInvalido(nombre));
  }
}

/**
 * Calcula el precio de un viaje sumando sus seis conceptos (HU-02).
 *
 * @param conceptos Los seis conceptos del precio, en pesos colombianos.
 * @returns El precio total en pesos.
 * @throws Error si no se reciben los conceptos.
 * @throws Error si falta algún concepto.
 * @throws Error si algún concepto no es un entero seguro de 0 o más.
 * @throws Error si el total supera el máximo entero seguro.
 *
 * @example
 * calcularPrecio({ vehiculo: 200000, conductor: 150000, combustible: 300000,
 *   mantenimiento: 50000, gastosAdministrativos: 100000, ganancia: 80000 }); // 880000
 */
export function calcularPrecio(conceptos: ConceptosPrecio): number {
  validarConceptos(conceptos);
  const total = NOMBRES_CONCEPTOS.reduce((suma, nombre) => {
    // eslint-disable-next-line security/detect-object-injection -- nombre sale de NOMBRES_CONCEPTOS, no del usuario
    const valor = conceptos[nombre];
    validarConcepto(nombre, valor);
    return suma + valor;
  }, 0);
  if (!Number.isSafeInteger(total)) {
    throw new Error(MENSAJE_PRECIO_EXCEDIDO);
  }
  return total;
}