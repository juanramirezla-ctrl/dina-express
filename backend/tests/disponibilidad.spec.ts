import { evaluarAsignacion, listarVehiculosDisponibles, Vehiculo } from '../src/flota/disponibilidad';

const vehiculo = (placa: string, estado: 'disponible' | 'en_servicio', hora: number): Vehiculo => ({
  placa,
  estado,
  disponibleDesde: new Date(Date.UTC(2026, 10, 26, hora)),
});

describe('listarVehiculosDisponibles (HU-03 y HU-05)', () => {
  it('solo lista los disponibles, con el que quedo libre mas recientemente de primero', () => {
    const flota = [
      vehiculo('TKX123', 'disponible', 8),
      vehiculo('TKX456', 'en_servicio', 9),
      vehiculo('TKX789', 'disponible', 10),
    ];

    expect(listarVehiculosDisponibles(flota).map((v) => v.placa)).toEqual(['TKX789', 'TKX123']);
  });

  it('no modifica la lista recibida', () => {
    const flota = [vehiculo('TKX123', 'disponible', 8), vehiculo('TKX789', 'disponible', 10)];
    listarVehiculosDisponibles(flota);

    expect(flota.map((v) => v.placa)).toEqual(['TKX123', 'TKX789']);
  });

  it('rechaza un estado desconocido', () => {
    const malo = { ...vehiculo('TKX123', 'disponible', 8), estado: 'libre' as unknown as 'disponible' };

    expect(() => listarVehiculosDisponibles([malo])).toThrow('El estado no es válido');
  });

  it('rechaza una fecha de disponibilidad no valida', () => {
    const malo = { ...vehiculo('TKX123', 'disponible', 8), disponibleDesde: new Date('x') };

    expect(() => listarVehiculosDisponibles([malo])).toThrow('La fecha de disponibilidad no es válida');
  });
});

describe('evaluarAsignacion (HU-04)', () => {
  it.each([
    ['disponible', 'disponible', { asignable: true }],
    ['en_servicio', 'disponible', { asignable: false, motivo: 'El conductor no está disponible' }],
    ['disponible', 'en_servicio', { asignable: false, motivo: 'El vehículo no está disponible' }],
    ['en_servicio', 'en_servicio', { asignable: false, motivo: 'El conductor y el vehículo no están disponibles' }],
  ] as const)('conductor %s y vehiculo %s', (conductor, estadoVehiculo, esperado) => {
    const resultado = evaluarAsignacion(
      { nombre: 'Pedro Gil', estado: conductor },
      vehiculo('TKX123', estadoVehiculo, 8),
    );

    expect(resultado).toEqual(esperado);
  });
});
