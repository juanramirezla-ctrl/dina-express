# Dina Express

[![CI](https://github.com/juanramirezla-ctrl/dina-express/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/juanramirezla-ctrl/dina-express/actions/workflows/ci.yml)

## 1. Qué es
Sistema para recibir y gestionar solicitudes de transporte de Dina Express. Arquitectura decidida (ADR-001): aplicación Ionic y Angular, API en Node.js (NestJS) y PostgreSQL.

**Estado real:** funciona en un computador local. El cliente ve los vehículos disponibles por tipo, elige uno y envía su solicitud, que lo reserva. La coordinadora, con una clave, ve las solicitudes, las elimina (libera el vehículo) y administra la flota. El precio y los pagos existen como funciones, sin pantalla. **No hay despliegue.**

## 2. Requisitos
- Node.js 22.22 o superior (probado con 24) y npm
- Git
- PostgreSQL (probado con la versión 18)
- Ionic CLI (opcional; `npm start` hace lo mismo)

## 3. Instalación
```
git clone https://github.com/juanramirezla-ctrl/dina-express.git
cd dina-express
cd backend && npm ci
cd ../frontend && npm ci
```
Copia `.env.example` a `backend/.env`, completa los valores y define `CLAVE_COORDINADORA`. El `.env` no se sube al repositorio. La base de datos se crea con los tres scripts de `database/`: ver la [guía de ejecución local](docs/04_guia_ejecucion_local.md).

## 4. Ejecución
En dos terminales:
```
cd backend && npm run start:dev      # API en http://localhost:3000
cd frontend && ionic serve           # web en http://localhost:8100
```
La web debe quedar en el puerto 8100: la API solo acepta ese origen.

| Ruta de la API | Quién | Qué hace |
|---|---|---|
| `GET /salud`, `GET /salud/base-datos` | Pública | Estado de la API y de la base |
| `GET /vehiculos/disponibles?tipo=` | Pública | Vehículos libres de un tipo |
| `POST /viajes` | Pública | Guarda la solicitud y reserva el vehículo (`idVehiculo`) |
| `GET /viajes`, `DELETE /viajes/:id` | Coordinadora | Lista solicitudes; cancela y libera |
| `GET /vehiculos`, `POST /vehiculos`, `PATCH /vehiculos/:id/estado` | Coordinadora | Administra la flota |

Las rutas de la coordinadora exigen la cabecera `x-clave-coordinadora`.

## 5. Pruebas
```
cd backend && npm test && npm run lint
cd frontend && npm test && npm run lint && npm run build
```
143 pruebas en la API y 23 en la web. Cobertura de líneas de la lógica del negocio de la API: 91 % (medida el 26/11/2026). El pipeline ejecuta ambas partes; la auditoría de dependencias **no bloquea** y hay vulnerabilidades pendientes en la API, también de producción: ver [revisión de seguridad](revision_seguridad.md).

## 6. Estructura
```
dina-express/
├── .github/workflows/ci.yml   pipeline (API y web)
├── backend/src/               viajes, flota, precio, pagos, base-datos
├── backend/tests/             casos y datos sintéticos
├── frontend/src/app/          home, panel, servicios
├── database/                  esquema, datos de prueba y tipo de vehículo
├── docs/                      propuesta, requisitos, diseño y ADR, guía, operación, diapositivas
├── bitacora_ia.md             uso de IA
├── registro_pruebas.md        tablas de casos
├── revision_seguridad.md      revisión de código y seguridad
└── informe_final.md           informe final (también en PDF)
```

## 7. Uso de IA
Se usaron asistentes de IA (Claude, Claude Code y ChatGPT) en requisitos, diseño, código, pruebas, operación, diseño visual y borradores de documentación. El detalle y la verificación están en [bitacora_ia.md](bitacora_ia.md) y en el [informe final](informe_final.md). El sistema en sí no usa IA.

## 8. Autor y licencia
Juan José Ramírez Lasso, Fundación Escuela Tecnológica de Neiva (FET). Proyecto académico del seminario de IA aplicada al ciclo de vida del software. Licencia: uso académico, todos los derechos reservados. El logo, la foto y los textos de la empresa pertenecen a Dina Express y se usan con su autorización.

## Metodología y ciclo de vida
- **Ramas:** una por tarea, integradas a `main` con pull request. No se borran, para conservar el historial.
- **Ciclo por funcionalidad:** reglas del cliente, casos, pruebas en rojo, implementación, refactor, revisión e integración. Excepción corregida: `flota/disponibilidad.ts` se integró sin pruebas y se agregaron después.
