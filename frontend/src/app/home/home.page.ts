import type { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { SolicitudService } from '../solicitud/solicitud.service';

const MENSAJE_CAMPOS = 'Complete nombre, origen, destino y fecha';
const MENSAJE_CONTACTO = 'Falta un dato de contacto: teléfono o correo';
const MENSAJE_AUTORIZACION = 'Debe autorizar el tratamiento de sus datos';
const MENSAJE_SIN_CONEXION = 'No se pudo enviar la solicitud. Intente de nuevo más tarde';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage {
  private readonly solicitudes = inject(SolicitudService);

  readonly formulario = inject(FormBuilder).nonNullable.group({
    nombre: ['', Validators.required],
    telefono: [''],
    email: [''],
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    fechaServicio: ['', Validators.required],
    autorizacion: [false, Validators.requiredTrue],
  });

  readonly exito = signal('');
  readonly error = signal('');
  readonly enviando = signal(false);

  /** Información pública tomada de dinaexpress.com.co, con autorización de la empresa. */
  readonly servicios = [
    { nombre: 'Camionetas', detalle: 'Doble cabina o cabina sencilla, para personal o cargas livianas.' },
    { nombre: 'Microbuses y busetas', detalle: 'Transporte de estudiantes o de personal.' },
    { nombre: 'Camión tipo turbo', detalle: 'Cargas grandes o de peso medio.' },
    { nombre: 'Carrotanques', detalle: 'Transporte de líquidos.' },
    { nombre: 'Volquetas', detalle: 'Residuos industriales o cargas secas.' },
    { nombre: 'Carga pesada', detalle: 'Tractomulas, camas altas y camas bajas.' },
  ];

  /** Envía la solicitud si el formulario está completo y hay autorización. */
  enviar(): void {
    this.exito.set('');
    const problema = this.problema();
    this.error.set(problema);
    if (problema !== '') {
      return;
    }
    const { nombre, telefono, email, origen, destino, fechaServicio } = this.formulario.getRawValue();
    this.enviando.set(true);
    this.solicitudes.enviar({ nombre, telefono, email, origen, destino, fechaServicio }).subscribe({
      next: ({ mensaje }) => {
        this.enviando.set(false);
        this.exito.set(mensaje);
        this.formulario.reset();
      },
      error: (fallo: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(fallo.status === 400 ? fallo.error.message : MENSAJE_SIN_CONEXION);
      },
    });
  }

  /** Primer problema del formulario, o '' si se puede enviar. La API vuelve a validar los datos. */
  private problema(): string {
    const { nombre, telefono, email, origen, destino, fechaServicio, autorizacion } = this.formulario.getRawValue();
    if ([nombre, origen, destino, fechaServicio].some((campo) => !campo?.trim())) {
      return MENSAJE_CAMPOS;
    }
    if (!telefono?.trim() && !email?.trim()) {
      return MENSAJE_CONTACTO;
    }
    return autorizacion ? '' : MENSAJE_AUTORIZACION;
  }
}
