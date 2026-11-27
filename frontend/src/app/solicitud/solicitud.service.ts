import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

/** Datos que la API espera en POST /viajes. */
export interface Solicitud {
  nombre: string;
  telefono: string;
  email: string;
  origen: string;
  destino: string;
  fechaServicio: string;
  idVehiculo?: number;
}

export interface Respuesta {
  mensaje: string;
  idViaje: number;
}

/** Una solicitud como la ve la coordinadora. */
export interface SolicitudRecibida {
  id_viaje: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  origen: string;
  destino: string;
  fecha_servicio: string;
  estado: string;
  placa?: string | null;
}

/** Comunicación con la API para las solicitudes de viaje (HU-01). */
@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly http = inject(HttpClient);

  listar(clave: string): Observable<SolicitudRecibida[]> {
    return this.http.get<SolicitudRecibida[]>(`${environment.apiUrl}/viajes`, {
      headers: { 'x-clave-coordinadora': clave },
    });
  }

  /** Cancela la solicitud y libera el vehículo. */
  cancelar(idViaje: number, clave: string): Observable<unknown> {
    return this.http.delete(`${environment.apiUrl}/viajes/${idViaje}`, {
      headers: { 'x-clave-coordinadora': clave },
    });
  }

  enviar(solicitud: Solicitud): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${environment.apiUrl}/viajes`, solicitud);
  }
}
