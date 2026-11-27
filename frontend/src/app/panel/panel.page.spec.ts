import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { FlotaService } from '../flota/flota.service';

import { PanelPage } from './panel.page';

describe('PanelPage: panel de la coordinadora', () => {
  const flota = { todos: vi.fn(), registrar: vi.fn(), cambiarEstado: vi.fn() };
  const vehiculo = {
    id_vehiculo: 3,
    placa: 'TKX123',
    tipo: 'camioneta',
    marca: 'Toyota',
    modelo: 'Hilux',
    estado: 'disponible',
  };
  let pagina: PanelPage;

  beforeEach(() => {
    vi.resetAllMocks();
    flota.todos.mockReturnValue(of([vehiculo]));
    flota.registrar.mockReturnValue(of({ idVehiculo: 4 }));
    flota.cambiarEstado.mockReturnValue(of({}));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: FlotaService, useValue: flota }] });
    pagina = TestBed.createComponent(PanelPage).componentInstance;
    pagina.acceso.setValue({ clave: 'secreta' });
  });

  it('entra con la clave y muestra la flota', () => {
    pagina.entrar();

    expect(flota.todos).toHaveBeenCalledWith('secreta');
    expect(pagina.dentro()).toBe(true);
    expect(pagina.vehiculos()).toEqual([vehiculo]);
  });

  it('no entra con una clave incorrecta', () => {
    flota.todos.mockReturnValue(
      throwError(
        () => new HttpErrorResponse({ status: 401, error: { message: 'La clave de la coordinadora no es correcta' } }),
      ),
    );
    pagina.entrar();

    expect(pagina.dentro()).toBe(false);
    expect(pagina.error()).toBe('La clave de la coordinadora no es correcta');
  });

  it('registra un vehiculo y vuelve a cargar la lista', () => {
    const nuevo = { placa: 'ABC123', tipo: 'camioneta', marca: 'Nissan', modelo: 'Frontier' };
    pagina.nuevo.setValue(nuevo);
    pagina.registrar();

    expect(flota.registrar).toHaveBeenCalledWith(nuevo, 'secreta');
    expect(flota.todos).toHaveBeenCalled();
    expect(pagina.exito()).toBe('Vehículo registrado');
  });

  it('no registra si faltan datos', () => {
    pagina.registrar();

    expect(flota.registrar).not.toHaveBeenCalled();
    expect(pagina.error()).toBe('Complete placa, tipo, marca y modelo');
  });

  it('cambia un vehiculo de disponible a en servicio', () => {
    pagina.alternar({ ...vehiculo, estado: 'disponible' });

    expect(flota.cambiarEstado).toHaveBeenCalledWith(3, 'en_servicio', 'secreta');
  });
});
