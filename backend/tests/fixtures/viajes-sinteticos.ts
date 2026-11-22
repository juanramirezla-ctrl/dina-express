import { ConceptosPrecio } from '../../src/precio/calcular-precio';
import { TipoCliente } from '../../src/pagos/calcular-pagos';

/** Viaje de prueba con datos inventados (sin personas reales) y sus resultados esperados calculados a mano. */
export interface ViajeSintetico {
  id: string;
  cliente: { nombre: string; telefono: string; tipo: TipoCliente };
  ruta: string;
  conceptos: ConceptosPrecio;
  precioEsperado: number;
  anticipoEsperado?: number;
  saldoEsperado?: number;
}

// Datos generados con IA, con contexto del Huila. Los teléfonos son ficticios.
// Casos difíciles: tildes, ñ, apóstrofo, nombre vacío, valores en cero, total impar y empresas.
export const viajesSinteticos: ViajeSintetico[] = [
  {
    id: 'VS-01',
    cliente: { nombre: 'Nicolás Peña', telefono: '3000000001', tipo: 'persona_natural' },
    ruta: 'Neiva - Pitalito',
    conceptos: { vehiculo: 450000, conductor: 180000, combustible: 260000, mantenimiento: 40000, gastosAdministrativos: 70000, ganancia: 100000 },
    precioEsperado: 1100000,
    anticipoEsperado: 550000,
    saldoEsperado: 550000,
  },
  {
    id: 'VS-02',
    cliente: { nombre: "Dayana O'Neill", telefono: '3000000002', tipo: 'persona_natural' },
    ruta: 'Neiva - Garzón',
    conceptos: { vehiculo: 300000, conductor: 120000, combustible: 150000, mantenimiento: 30000, gastosAdministrativos: 50000, ganancia: 60000 },
    precioEsperado: 710000,
    anticipoEsperado: 355000,
    saldoEsperado: 355000,
  },
  {
    id: 'VS-03',
    cliente: { nombre: 'Íñigo Ñáñez Ávila', telefono: '3000000003', tipo: 'persona_natural' },
    ruta: 'La Plata - Neiva',
    conceptos: { vehiculo: 250001, conductor: 100000, combustible: 90000, mantenimiento: 10000, gastosAdministrativos: 20000, ganancia: 30000 },
    precioEsperado: 500001,
    anticipoEsperado: 250000,
    saldoEsperado: 250001,
  },
  {
    id: 'VS-04',
    cliente: { nombre: 'Transportes del Huila S.A.S.', telefono: '3000000004', tipo: 'empresa' },
    ruta: 'Neiva - Campoalegre',
    conceptos: { vehiculo: 200000, conductor: 100000, combustible: 80000, mantenimiento: 20000, gastosAdministrativos: 40000, ganancia: 0 },
    precioEsperado: 440000,
  },
  {
    id: 'VS-05',
    cliente: { nombre: '', telefono: '3000000005', tipo: 'persona_natural' },
    ruta: 'Neiva - Aipe',
    conceptos: { vehiculo: 0, conductor: 0, combustible: 0, mantenimiento: 0, gastosAdministrativos: 0, ganancia: 0 },
    precioEsperado: 0,
    anticipoEsperado: 0,
    saldoEsperado: 0,
  },
  {
    id: 'VS-06',
    cliente: { nombre: "Jhon D'Angelo Quintero", telefono: '3000000006', tipo: 'persona_natural' },
    ruta: 'Neiva - Rivera',
    conceptos: { vehiculo: 900000, conductor: 0, combustible: 0, mantenimiento: 0, gastosAdministrativos: 0, ganancia: 0 },
    precioEsperado: 900000,
    anticipoEsperado: 450000,
    saldoEsperado: 450000,
  },
  {
    id: 'VS-07',
    cliente: { nombre: 'Aurora Cañón Rodríguez', telefono: '3000000007', tipo: 'persona_natural' },
    ruta: 'Pitalito - San Agustín',
    conceptos: { vehiculo: 1200000, conductor: 400000, combustible: 800000, mantenimiento: 150000, gastosAdministrativos: 250000, ganancia: 300000 },
    precioEsperado: 3100000,
    anticipoEsperado: 1550000,
    saldoEsperado: 1550000,
  },
  {
    id: 'VS-08',
    cliente: { nombre: 'Servicios Petroleros Ñeque Ltda.', telefono: '3000000008', tipo: 'empresa' },
    ruta: 'Neiva - Tello',
    conceptos: { vehiculo: 600000, conductor: 300000, combustible: 500000, mantenimiento: 100000, gastosAdministrativos: 150000, ganancia: 200000 },
    precioEsperado: 1850000,
  },
];