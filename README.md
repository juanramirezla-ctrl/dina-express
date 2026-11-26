# Dina Express

[![CI](https://github.com/juanramirezla-ctrl/dina-express/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/juanramirezla-ctrl/dina-express/actions/workflows/ci.yml)

## 1. Qué es
Sistema para recibir y gestionar solicitudes de transporte de Dina Express. Arquitectura decidida (ADR-001): aplicación Ionic y Angular, API en Node.js (NestJS) y PostgreSQL.

**Estado real:** funciona la API con `POST /viajes` (HU-01) guardando en PostgreSQL. El precio, los pagos y la disponibilidad existen como funciones, sin rutas HTTP. **No hay interfaz web ni despliegue.**

## 2. Requisitos
- Node.js 20 o superior y npm
- Git
- PostgreSQL (probado con la versión 18)

## 3. Instalación
```
git clone https://github.com/juanramirezla-ctrl/dina-express.git
cd dina-express/backend
npm ci
```
Copia `.env.example` a `backend/.env` y completa los valores. El `.env` no se sube al repositorio. Para crear la base de datos, ver la [guía de ejecución local](docs/04_guia_ejecucion_local.md).

## 4. Ejecución
```
cd backend
npm run start:dev
```

| Ruta | Respuesta |
|---|---|
| `GET /salud` | 200 `{"estado":"ok"}` |
| `GET /salud/base-datos` | 200, o 503 sin conexión |
| `POST /viajes` | 201 «Solicitud recibida», o 400 si los datos no son válidos |

Cuerpo de `POST /viajes`: `nombre`, `origen`, `destino`, `fechaServicio` (AAAA-MM-DD) y al menos `telefono` o `email`.

## 5. Pruebas
```
cd backend
npm test
npm run lint
```
107 pruebas pasan y el linter (ESLint con `eslint-plugin-security`) queda sin avisos. Cobertura de líneas de la lógica del negocio: 80 % (precio y pagos 100 %, viajes 98 %, **flota 0 %**), medida el 26/11/2026.

El pipeline ejecuta linter, pruebas y `npm audit`; la auditoría **no bloquea**. Hay vulnerabilidades pendientes, también en producción: ver [revisión de seguridad](revision_seguridad.md).

## 6. Estructura
```
dina-express/
├── .github/workflows/ci.yml   pipeline
├── backend/src/               precio, pagos, flota, viajes, base-datos
├── backend/tests/             casos y datos sintéticos
├── database/                  esquema y datos de prueba
├── docs/                      propuesta, requisitos, diseño y ADR, guía y operación
├── bitacora_ia.md             uso de IA
├── registro_pruebas.md        tablas de casos
├── revision_seguridad.md      revisión de código y seguridad
└── informe_final.md           informe final (también en PDF)
```

## 7. Uso de IA
Se usaron asistentes de IA (Claude, Claude Code y ChatGPT) en requisitos, diseño, código, pruebas, operación y en los borradores de documentación. El detalle y la verificación están en [bitacora_ia.md](bitacora_ia.md) y en el [informe final](informe_final.md). El sistema en sí no usa IA.

## 8. Autor y licencia
Juan José Ramírez Lasso, Fundación Escuela Tecnológica de Neiva (FET). Proyecto académico del seminario de IA aplicada al ciclo de vida del software. Licencia: uso académico, todos los derechos reservados.

## Metodología y ciclo de vida
- **Ramas:** una por tarea, integradas a `main` con pull request. No se borran, para conservar el historial.
- **Ciclo por funcionalidad:** reglas del cliente, casos, pruebas en rojo, implementación, refactor, revisión e integración. Excepción: `flota/disponibilidad.ts` quedó sin pruebas.
