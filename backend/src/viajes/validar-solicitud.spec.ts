import { BadRequestException } from '@nestjs/common';
import { validarSolicitud } from './validar-solicitud';

const solicitudBase = {
  nombre: 'Camila Rojas',
  telefono: '3000000000',
  email: undefined,
  origen: 'Neiva',
  destino: 'Bogotá',
  fechaServicio: '2026-11-15',
};

const esperadaBase = {
  nombre: 'Camila Rojas',
  telefono: '3000000000',
  email: null,
  origen: 'Neiva',
  destino: 'Bogotá',
  fechaServicio: '2026-11-15',
};

// Los esperados salen de HU-01: la solicitud se acepta con nombre, ruta, fecha y un dato de contacto.
const casosValidos: Array<[string, unknown, unknown]> = [
  // SOL-01: partición válida, con teléfono (HU-01, escenario 1)
  ['SOL-01 con teléfono', solicitudBase, esperadaBase],
  // SOL-02: partición válida, solo con correo
  [
    'SOL-02 solo con correo',
    { ...solicitudBase, telefono: undefined, email: 'camila@example.com' },
    { ...esperadaBase, telefono: null, email: 'camila@example.com' },
  ],
  // SOL-03: teléfono con espacios, se guardan sin espacios
  ['SOL-03 teléfono con espacios', { ...solicitudBase, telefono: '300 000 0000' }, esperadaBase],
  // SOL-04: límite, el nombre de 120 caracteres es el último válido
  ['SOL-04 nombre de 120 caracteres', { ...solicitudBase, nombre: 'a'.repeat(120) }, { ...esperadaBase, nombre: 'a'.repeat(120) }],
  // SOL-05: espacios alrededor del nombre
  ['SOL-05 espacios alrededor del nombre', { ...solicitudBase, nombre: '  Camila Rojas  ' }, esperadaBase],
  // SOL-06: tildes y ñ
  ['SOL-06 nombre con tildes y ñ', { ...solicitudBase, nombre: 'Íñigo Ñáñez' }, { ...esperadaBase, nombre: 'Íñigo Ñáñez' }],
];

describe('validarSolicitud, casos válidos (HU-01)', () => {
  it.each(casosValidos)('%s', (_descripcion, entrada, esperado) => {
    expect(validarSolicitud(entrada)).toEqual(esperado);
  });
});

const casosInvalidos: Array<[string, unknown, string]> = [
  // SOL-07: HU-01, escenario 2, sin teléfono ni correo
  ['SOL-07 sin teléfono ni correo', { ...solicitudBase, telefono: undefined }, 'Falta un dato de contacto: teléfono o correo'],
  // SOL-08: teléfono y correo vacíos cuentan como no enviados
  ['SOL-08 teléfono y correo vacíos', { ...solicitudBase, telefono: '', email: '' }, 'Falta un dato de contacto: teléfono o correo'],
  // SOL-09: sin nombre
  ['SOL-09 sin nombre', { ...solicitudBase, nombre: '' }, 'Falta el campo: nombre'],
  // SOL-10: límite, 121 caracteres es el primer nombre inválido
  ['SOL-10 nombre de 121 caracteres', { ...solicitudBase, nombre: 'a'.repeat(121) }, 'El campo nombre supera 120 caracteres'],
  // SOL-11 y SOL-12: sin origen o sin destino
  ['SOL-11 sin origen', { ...solicitudBase, origen: undefined }, 'Falta el campo: origen'],
  ['SOL-12 sin destino', { ...solicitudBase, destino: '   ' }, 'Falta el campo: destino'],
  // SOL-13 y SOL-14: fecha que no existe o con otro formato
  ['SOL-13 fecha inexistente', { ...solicitudBase, fechaServicio: '2026-02-31' }, 'La fecha del servicio no es válida (use AAAA-MM-DD)'],
  ['SOL-14 fecha con otro formato', { ...solicitudBase, fechaServicio: '15/11/2026' }, 'La fecha del servicio no es válida (use AAAA-MM-DD)'],
  // SOL-15 y SOL-16: teléfono o correo mal escritos
  ['SOL-15 teléfono con letras', { ...solicitudBase, telefono: 'abc' }, 'El teléfono no es válido'],
  ['SOL-16 correo sin arroba', { ...solicitudBase, telefono: undefined, email: 'camila.example.com' }, 'El correo no es válido'],
  // SOL-17: el cuerpo no es un objeto
  ['SOL-17 cuerpo vacío', undefined, 'La solicitud no es válida'],
];

describe('validarSolicitud, casos inválidos (HU-01)', () => {
  it.each(casosInvalidos)('%s', (_descripcion, entrada, mensaje) => {
    expect(() => validarSolicitud(entrada)).toThrow(new BadRequestException(mensaje));
  });
});