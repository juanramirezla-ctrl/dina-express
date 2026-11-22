/** Tipos de cliente que reconoce el sistema. */
export type TipoCliente = 'persona_natural' | 'empresa';

/** Resultado de dividir el precio de un viaje en anticipo y saldo. */
export interface PagoDividido {
  anticipo: number;
  saldo: number;
}

const TIPOS_CLIENTE: readonly string[] = ['persona_natural', 'empresa'];

const MENSAJE_PRECIO_INVALIDO = 'El precio debe ser un número entero de 0 o más';
const MENSAJE_MONTO_INVALIDO = 'El monto pagado debe ser un número entero de 0 o más';
const MENSAJE_TIPO_INVALIDO = 'El tipo de cliente no es válido';
const MENSAJE_NO_CANCELADO = 'El servicio no está cancelado';
const MENSAJE_SIN_DINERO = 'No hay dinero para devolver';

/**
 * Indica si un valor es un número entero seguro de 0 o más.
 *
 * @param valor Valor a comprobar.
 * @returns `true` si es un entero seguro y no es negativo.
 */
function esEnteroSeguroNoNegativo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isSafeInteger(valor) && valor >= 0;
}

/**
 * Divide el precio de un viaje de una persona natural en anticipo y saldo (HU-06 y HU-07).
 * El anticipo es la mitad del precio redondeada hacia abajo y el saldo es el resto,
 * así que anticipo + saldo siempre es igual al precio.
 *
 * @param precio Precio total del viaje, en pesos (entero de 0 o más).
 * @returns El anticipo y el saldo, en pesos.
 * @throws Error si el precio no es un entero seguro de 0 o más.
 */
export function calcularAnticipoYSaldo(precio: number): PagoDividido {
  if (!esEnteroSeguroNoNegativo(precio)) {
    throw new Error(MENSAJE_PRECIO_INVALIDO);
  }
  const anticipo = Math.floor(precio / 2);
  return { anticipo, saldo: precio - anticipo };
}

/**
 * Calcula cuánto dinero se reembolsa cuando se cancela un servicio (HU-08).
 * Una empresa no recibe reembolso. Una persona natural recibe todo lo que pagó,
 * siempre que el servicio esté cancelado y haya pagado algo.
 *
 * @param tipoCliente `persona_natural` o `empresa`.
 * @param montoPagado Lo pagado hasta ahora, en pesos (entero de 0 o más).
 * @param servicioCancelado Si el servicio ya fue cancelado.
 * @returns El valor a reembolsar, en pesos (0 para una empresa).
 * @throws Error si el tipo de cliente no es válido.
 * @throws Error si el monto pagado no es un entero seguro de 0 o más.
 * @throws Error si es una persona natural y el servicio no está cancelado.
 * @throws Error si es una persona natural y no ha pagado nada.
 */
export function calcularReembolso(
  tipoCliente: TipoCliente,
  montoPagado: number,
  servicioCancelado: boolean,
): number {
  if (!TIPOS_CLIENTE.includes(tipoCliente)) {
    throw new Error(MENSAJE_TIPO_INVALIDO);
  }
  if (!esEnteroSeguroNoNegativo(montoPagado)) {
    throw new Error(MENSAJE_MONTO_INVALIDO);
  }
  if (tipoCliente === 'empresa') {
    return 0;
  }
  if (!servicioCancelado) {
    throw new Error(MENSAJE_NO_CANCELADO);
  }
  if (montoPagado === 0) {
    throw new Error(MENSAJE_SIN_DINERO);
  }
  return montoPagado;
}