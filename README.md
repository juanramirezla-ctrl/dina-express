# Dina Express

## 1. Qué es
Sistema web para recibir y gestionar solicitudes de transporte de Dina Express. Una persona natural envía su solicitud por la página web y la coordinadora de transporte calcula el precio, revisa la disponibilidad de vehículos y conductores y registra los pagos. Arquitectura (ADR-001): aplicación Ionic y Angular, API en Node.js y base de datos PostgreSQL.

Estado: primer incremento. Está lista la función de cálculo del precio (HU-02) con sus pruebas y su revisión de seguridad. La API con NestJS y la aplicación Ionic están en desarrollo.

## 2. Requisitos
- Node.js 20 o superior y npm
- Git
- PostgreSQL 16 o superior (solo para la base de datos de la carpeta `database`)

## 3. Instalación
```
git clone https://github.com/juanramirezla-ctrl/dina-express.git
cd dina-express/backend
npm install
```
Variables de entorno: copia `.env.example` a `.env` y completa los valores. El archivo `.env` no se sube al repositorio.

Base de datos (opcional por ahora): crea la base `dina_express` y ejecuta en orden los scripts de `database/`.

## 4. Ejecución
El incremento actual es una función; se ejecuta mediante sus pruebas (sección 5).

**Funcionalidad: `calcularPrecio` (HU-02).** Como coordinadora de transporte, quiero calcular el precio de un viaje a partir de sus seis conceptos, para dar un precio al cliente.

```ts
import { calcularPrecio } from './src/precio/calcular-precio';

calcularPrecio({
  vehiculo: 200000, conductor: 150000, combustible: 300000,
  mantenimiento: 50000, gastosAdministrativos: 100000, ganancia: 80000,
}); // 880000
```

| Entrada | Salida |
|---|---|
| Los seis conceptos del ejemplo | 880000 |
| Los mismos con `ganancia` en 0 | 800000 |
| Sin `combustible` | Error: Falta el concepto: combustible |
| `mantenimiento` en -50000 | Error: El concepto mantenimiento debe ser un número entero de 0 o más |
| Sin objeto de conceptos | Error: Se necesitan los conceptos del precio |

Supuestos: los valores son enteros de pesos, de 0 o más; la ganancia es un valor fijo (pendiente de confirmar con la clienta).

## 5. Pruebas
```
cd backend
npm test
npm run lint
```
Hay 84 pruebas: casos normales, de límite, de error y de abuso. El linter usa ESLint con `eslint-plugin-security` y queda sin avisos.

## 6. Estructura
```
dina-express/
├── backend/
│   ├── src/precio/
│   │   ├── calcular-precio.ts
│   │   ├── calcular-precio.spec.ts
│   │   └── calcular-precio.seguridad.spec.ts
│   ├── eslint.config.mjs
│   ├── jest.config.js
│   └── tsconfig.json
├── database/             esquema y datos de prueba (PostgreSQL)
├── bitacora_ia.md        uso de IA, entradas por semana
├── revision_seguridad.md informe de revisión de código y seguridad
└── .env.example
```

## 7. Uso de IA
Se usó Claude como asistente para el contrato, las pruebas, la implementación, el refactor, la revisión de seguridad y los borradores de docstrings y README. Cada sugerencia se verificó con pruebas o comandos. El detalle está en `bitacora_ia.md` y en `revision_seguridad.md`.

## 8. Autor y licencia
Juan José Ramírez Lasso, Fundación Escuela Tecnológica de Neiva (FET). Proyecto académico del seminario de IA aplicada al ciclo de vida del software. Licencia: uso académico, todos los derechos reservados.

## Metodología y ciclo de vida
- **Ramas:** `main` es la versión estable. `api-nestjs` (API base) y `pruebas-semana-7` (suite de pruebas) se integran con pull request y no se borran, para conservar el historial.
- **Ciclo por funcionalidad:** reglas del cliente, diseño de casos, pruebas, implementación, refactor, revisión de seguridad e integración.
- **Commits pequeños,** con un mensaje que dice qué cambió.
- **Uso de IA con revisión humana:** `bitacora_ia.md` y `registro_pruebas.md`.