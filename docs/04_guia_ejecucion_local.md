# Guía de ejecución local

Escrita el 26 de noviembre de 2026 con ayuda de IA (Claude), para la entrega final. **El sistema no está desplegado en ningún servidor ni en la nube:** esta guía es para ejecutarlo en un computador.

## 1. Requisitos

- Node.js 20 o superior y npm (probado con Node 24; el pipeline usa Node 22).
- Git.
- PostgreSQL (probado con PostgreSQL 18).

## 2. Instalación

```bash
git clone https://github.com/juanramirezla-ctrl/dina-express.git
cd dina-express/backend
npm ci
```

Copia `.env.example` (en la raíz) a `backend/.env` y completa los valores. El `.env` no se sube al repositorio.

## 3. Base de datos (solo la primera vez)

Desde la raíz del repositorio, en Git Bash. `psql` pide la contraseña.

```bash
PG="/c/Program Files/PostgreSQL/18/bin"
"$PG/createdb.exe" -h localhost -U postgres dina_express
"$PG/psql.exe" -h localhost -U postgres -d dina_express -f database/01_esquema.sql
"$PG/psql.exe" -h localhost -U postgres -d dina_express -f database/02_datos_prueba.sql
```

**Cuidado:** `01_esquema.sql` borra las tablas antes de crearlas. No lo ejecutes sobre una base con datos que quieras conservar. Los datos de prueba son ficticios.

## 4. Arranque de la API

```bash
cd backend
npm run start:dev
```

Queda en `http://localhost:3000`. Se detiene con Ctrl+C.

## 5. Comprobaciones

En otra terminal:

```bash
curl -i http://localhost:3000/salud
curl -i http://localhost:3000/salud/base-datos
```

| Petición | Respuesta esperada |
|---|---|
| `GET /salud` | 200 `{"estado":"ok"}` |
| `GET /salud/base-datos` | 200 `{"baseDatos":"ok"}` (503 si no hay conexión) |

Solicitud sin teléfono ni correo (HU-01, error; no guarda nada):

```bash
curl -i -X POST http://localhost:3000/viajes -H "Content-Type: application/json" \
  -d '{"nombre":"Camila Rojas","origen":"Neiva","destino":"Pitalito","fechaServicio":"2026-12-01"}'
```

Respuesta: 400 `Falta un dato de contacto: teléfono o correo`.

Solicitud válida (**guarda un cliente y un viaje**; usa solo datos ficticios):

```bash
curl -i -X POST http://localhost:3000/viajes -H "Content-Type: application/json" \
  -d '{"nombre":"Camila Rojas","telefono":"3000000000","origen":"Neiva","destino":"Pitalito","fechaServicio":"2026-12-01"}'
```

Respuesta esperada: 201 `{"mensaje":"Solicitud recibida","idViaje":<número>}`.

## 6. Pruebas y linter

```bash
cd backend
npm test
npm run lint
```

## 7. Qué se comprobó al escribir esta guía

| Comando | Resultado el 26/11/2026 |
|---|---|
| `npm run start:dev` | La API arrancó |
| `GET /salud` | 200 |
| `GET /salud/base-datos` | 200 |
| `POST /viajes` sin contacto | 400 |
| `npm test` | 107 pruebas pasan, 10 suites |
| `npm run lint` | Sin avisos |

**No se ejecutaron en esta revisión:** la instalación desde cero (`npm ci` sí corre en cada ejecución del pipeline), la creación de la base de datos (sección 3) y la solicitud válida que guarda datos.

## 8. Límites

No hay interfaz web (Ionic y Angular), inicio de sesión ni rutas de precio, disponibilidad o pagos.
