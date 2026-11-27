import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';

import { FlotaService } from './flota.service';

describe('FlotaService', () => {
  let servicio: FlotaService;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/vehiculos`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(FlotaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta los disponibles por tipo sin enviar clave', () => {
    servicio.disponibles('camioneta').subscribe();

    const peticion = http.expectOne(`${base}/disponibles?tipo=camioneta`);
    expect(peticion.request.headers.has('x-clave-coordinadora')).toBe(false);
    peticion.flush([]);
  });

  it('envia la clave al listar, registrar y cambiar el estado', () => {
    const nuevo = { placa: 'ABC123', tipo: 'camioneta', marca: 'Toyota', modelo: 'Hilux' };
    servicio.todos('secreta').subscribe();
    servicio.registrar(nuevo, 'secreta').subscribe();
    servicio.cambiarEstado(3, 'en_servicio', 'secreta').subscribe();

    const peticiones = http.match((peticion) => peticion.url.startsWith(base));
    expect(peticiones.map((p) => `${p.request.method} ${p.request.url}`)).toEqual([
      `GET ${base}`,
      `POST ${base}`,
      `PATCH ${base}/3/estado`,
    ]);
    expect(peticiones.every((p) => p.request.headers.get('x-clave-coordinadora') === 'secreta')).toBe(true);
    peticiones.forEach((p) => p.flush({}));
  });
});
