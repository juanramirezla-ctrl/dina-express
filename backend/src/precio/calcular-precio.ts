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

export function calcularPrecio(conceptos: ConceptosPrecio): number {
  let total = 0;
  for (const nombre of CONCEPTOS) {
    const valor = conceptos[nombre];
    if (valor === undefined || valor === null) {
      throw new Error(`Falta el concepto: ${nombre}`);
    }
    if (!Number.isInteger(valor) || valor < 0) {
      throw new Error(`El concepto ${nombre} debe ser un número entero de 0 o más`);
    }
    total += valor;
  }
  return total;
}