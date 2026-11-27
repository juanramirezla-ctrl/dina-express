import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';

import { SolicitudService } from './solicitud.service';

describe('SolicitudService (HU-01)', () => {
  let servicio: SolicitudService;
  let http: HttpTestingController;

  const solicitud = {
    nombre: 'Camila Rojas',
    telefono: '3000000000',
    email: '',
    origen: 'Neiva',
    destino: 'Pitalito',
    fechaServicio: '2026-12-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(SolicitudService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envia la solicitud por POST a /viajes y entrega la respuesta', () => {
    let mensaje = '';
    servicio.enviar(solicitud).subscribe((respuesta) => (mensaje = respuesta.mensaje));

    const peticion = http.expectOne(`${environment.apiUrl}/viajes`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual(solicitud);
    peticion.flush({ mensaje: 'Solicitud recibida', idViaje: 7 });

    expect(mensaje).toBe('Solicitud recibida');
  });
});
