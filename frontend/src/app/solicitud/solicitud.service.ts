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
}

export interface Respuesta {
  mensaje: string;
  idViaje: number;
}

/** Comunicación con la API para las solicitudes de viaje (HU-01). */
@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly http = inject(HttpClient);

  enviar(solicitud: Solicitud): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${environment.apiUrl}/viajes`, solicitud);
  }
}
