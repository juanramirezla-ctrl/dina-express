import type { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { FlotaService, TIPOS, type Vehiculo } from '../flota/flota.service';
import { SolicitudService, type SolicitudRecibida } from '../solicitud/solicitud.service';

const MENSAJE_CAMPOS = 'Complete placa, tipo, marca y modelo';
const MENSAJE_SIN_CONEXION = 'No se pudo conectar con la API';

/** Panel donde la coordinadora de transporte registra vehículos y marca su disponibilidad. */
@Component({
  selector: 'app-panel',
  templateUrl: 'panel.page.html',
  styleUrls: ['panel.page.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  ],
})
export class PanelPage {
  private readonly flota = inject(FlotaService);
  private readonly pedidos = inject(SolicitudService);
  private readonly fb = inject(FormBuilder).nonNullable;

  /** La clave solo vive en memoria: al recargar la página hay que escribirla otra vez. */
  readonly acceso = this.fb.group({ clave: ['', Validators.required] });
  readonly nuevo = this.fb.group({ placa: [''], tipo: [''], marca: [''], modelo: [''] });

  readonly tipos = TIPOS;
  readonly dentro = signal(false);
  readonly vehiculos = signal<Vehiculo[]>([]);
  readonly solicitudes = signal<SolicitudRecibida[]>([]);
  readonly error = signal('');
  readonly exito = signal('');

  /** La API comprueba la clave al pedir la lista. */
  entrar(): void {
    this.limpiar();
    this.cargar();
    this.cargarSolicitudes();
  }

  /** Trae las solicitudes de los clientes, la más reciente primero. */
  cargarSolicitudes(): void {
    this.pedidos.listar(this.clave()).subscribe({
      next: (solicitudes) => this.solicitudes.set(solicitudes),
      error: (fallo: HttpErrorResponse) => this.fallar(fallo),
    });
  }

  registrar(): void {
    this.limpiar();
    const datos = this.nuevo.getRawValue();
    if (Object.values(datos).some((campo) => !campo?.trim())) {
      this.error.set(MENSAJE_CAMPOS);
      return;
    }
    this.flota.registrar(datos, this.clave()).subscribe({
      next: () => {
        this.exito.set('Vehículo registrado');
        this.nuevo.reset();
        this.cargar();
      },
      error: (fallo: HttpErrorResponse) => this.fallar(fallo),
    });
  }

  /** Pasa un vehículo de disponible a en servicio, o al contrario. */
  alternar(vehiculo: Vehiculo): void {
    this.limpiar();
    const estado = vehiculo.estado === 'disponible' ? 'en_servicio' : 'disponible';
    this.flota.cambiarEstado(vehiculo.id_vehiculo, estado, this.clave()).subscribe({
      next: () => this.cargar(),
      error: (fallo: HttpErrorResponse) => this.fallar(fallo),
    });
  }

  nombreTipo(valor: string): string {
    return TIPOS.find((tipo) => tipo.valor === valor)?.nombre ?? 'Sin tipo';
  }

  private cargar(): void {
    this.flota.todos(this.clave()).subscribe({
      next: (vehiculos) => {
        this.vehiculos.set(vehiculos);
        this.dentro.set(true);
      },
      error: (fallo: HttpErrorResponse) => this.fallar(fallo),
    });
  }

  private clave(): string {
    return this.acceso.getRawValue().clave;
  }

  private limpiar(): void {
    this.error.set('');
    this.exito.set('');
  }

  private fallar(fallo: HttpErrorResponse): void {
    this.error.set(fallo.status === 0 ? MENSAJE_SIN_CONEXION : (fallo.error?.message ?? MENSAJE_SIN_CONEXION));
  }
}
