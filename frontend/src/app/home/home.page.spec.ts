import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { FlotaService } from '../flota/flota.service';
import { SolicitudService } from '../solicitud/solicitud.service';

import { HomePage } from './home.page';

describe('HomePage: formulario de solicitud (HU-01)', () => {
  const enviar = vi.fn();
  let pagina: HomePage;

  const datos = {
    nombre: 'Camila Rojas',
    telefono: '3000000000',
    email: '',
    origen: 'Neiva',
    destino: 'Pitalito',
    fechaServicio: '2026-12-01',
    autorizacion: true,
  };

  beforeEach(() => {
    enviar.mockReset();
    enviar.mockReturnValue(of({ mensaje: 'Solicitud recibida', idViaje: 7 }));
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: SolicitudService, useValue: { enviar } }, { provide: FlotaService, useValue: { disponibles: () => of([]) } }],
    });
    pagina = TestBed.createComponent(HomePage).componentInstance;
    pagina.elegir({ id_vehiculo: 3, placa: 'TKX123', tipo: 'camioneta', marca: 'Toyota', modelo: 'Hilux' });
  });

  it('envia los datos sin la casilla de autorizacion y muestra la confirmacion', () => {
    pagina.formulario.setValue(datos);
    pagina.enviar();

    const { autorizacion, ...resto } = datos;
    const esperado = { ...resto, idVehiculo: 3 };
    expect(autorizacion).toBe(true);
    expect(enviar).toHaveBeenCalledWith(esperado);
    expect(pagina.exito()).toBe('Solicitud recibida');
    expect(pagina.error()).toBe('');
  });

  it('no envia sin elegir un vehiculo', () => {
    pagina.elegido.set(null);
    pagina.formulario.setValue(datos);
    pagina.enviar();

    expect(enviar).not.toHaveBeenCalled();
    expect(pagina.error()).toBe('Elija un vehículo disponible');
  });

  it('no envia sin telefono ni correo (HU-01, escenario 2)', () => {
    pagina.formulario.setValue({ ...datos, telefono: '', email: '' });
    pagina.enviar();

    expect(enviar).not.toHaveBeenCalled();
    expect(pagina.error()).toBe('Falta un dato de contacto: teléfono o correo');
  });

  it('no envia sin autorizar el tratamiento de datos', () => {
    pagina.formulario.setValue({ ...datos, autorizacion: false });
    pagina.enviar();

    expect(enviar).not.toHaveBeenCalled();
    expect(pagina.error()).toBe('Debe autorizar el tratamiento de sus datos');
  });

  it('no envia si falta un campo obligatorio', () => {
    pagina.formulario.setValue({ ...datos, destino: '' });
    pagina.enviar();

    expect(enviar).not.toHaveBeenCalled();
    expect(pagina.error()).toBe('Complete nombre, origen, destino y fecha');
  });

  it('muestra el mensaje de la API cuando rechaza la solicitud', () => {
    enviar.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'El teléfono no es válido' } })),
    );
    pagina.formulario.setValue(datos);
    pagina.enviar();

    expect(pagina.error()).toBe('El teléfono no es válido');
    expect(pagina.exito()).toBe('');
  });

  it('avisa si no hay conexion con la API', () => {
    enviar.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    pagina.formulario.setValue(datos);
    pagina.enviar();

    expect(pagina.error()).toBe('No se pudo enviar la solicitud. Intente de nuevo más tarde');
  });
});

describe('HomePage: consulta de vehiculos disponibles', () => {
  const disponibles = vi.fn();
  const camioneta = { placa: 'TKX123', tipo: 'camioneta', marca: 'Toyota', modelo: 'Hilux' };
  let pagina: HomePage;

  beforeEach(() => {
    disponibles.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SolicitudService, useValue: {} },
        { provide: FlotaService, useValue: { disponibles } },
      ],
    });
    pagina = TestBed.createComponent(HomePage).componentInstance;
  });

  it('muestra los vehiculos disponibles del tipo elegido', () => {
    disponibles.mockReturnValue(of([camioneta]));
    pagina.consultar('camioneta');

    expect(disponibles).toHaveBeenCalledWith('camioneta');
    expect(pagina.disponibles()).toEqual([camioneta]);
    expect(pagina.avisoFlota()).toBe('');
  });

  it('avisa si no hay disponibles', () => {
    disponibles.mockReturnValue(of([]));
    pagina.consultar('volqueta');

    expect(pagina.avisoFlota()).toBe('No hay vehículos disponibles de este tipo');
  });

  it('avisa si no se puede consultar', () => {
    disponibles.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    pagina.consultar('volqueta');

    expect(pagina.avisoFlota()).toBe('No se pudo consultar la disponibilidad');
  });
});
