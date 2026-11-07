export interface ConceptosPrecio {
  vehiculo: number;
  conductor: number;
  combustible: number;
  mantenimiento: number;
  gastosAdministrativos: number;
  ganancia: number;
}

export function calcularPrecio(conceptos: ConceptosPrecio): number {
  throw new Error('No implementado');
}