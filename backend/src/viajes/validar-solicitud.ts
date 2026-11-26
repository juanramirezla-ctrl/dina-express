import { BadRequestException } from '@nestjs/common';

/** Datos de una solicitud de viaje ya validados y limpios (HU-01). */
export interface SolicitudViaje {
  nombre: string;
  telefono: string | null;
  email: string | null;
  origen: string;
  destino: string;
  fechaServicio: string;
}

/** Coincide con el VARCHAR(120) de las columnas de la base de datos. */
const LONGITUD_MAXIMA = 120;

const MENSAJE_SOLICITUD = 'La solicitud no es válida';
const MENSAJE_CONTACTO = 'Falta un dato de contacto: teléfono o correo';
const MENSAJE_FECHA = 'La fecha del servicio no es válida (use AAAA-MM-DD)';
const MENSAJE_TELEFONO = 'El teléfono no es válido';
const MENSAJE_CORREO = 'El correo no es válido';

const PATRON_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;
const PATRON_TELEFONO = /^\d{7,15}$/;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Comprueba que un campo de texto exista, no esté vacío y no supere el máximo.
 *
 * @param valor Valor recibido.
 * @param campo Nombre del campo, usado en el mensaje de error.
 * @returns El texto sin espacios al inicio ni al final.
 * @throws BadRequestException si falta o supera 120 caracteres.
 */
function textoObligatorio(valor: unknown, campo: string): string {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new BadRequestException(`Falta el campo: ${campo}`);
  }
  const limpio = valor.trim();
  if (limpio.length > LONGITUD_MAXIMA) {
    throw new BadRequestException(`El campo ${campo} supera ${LONGITUD_MAXIMA} caracteres`);
  }
  return limpio;
}

/**
 * Devuelve un texto opcional limpio, o null si no se envió.
 *
 * @param valor Valor recibido.
 * @param mensaje Mensaje si el valor no es un texto.
 * @returns El texto sin espacios, o null si es undefined, null o vacío.
 * @throws BadRequestException si el valor no es un texto.
 */
function textoOpcional(valor: unknown, mensaje: string): string | null {
  if (valor === undefined || valor === null) {
    return null;
  }
  if (typeof valor !== 'string') {
    throw new BadRequestException(mensaje);
  }
  return valor.trim() === '' ? null : valor.trim();
}

/**
 * Comprueba que una fecha tenga el formato AAAA-MM-DD y exista en el calendario.
 *
 * @param valor Valor recibido.
 * @returns La fecha en formato AAAA-MM-DD.
 * @throws BadRequestException si no tiene el formato o no existe (por ejemplo 2026-02-31).
 */
function fechaValida(valor: unknown): string {
  const coincidencia = typeof valor === 'string' ? PATRON_FECHA.exec(valor) : null;
  if (coincidencia === null) {
    throw new BadRequestException(MENSAJE_FECHA);
  }
  const [, anio, mes, dia] = coincidencia.map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  const existe = fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
  if (!existe) {
    throw new BadRequestException(MENSAJE_FECHA);
  }
  return coincidencia[0];
}

/**
 * Valida y limpia los datos de una solicitud de viaje enviada por una persona natural (HU-01).
 *
 * @param datos Cuerpo recibido en la petición.
 * @returns La solicitud validada, con el teléfono sin espacios.
 * @throws BadRequestException si falta un campo, es muy largo, la fecha no existe,
 * el teléfono o el correo no son válidos, o no hay ni teléfono ni correo.
 */
export function validarSolicitud(datos: unknown): SolicitudViaje {
  if (typeof datos !== 'object' || datos === null) {
    throw new BadRequestException(MENSAJE_SOLICITUD);
  }
  const cuerpo = datos as Record<string, unknown>;
  const nombre = textoObligatorio(cuerpo.nombre, 'nombre');
  const origen = textoObligatorio(cuerpo.origen, 'origen');
  const destino = textoObligatorio(cuerpo.destino, 'destino');
  const fechaServicio = fechaValida(cuerpo.fechaServicio);

  const telefonoCrudo = textoOpcional(cuerpo.telefono, MENSAJE_TELEFONO);
  const telefono = telefonoCrudo === null ? null : telefonoCrudo.replace(/\s/g, '');
  if (telefono !== null && !PATRON_TELEFONO.test(telefono)) {
    throw new BadRequestException(MENSAJE_TELEFONO);
  }
  const email = textoOpcional(cuerpo.email, MENSAJE_CORREO);
  if (email !== null && !PATRON_CORREO.test(email)) {
    throw new BadRequestException(MENSAJE_CORREO);
  }
  if (telefono === null && email === null) {
    throw new BadRequestException(MENSAJE_CONTACTO);
  }
  return { nombre, telefono, email, origen, destino, fechaServicio };
}