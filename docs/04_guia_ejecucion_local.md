# Guía de ejecución local

Escrita el 26 de noviembre de 2026 con ayuda de IA (Claude), para la entrega final. **El sistema no está desplegado en ningún servidor ni en la nube:** esta guía es para ejecutarlo en un computador.

## 1. Requisitos

- Node.js 22.22 o superior y npm (probado con Node 24).
- Git, PostgreSQL (probado con 18) y, si se quiere, Ionic CLI.

## 2. Instalación

```bash
git clone https://github.com/juanramirezla-ctrl/dina-express.git
cd dina-express/backend && npm ci
cd ../frontend && npm ci
```

Copia `.env.example` (en la raíz) a `backend/.env`, completa los valores y define `CLAVE_COORDINADORA` (letras y números, sin comillas ni `#`). El `.env` no se sube.

## 3. Base de datos (solo la primera vez)

Desde la raíz, en Git Bash. Los comandos piden la contraseña.

```bash
PG="/c/Program Files/PostgreSQL/18/bin"
"$PG/createdb.exe" -h localhost -U postgres dina_express
"$PG/psql.exe" -h localhost -U postgres -d dina_express -f database/01_esquema.sql
"$PG/psql.exe" -h localhost -U postgres -d dina_express -f database/02_datos_prueba.sql
"$PG/psql.exe" -h localhost -U postgres -d dina_express -f database/03_tipo_vehiculo.sql
```

**Cuidado:** `01_esquema.sql` borra las tablas antes de crearlas. `03_tipo_vehiculo.sql` no borra datos.

## 4. Arranque

Terminal 1:
```bash
cd backend && npm run start:dev
```
Terminal 2:
```bash
cd frontend && ionic serve
```

La web abre en `http://localhost:8100` y debe usar ese puerto. Si se cambia `.env`, hay que reiniciar la API.

## 5. Comprobaciones

| Paso | Resultado esperado |
|---|---|
| `http://localhost:3000/salud` | `{"estado":"ok"}` |
| `http://localhost:3000/salud/base-datos` | `{"baseDatos":"ok"}` |
| Elegir «Camioneta» en la web | Aparecen las camionetas libres |
| Elegir una y enviar con datos ficticios | «Solicitud recibida»; ese vehículo deja de aparecer |
| `/panel` con la clave | Solicitudes y flota |
| «Eliminar solicitud» | El vehículo vuelve a aparecer |

## 6. Pruebas

```bash
cd backend && npm test && npm run lint
cd ../frontend && npm test && npm run lint && npm run build
```

## 7. Qué se comprobó (26/11/2026)

| Comprobación | Resultado |
|---|---|
| Rutas de salud | 200 |
| Reserva, segundo intento sobre el mismo vehículo, lista, cancelación | 201, 409, 200, 200 (contra PostgreSQL local, con datos ficticios) |
| Cancelar sin clave | 401 |
| Pruebas de la API y de la web | 143 y 23 pasan |

**No se probó:** la instalación desde cero ni la creación de la base con `psql`.

## 8. Límites

Sin despliegue, sin inicio de sesión con roles, sin pantallas de precio, conductores ni pagos.
