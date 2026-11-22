import { calcularPrecio } from '../src/precio/calcular-precio';
import { calcularAnticipoYSaldo, calcularReembolso } from '../src/pagos/calcular-pagos';
import { viajesSinteticos, ViajeSintetico } from './fixtures/viajes-sinteticos';

type CasoViaje = [string, ViajeSintetico];

const aCaso = (viaje: ViajeSintetico): CasoViaje => [
  `${viaje.id} ${viaje.ruta} (${viaje.cliente.nombre || 'sin nombre'})`,
  viaje,
];

const todos: CasoViaje[] = viajesSinteticos.map(aCaso);
const personasNaturales: CasoViaje[] = viajesSinteticos.filter((v) => v.cliente.tipo === 'persona_natural').map(aCaso);
const conAnticipo: CasoViaje[] = viajesSinteticos
  .filter((v) => v.cliente.tipo === 'persona_natural' && (v.anticipoEsperado ?? 0) > 0)
  .map(aCaso);
const empresas: CasoViaje[] = viajesSinteticos.filter((v) => v.cliente.tipo === 'empresa').map(aCaso);

describe('datos sintéticos del Huila (fixture tests/fixtures/viajes-sinteticos.ts)', () => {
  it.each(todos)('precio: %s', (_titulo, viaje) => {
    expect(calcularPrecio(viaje.conceptos)).toBe(viaje.precioEsperado);
  });

  it.each(personasNaturales)('anticipo y saldo: %s', (_titulo, viaje) => {
    expect(calcularAnticipoYSaldo(viaje.precioEsperado)).toEqual({
      anticipo: viaje.anticipoEsperado,
      saldo: viaje.saldoEsperado,
    });
  });

  // HU-08, escenario 1: si cancela, la persona natural recupera lo que pagó (el anticipo)
  it.each(conAnticipo)('reembolso del anticipo: %s', (_titulo, viaje) => {
    expect(calcularReembolso('persona_natural', viaje.anticipoEsperado ?? 0, true)).toBe(viaje.anticipoEsperado);
  });

  // HU-08, escenario 2: un viaje de precio 0 no tiene anticipo, no hay dinero para devolver
  it('reembolso sin dinero pagado: VS-05 precio 0', () => {
    expect(() => calcularReembolso('persona_natural', 0, true)).toThrow(new Error('No hay dinero para devolver'));
  });

  // Regla: una empresa no recibe reembolso
  it.each(empresas)('reembolso de empresa: %s', (_titulo, viaje) => {
    expect(calcularReembolso(viaje.cliente.tipo, viaje.precioEsperado, true)).toBe(0);
  });
});