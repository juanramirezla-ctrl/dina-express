import { calcularAnticipoYSaldo, calcularReembolso, PagoDividido, TipoCliente } from '../src/pagos/calcular-pagos';

// Los resultados esperados salen de la regla: anticipo del 50 % y el otro 50 % al terminar (HU-06 y HU-07).
const casosAnticipo: Array<[string, number, PagoDividido]> = [
  // ANT-01: partición válida, precio par (ejemplo de HU-06)
  ['ANT-01 precio par, ejemplo de HU-06', 880000, { anticipo: 440000, saldo: 440000 }],
  // ANT-02: partición válida, precio impar; el esperado sale de la decisión provisional (redondeo hacia abajo)
  ['ANT-02 precio impar (decisión provisional)', 100001, { anticipo: 50000, saldo: 50001 }],
  // ANT-03: límite inferior, el último valor válido
  ['ANT-03 precio 0', 0, { anticipo: 0, saldo: 0 }],
  // ANT-04: primer valor positivo
  ['ANT-04 precio 1', 1, { anticipo: 0, saldo: 1 }],
  // ANT-05: límite superior, el máximo entero seguro
  ['ANT-05 máximo entero seguro', Number.MAX_SAFE_INTEGER, { anticipo: 4503599627370495, saldo: 4503599627370496 }],
];

describe('calcularAnticipoYSaldo (registro_pruebas.md, regla 2)', () => {
  it.each(casosAnticipo)('%s', (_descripcion, precio, esperado) => {
    expect(calcularAnticipoYSaldo(precio)).toEqual(esperado);
  });

  const preciosInvalidos: Array<[string, number]> = [
    // ANT-06: límite, -1 es el primer valor inválido
    ['ANT-06 precio -1', -1],
    // ANT-07: partición inválida, decimal
    ['ANT-07 decimal', 10.5],
    // ANT-08: partición inválida, no es número
    ['ANT-08 NaN', NaN],
    ['ANT-08 texto', '880000' as unknown as number],
    // ANT-09: límite superior, un peso más que el máximo entero seguro
    ['ANT-09 mayor que el máximo entero seguro', Number.MAX_SAFE_INTEGER + 1],
  ];

  it.each(preciosInvalidos)('%s', (_descripcion, precio) => {
    expect(() => calcularAnticipoYSaldo(precio)).toThrow(new Error('El precio debe ser un número entero de 0 o más'));
  });

  // ANT-10: el anticipo y el saldo siempre suman el precio (el otro 50 % de la regla)
  it.each([0, 1, 2, 99, 100001, 880000])('ANT-10 anticipo + saldo = precio (%s)', (precio) => {
    const { anticipo, saldo } = calcularAnticipoYSaldo(precio);
    expect(anticipo + saldo).toBe(precio);
  });
});

// Tabla de decisión de HU-08: empresa no recibe nada; persona natural recibe lo pagado si canceló y pagó algo.
const reembolsosValidos: Array<[string, TipoCliente, number, boolean, number]> = [
  // REE-01: natural, cancelado, pagó algo
  ['REE-01 natural, cancelado, pagó algo', 'persona_natural', 440000, true, 440000],
  // REE-05 a REE-08: empresa, no importa si canceló ni si pagó
  ['REE-05 empresa, cancelado, pagó algo', 'empresa', 440000, true, 0],
  ['REE-08 empresa, no cancelado, no pagó', 'empresa', 0, false, 0],
  // REE-09: límite, pagó 1 es el primer valor positivo
  ['REE-09 natural, cancelado, pagó 1', 'persona_natural', 1, true, 1],
];

const reembolsosConError: Array<[string, TipoCliente, number, boolean, string]> = [
  // REE-02: natural, cancelado, no pagó (HU-08, escenario 2)
  ['REE-02 natural, cancelado, no pagó', 'persona_natural', 0, true, 'No hay dinero para devolver'],
  // REE-03: natural, no cancelado, pagó algo
  ['REE-03 natural, no cancelado, pagó algo', 'persona_natural', 440000, false, 'El servicio no está cancelado'],
  // REE-04: natural, no cancelado, no pagó; el esperado sale de la decisión provisional (primero se revisa la cancelación)
  ['REE-04 natural, no cancelado, no pagó (decisión provisional)', 'persona_natural', 0, false, 'El servicio no está cancelado'],
  // REE-10: partición inválida, tipo de cliente desconocido
  ['REE-10 tipo de cliente desconocido', 'otro' as unknown as TipoCliente, 440000, true, 'El tipo de cliente no es válido'],
  // REE-11: límite, -1 es el primer monto inválido
  ['REE-11 monto -1', 'persona_natural', -1, true, 'El monto pagado debe ser un número entero de 0 o más'],
  // REE-12: partición inválida, decimal
  ['REE-12 monto decimal', 'persona_natural', 100.5, true, 'El monto pagado debe ser un número entero de 0 o más'],
  // REE-13: partición inválida, NaN
  ['REE-13 monto NaN', 'persona_natural', NaN, true, 'El monto pagado debe ser un número entero de 0 o más'],
  // REE-14: una empresa con un monto inválido también se rechaza
  ['REE-14 empresa con monto -1', 'empresa', -1, true, 'El monto pagado debe ser un número entero de 0 o más'],
];

describe('calcularReembolso (registro_pruebas.md, regla 3)', () => {
  it.each(reembolsosValidos)('%s', (_descripcion, tipo, pagado, cancelado, esperado) => {
    expect(calcularReembolso(tipo, pagado, cancelado)).toBe(esperado);
  });

  it.each(reembolsosConError)('%s', (_descripcion, tipo, pagado, cancelado, mensaje) => {
    expect(() => calcularReembolso(tipo, pagado, cancelado)).toThrow(new Error(mensaje));
  });
});