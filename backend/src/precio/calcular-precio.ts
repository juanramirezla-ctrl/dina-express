export interface ConceptosPrecio {
  vehiculo: number;
  conductor: number;
  combustible: number;
  mantenimiento: number;
  gastosAdministrativos: number;
  ganancia: number;
}

const CONCEPTOS = [
  'vehiculo',
  'conductor',
  'combustible',
  'mantenimiento',
  'gastosAdministrativos',
  'ganancia',
] as const;

function validarConcepto(nombre: string, valor: unknown): void {
  if (valor === undefined || valor === null) {
    throw new Error(`Falta el concepto: ${nombre}`);
  }
  if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 0) {
    throw new Error(`El concepto ${nombre} debe ser un número entero de 0 o más`);
  }
}

export function calcularPrecio(conceptos: ConceptosPrecio): number {
  return CONCEPTOS.reduce((total, nombre) => {
    validarConcepto(nombre, conceptos[nombre]);
    return total + conceptos[nombre];
  }, 0);
}