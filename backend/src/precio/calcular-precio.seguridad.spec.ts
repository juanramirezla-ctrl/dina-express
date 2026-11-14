import { calcularPrecio, ConceptosPrecio } from './calcular-precio';

const viajeBase: ConceptosPrecio = {
  vehiculo: 200000,
  conductor: 150000,
  combustible: 300000,
  mantenimiento: 50000,
  gastosAdministrativos: 100000,
  ganancia: 80000,
};

describe('calcularPrecio, pruebas de abuso (revision de la semana 6)', () => {
  it('rechaza una llamada sin conceptos (undefined)', () => {
    const sinConceptos = undefined as unknown as ConceptosPrecio;
    expect(() => calcularPrecio(sinConceptos)).toThrow('Se necesitan los conceptos del precio');
  });

  it('rechaza una llamada con conceptos nulos (null)', () => {
    const nulos = null as unknown as ConceptosPrecio;
    expect(() => calcularPrecio(nulos)).toThrow('Se necesitan los conceptos del precio');
  });

  it('rechaza un concepto fuera del rango de enteros seguros', () => {
    expect(() => calcularPrecio({ ...viajeBase, vehiculo: 1e300 })).toThrow(
      'El concepto vehiculo debe ser un número entero de 0 o más',
    );
  });

  it('rechaza un total que supera el maximo entero seguro', () => {
    const excedido = { ...viajeBase, vehiculo: Number.MAX_SAFE_INTEGER, conductor: 1 };
    expect(() => calcularPrecio(excedido)).toThrow('El precio total supera el máximo permitido');
  });

  it('acepta un total igual al maximo entero seguro (limite)', () => {
    const enElLimite: ConceptosPrecio = {
      vehiculo: Number.MAX_SAFE_INTEGER,
      conductor: 0,
      combustible: 0,
      mantenimiento: 0,
      gastosAdministrativos: 0,
      ganancia: 0,
    };
    expect(calcularPrecio(enElLimite)).toBe(Number.MAX_SAFE_INTEGER);
  });
});