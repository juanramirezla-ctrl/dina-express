# Dina Express

Sistema web para recibir y gestionar solicitudes de transporte de Dina Express.
Arquitectura: Ionic y Angular, API en Node.js y PostgreSQL (ADR-001).

## Funcionalidad de la semana 5

### Historia de usuario HU-02 (Must)
Como coordinadora de transporte, quiero calcular el precio de un viaje a partir del gasto del vehículo, el del conductor, el combustible, el mantenimiento, los gastos administrativos y la ganancia, para dar un precio al cliente.

**Criterios de aceptación**
- Escenario 1: precio calculado. Dado que un viaje tiene vehículo $200.000, conductor $150.000, combustible $300.000, mantenimiento $50.000, gastos administrativos $100.000 y ganancia de $80.000, cuando calculo el precio, entonces el sistema muestra un precio de $880.000.
- Escenario 2 (error): falta un concepto. Dado que estoy calculando un viaje, cuando dejo vacío el combustible, entonces el sistema no calcula y me indica que falta el combustible.

### Contrato de la función

Archivo: `backend/src/precio/calcular-precio.ts`

```ts
export interface ConceptosPrecio {
  vehiculo: number;
  conductor: number;
  combustible: number;
  mantenimiento: number;
  gastosAdministrativos: number;
  ganancia: number;
}

export function calcularPrecio(conceptos: ConceptosPrecio): number
```

- **Recibe:** un objeto con los seis conceptos del precio, cada uno en pesos colombianos.
- **Devuelve:** el precio total en pesos, que es la suma de los seis conceptos.
- **Supuestos:** cada concepto es un número entero de 0 o más. La ganancia es un valor fijo en pesos, no un porcentaje (pregunta P-02 pendiente con la clienta).
- **Casos límite:** ganancia en 0; todos los conceptos en 0.
- **Errores:** si falta un concepto lanza `Error('Falta el concepto: <nombre>')`. Si un concepto es negativo, tiene decimales o no es un número lanza `Error('El concepto <nombre> debe ser un número entero de 0 o más')`.

### Ejemplos

| Entrada | Salida |
|---|---|
| vehiculo 200000, conductor 150000, combustible 300000, mantenimiento 50000, gastosAdministrativos 100000, ganancia 80000 | 880000 |
| los mismos valores con ganancia 0 | 800000 |
| los mismos valores sin combustible | Error: Falta el concepto: combustible |
| los mismos valores con mantenimiento -50000 | Error: El concepto mantenimiento debe ser un número entero de 0 o más |

### Cómo ejecutar las pruebas

```
cd backend
npm install
npm test
```