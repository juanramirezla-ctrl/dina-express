import { calcularPrecio, ConceptosPrecio } from './calcular-precio';

const viajeBase: ConceptosPrecio = {
  vehiculo: 200000,
  conductor: 150000,
  combustible: 300000,
  mantenimiento: 50000,
  gastosAdministrativos: 100000,
  ganancia: 80000,
};

describe('calcularPrecio (HU-02)', () => {
  describe('casos normales', () => {
    it('suma los seis conceptos del ejemplo de HU-02 y da 880000', () => {
      expect(calcularPrecio(viajeBase)).toBe(880000);
    });

    it('calcula el precio de otro viaje con valores distintos', () => {
      const otroViaje: ConceptosPrecio = {
        vehiculo: 100000,
        conductor: 80000,
        combustible: 120000,
        mantenimiento: 20000,
        gastosAdministrativos: 30000,
        ganancia: 50000,
      };
      expect(calcularPrecio(otroViaje)).toBe(400000);
    });
  });

  describe('casos limite', () => {
    it('acepta la ganancia en cero y suma solo los costos', () => {
      expect(calcularPrecio({ ...viajeBase, ganancia: 0 })).toBe(800000);
    });

    it('devuelve cero cuando todos los conceptos son cero', () => {
      const todoEnCero: ConceptosPrecio = {
        vehiculo: 0,
        conductor: 0,
        combustible: 0,
        mantenimiento: 0,
        gastosAdministrativos: 0,
        ganancia: 0,
      };
      expect(calcularPrecio(todoEnCero)).toBe(0);
    });
  });

  describe('casos de error', () => {
    it('rechaza el calculo si falta el combustible y lo indica (HU-02, escenario 2)', () => {
      const sinCombustible = { ...viajeBase, combustible: undefined } as unknown as ConceptosPrecio;
      expect(() => calcularPrecio(sinCombustible)).toThrow('Falta el concepto: combustible');
    });

    it('rechaza un concepto negativo', () => {
      expect(() => calcularPrecio({ ...viajeBase, mantenimiento: -50000 })).toThrow(
        'El concepto mantenimiento debe ser un número entero de 0 o más',
      );
    });

    it('rechaza un concepto con decimales', () => {
      expect(() => calcularPrecio({ ...viajeBase, vehiculo: 1500.5 })).toThrow(
        'El concepto vehiculo debe ser un número entero de 0 o más',
      );
    });
  });
});