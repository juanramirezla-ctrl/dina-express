import { calcularPrecio, ConceptosPrecio } from '../src/precio/calcular-precio';

const viajeBase: ConceptosPrecio = {
  vehiculo: 200000,
  conductor: 150000,
  combustible: 300000,
  mantenimiento: 50000,
  gastosAdministrativos: 100000,
  ganancia: 80000,
};

const sinConceptos: ConceptosPrecio = {
  vehiculo: 0,
  conductor: 0,
  combustible: 0,
  mantenimiento: 0,
  gastosAdministrativos: 0,
  ganancia: 0,
};

// Los resultados esperados salen de la regla: el precio es la suma de los seis conceptos (HU-02).
const casosValidos: Array<[string, ConceptosPrecio, number]> = [
  // PRE-03: solo un concepto con valor, los demás en cero
  ['PRE-03 solo el vehículo tiene valor', { ...sinConceptos, vehiculo: 500000 }, 500000],
  // PRE-04: límite inferior válido, cada concepto en 0 (el total es 880000 menos ese concepto)
  ['PRE-04 vehiculo en 0', { ...viajeBase, vehiculo: 0 }, 680000],
  ['PRE-04 conductor en 0', { ...viajeBase, conductor: 0 }, 730000],
  ['PRE-04 combustible en 0', { ...viajeBase, combustible: 0 }, 580000],
  ['PRE-04 mantenimiento en 0', { ...viajeBase, mantenimiento: 0 }, 830000],
  ['PRE-04 gastosAdministrativos en 0', { ...viajeBase, gastosAdministrativos: 0 }, 780000],
];

describe('calcularPrecio, casos válidos (registro_pruebas.md, regla 1)', () => {
  it.each(casosValidos)('%s', (_descripcion, conceptos, esperado) => {
    expect(calcularPrecio(conceptos)).toBe(esperado);
  });
});

const casosInvalidos: Array<[string, ConceptosPrecio, string]> = [
  // PRE-05: límite, -1 es el primer valor inválido de cada concepto
  ['PRE-05 vehiculo en -1', { ...viajeBase, vehiculo: -1 }, 'El concepto vehiculo debe ser un número entero de 0 o más'],
  ['PRE-05 conductor en -1', { ...viajeBase, conductor: -1 }, 'El concepto conductor debe ser un número entero de 0 o más'],
  ['PRE-05 combustible en -1', { ...viajeBase, combustible: -1 }, 'El concepto combustible debe ser un número entero de 0 o más'],
  ['PRE-05 mantenimiento en -1', { ...viajeBase, mantenimiento: -1 }, 'El concepto mantenimiento debe ser un número entero de 0 o más'],
  ['PRE-05 gastosAdministrativos en -1', { ...viajeBase, gastosAdministrativos: -1 }, 'El concepto gastosAdministrativos debe ser un número entero de 0 o más'],
  ['PRE-05 ganancia en -1', { ...viajeBase, ganancia: -1 }, 'El concepto ganancia debe ser un número entero de 0 o más'],
  // PRE-06: partición inválida, falta un concepto (HU-02, escenario 2)
  ['PRE-06 falta vehiculo', { ...viajeBase, vehiculo: undefined } as unknown as ConceptosPrecio, 'Falta el concepto: vehiculo'],
  ['PRE-06 falta conductor', { ...viajeBase, conductor: undefined } as unknown as ConceptosPrecio, 'Falta el concepto: conductor'],
  ['PRE-06 falta mantenimiento', { ...viajeBase, mantenimiento: undefined } as unknown as ConceptosPrecio, 'Falta el concepto: mantenimiento'],
  ['PRE-06 falta gastosAdministrativos', { ...viajeBase, gastosAdministrativos: undefined } as unknown as ConceptosPrecio, 'Falta el concepto: gastosAdministrativos'],
  ['PRE-06 falta ganancia', { ...viajeBase, ganancia: undefined } as unknown as ConceptosPrecio, 'Falta el concepto: ganancia'],
  // PRE-07 a PRE-10: particiones inválidas por tipo de valor
  ['PRE-07 decimal', { ...viajeBase, combustible: 1000.5 }, 'El concepto combustible debe ser un número entero de 0 o más'],
  ['PRE-08 NaN', { ...viajeBase, ganancia: NaN }, 'El concepto ganancia debe ser un número entero de 0 o más'],
  ['PRE-09 texto', { ...viajeBase, conductor: '5000' as unknown as number }, 'El concepto conductor debe ser un número entero de 0 o más'],
  ['PRE-10 infinito', { ...viajeBase, mantenimiento: Infinity }, 'El concepto mantenimiento debe ser un número entero de 0 o más'],
];

describe('calcularPrecio, casos inválidos (registro_pruebas.md, regla 1)', () => {
  it.each(casosInvalidos)('%s', (_descripcion, conceptos, mensaje) => {
    expect(() => calcularPrecio(conceptos)).toThrow(new Error(mensaje));
  });
});