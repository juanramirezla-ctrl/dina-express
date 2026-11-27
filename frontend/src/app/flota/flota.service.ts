import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

/** Tipos de vehículo. Los mismos valores que acepta la API. */
export const TIPOS = [
  { valor: 'camioneta', nombre: 'Camioneta' },
  { valor: 'microbus_buseta', nombre: 'Microbús o buseta' },
  { valor: 'turbo', nombre: 'Camión tipo turbo' },
  { valor: 'carrotanque', nombre: 'Carrotanque' },
  { valor: 'volqueta', nombre: 'Volqueta' },
  { valor: 'carga_pesada', nombre: 'Carga pesada' },
];

export interface DatosVehiculo {
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
}

/** Vehículo disponible que el cliente puede elegir. */
export interface VehiculoDisponible extends DatosVehiculo {
  id_vehiculo: number;
}

export interface Vehiculo extends VehiculoDisponible {
  estado: string;
}

/** Comunicación con la API de vehículos. */
@Injectable({ providedIn: 'root' })
export class FlotaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/vehiculos`;

  /** Consulta pública del cliente. */
  disponibles(tipo: string): Observable<VehiculoDisponible[]> {
    return this.http.get<VehiculoDisponible[]>(`${this.url}/disponibles`, { params: { tipo } });
  }

  todos(clave: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.url, this.opciones(clave));
  }

  registrar(vehiculo: DatosVehiculo, clave: string): Observable<unknown> {
    return this.http.post(this.url, vehiculo, this.opciones(clave));
  }

  cambiarEstado(id: number, estado: string, clave: string): Observable<unknown> {
    return this.http.patch(`${this.url}/${id}/estado`, { estado }, this.opciones(clave));
  }

  private opciones(clave: string) {
    return { headers: { 'x-clave-coordinadora': clave } };
  }
}
