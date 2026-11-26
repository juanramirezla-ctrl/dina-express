# Plan de operación

Escrito el 26 de noviembre de 2026 con ayuda de IA (Claude), para la entrega final. **No hay un sistema en producción.** Esto describe lo que ya funciona (el pipeline) y lo que habría que hacer para operar la API.

## 1. Lo que existe hoy

| Elemento | Qué hace | Evidencia |
|---|---|---|
| Pipeline de CI | En cada push (a `main`, `feature/**` y `pruebas-semana-7`) y en cada pull request a `main`: `npm ci`, linter, pruebas y `npm audit` | [ci.yml](../.github/workflows/ci.yml), [ejecuciones](https://github.com/juanramirezla-ctrl/dina-express/actions); la ejecución #3, en `main` (commit 0d5cd05), terminó en verde |
| Rutas de salud | Indican si la API vive y si llega a la base de datos | `GET /salud`, `GET /salud/base-datos` |
| Revisión de seguridad | Hallazgos y pendientes | [revision_seguridad.md](../revision_seguridad.md) |
| Bitácora de IA | Qué se pidió a la IA y cómo se verificó | [bitacora_ia.md](../bitacora_ia.md) |

**El verde del pipeline no significa que no haya vulnerabilidades:** el paso de `npm audit` tiene `continue-on-error: true` y no bloquea.

## 2. Rutina propuesta (todavía no se ejecuta)

| Cuándo | Qué hacer |
|---|---|
| Cada cambio | Rama, pruebas primero, pull request y pipeline en verde antes de integrar |
| Cada día de uso | Consultar `/salud` y `/salud/base-datos`; hacer respaldo |
| Cada semana | Ejecutar `npm audit` y revisar si hay versiones corregidas |
| Cada mes | Restaurar un respaldo en una base de prueba para confirmar que sirve |

## 3. Respaldo y restauración

En Git Bash. Los comandos piden la contraseña; nunca se escribe en el comando ni en un archivo del repositorio.

```bash
PG="/c/Program Files/PostgreSQL/18/bin"
mkdir -p ~/respaldos
"$PG/pg_dump.exe" -h localhost -U postgres -d dina_express -F c -f ~/respaldos/dina_express_$(date +%F).dump
```

Restaurar en una base de prueba (nunca sobre la base en uso):

```bash
"$PG/createdb.exe" -h localhost -U postgres dina_express_prueba
"$PG/pg_restore.exe" -h localhost -U postgres -d dina_express_prueba ~/respaldos/dina_express_<fecha>.dump
```

El respaldo contiene datos personales (nombre, teléfono, correo): se guarda **fuera del repositorio**, con acceso restringido, y se borra cuando deja de ser necesario.

**Estado de la prueba:** se comprobó que `pg_dump` 18.6 está instalado. El respaldo completo y la restauración **todavía no se han probado**, porque piden la contraseña.

## 4. Si algo falla

| Síntoma | Revisar |
|---|---|
| `/salud` no responde | Que la API esté arrancada y que el puerto 3000 esté libre |
| `/salud/base-datos` da 503 | Que PostgreSQL esté encendido y que `DATABASE_URL` sea correcta |
| El pipeline falla | El registro del paso en Actions; reproducir con `npm run lint` y `npm test` |
| Un cambio rompe `main` | Revertir con `git revert` en una rama y pull request, sin reescribir el historial |

## 5. Pendientes

| Pendiente | Detalle |
|---|---|
| Despliegue | No hay servidor, contenedor ni nube. La decisión de ADR-001 (nube) no se ha ejecutado |
| Vulnerabilidades de herramientas de desarrollo (H-06) | El 14/11/2026 eran 14, todas de desarrollo; no se corrigieron porque `npm audit fix --force` proponía versiones incompatibles |
| Vulnerabilidades detectadas después | El 26/11/2026 `npm audit` reporta 28 en total (3 bajas, 16 moderadas, 9 altas). De ellas, **9 están en dependencias de producción** (4 moderadas, 5 altas), según `npm audit --omit=dev`. Sin corregir: requieren cambios de versión mayor en NestJS. Antes de cualquier despliegue hay que resolverlas |
| Registros y monitoreo | No hay registro de errores ni medición de disponibilidad (RNF-04) |
| Acceso y datos personales | No hay inicio de sesión, límite de peticiones ni aviso de tratamiento de datos (Ley 1581 de 2012) |
| Respaldos | Probar y automatizar |
