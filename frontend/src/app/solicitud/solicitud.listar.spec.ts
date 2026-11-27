import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';

import { SolicitudService } from './solicitud.service';

describe('SolicitudService.listar', () => {
  it('pide las solicitudes enviando la clave de la coordinadora', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    TestBed.inject(SolicitudService).listar('secreta').subscribe();

    const http = TestBed.inject(HttpTestingController);
    const peticion = http.expectOne(`${environment.apiUrl}/viajes`);
    expect(peticion.request.method).toBe('GET');
    expect(peticion.request.headers.get('x-clave-coordinadora')).toBe('secreta');
    peticion.flush([]);
    http.verify();
  });
});
