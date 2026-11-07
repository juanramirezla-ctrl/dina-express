export interface ConceptosPrecio {
  vehiculo: number;
  conductor: number;
  combustible: number;
  mantenimiento: number;
  gastosAdministrativos: number;
  ganancia: number;
}

const NOMBRES_CONCEPTOS = [
  'vehiculo',
  'conductor',
  'combustible',
  'mantenimiento',
  'gastosAdministrativos',
  'ganancia',
] as const;

const mensajeFalta = (nombre: string): string => `Falta el concepto: ${nombre}`;

const mensajeInvalido = (nombre: string): string =>
  `El concepto ${nombre} debe ser un número entero de 0 o más`;

function esEnteroNoNegativo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0;
}

function validarConcepto(nombre: string, valor: unknown): void {
  if (valor === undefined || valor === null) {
    throw new Error(mensajeFalta(nombre));
  }
  if (!esEnteroNoNegativo(valor)) {
    throw new Error(mensajeInvalido(nombre));
  }
}

export function calcularPrecio(conceptos: ConceptosPrecio): number {
  return NOMBRES_CONCEPTOS.reduce((total, nombre) => {
    validarConcepto(nombre, conceptos[nombre]);
    return total + conceptos[nombre];
  }, 0);
}