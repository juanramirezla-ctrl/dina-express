# Informe de revisión de código y seguridad

Proyecto: Dina Express
Estudiante: Juan José Ramírez Lasso
Fecha: 2026-11-14
Commit revisado: c0a3722

## 1. Herramientas y criterios

- **Linter:** ESLint 9.39.5 con typescript-eslint 8.72.2 y eslint-plugin-security 3.0.1. Configuración en `backend/eslint.config.mjs`; se ejecuta con `npm run lint`. Antes de corregir dio 2 avisos (calcular-precio.ts, 39:29 y 40:20, regla security/detect-object-injection); después queda sin avisos.
- **Auditoría de dependencias:** npm audit. Resultado: 14 vulnerabilidades (7 bajas, 7 moderadas), todas en dependencias de desarrollo (ver H-06).
- **Lista de revisión:** la de la semana 6 (corrección y pruebas, diseño y legibilidad, seguridad).
- **Revisión con IA:** Claude con el prompt de revisión de la semana (ver sección 3 y la bitácora).

### Puntos de seguridad revisados

| Punto | ¿Aplica? | Resultado |
|---|---|---|
| Inyección (consultas con parámetros) | No todavía: el código no ejecuta consultas SQL; solo hay un script de esquema estático | Sin hallazgos. Al conectar PostgreSQL se usarán consultas con parámetros |
| Secretos (código, historial, .gitignore, .env.example) | Sí | `.env` está en `.gitignore`. La búsqueda en el historial solo encontró `js-tokens`, un paquete del package-lock.json (falso positivo). Se agregó `.env.example` (H-04) |
| Contraseñas (scrypt, bcrypt o argon2 con sal) | No todavía: el código no guarda contraseñas; la tabla `usuario` ya usa la columna `clave_hash` | Sin hallazgos. Al hacer el inicio de sesión se usará argon2 o bcrypt |
| Control de acceso (rol verificado y prueba de abuso) | No todavía: no hay operaciones restringidas en el código | Sin hallazgos. Las pruebas de abuso de este incremento son de validación de entradas (H-01, H-02) |
| Dependencias (existen, necesarias, versión fijada, npm audit) | Sí | Todas existen y son herramientas de desarrollo necesarias (compilador, pruebas, linter). Versiones fijadas (H-03). npm audit encontró vulnerabilidades en dependencias de desarrollo (H-06) |

## 2. Tabla de hallazgos

| Id | Archivo y línea | Problema | Categoría | Severidad | Corrección | Commit |
|---|---|---|---|---|---|---|
| H-01 | backend/src/precio/calcular-precio.ts:39 | Si `conceptos` es `undefined` o `null` falla con TypeError sin mensaje claro | Validación de entradas | Media | Validar que sea un objeto y prueba de abuso | 475b155 |
| H-02 | backend/src/precio/calcular-precio.ts:25 | `Number.isInteger` acepta enteros enormes (1e300) y la suma puede perder precisión | Validación de entradas | Media | `Number.isSafeInteger` y comprobar el total, con pruebas | 475b155 |
| H-03 | backend/package.json | Dependencias con versión flexible (^) | Dependencias | Baja | Versiones exactas | b5dd7fb |
| H-04 | raíz del repositorio | Faltaba `.env.example`; además la regla `.env.*` del `.gitignore` lo ignoraba | Secretos y configuración | Baja | Se creó sin valores reales y se agregó `!.env.example` | 2d3939f |
| H-05 | backend/ts.config.json | El archivo de configuración de TypeScript tenía mal el nombre y no se aplicaba (sin modo estricto) | Configuración | Media | Renombrado a tsconfig.json; las 12 pruebas y el linter siguen en verde | cec81ec |
| H-06 | backend/package-lock.json | npm audit: 14 vulnerabilidades en dependencias de desarrollo: deepmerge vía jest y ts-jest (GHSA-gcqx-w48m-w2h4, contaminación de prototipos) y minimatch vía typescript-eslint (GHSA-g3hv-75wg-m249, denegación de servicio) | Componentes vulnerables | Media | No corregido: `npm audit fix --force` propone instalar jest@25.1.0 y typescript-eslint@8.36.0, cambios incompatibles con el proyecto. Solo afectan herramientas de desarrollo, no el código que se entrega | Pendiente |

**Severidad:** alta (permite acceder o cambiar datos sin permiso, o expone secretos), media (error probable o riesgo con condiciones), baja (estilo o mantenibilidad).

H-01 y H-02 se confirmaron antes de corregir: sus pruebas de abuso fallaron en rojo con el código anterior (commit 28b67a7; 4 pruebas fallaron) y pasan después de la corrección. En una carpeta limpia pasan las 12 pruebas y el linter queda sin avisos.

### Avisos del linter no corregidos

| Regla | Archivo y línea | Por qué se mantiene |
|---|---|---|
| security/detect-object-injection | backend/src/precio/calcular-precio.ts:90 | La clave `nombre` sale de la constante `NOMBRES_CONCEPTOS`, no de datos del usuario. Está justificado en un comentario junto a la línea |

## 3. Revisión con IA

**Prompt usado:** revisión de `calcular-precio.ts` con corrección y pruebas, diseño y legibilidad y seguridad; tabla con línea y severidad; separar problemas seguros de sospechas. Redactado con ayuda de Claude y ejecutado en una conversación (entrada 7 de la bitácora).

| Hallazgo de la IA | ¿Real o falso positivo? | Cómo lo verifiqué |
|---|---|---|
| `conceptos` nulo o indefinido falla con TypeError (líneas 39 y 40) | Real (H-01) | Las pruebas de abuso 1 y 2 fallaron con el código anterior |
| `Number.isInteger` acepta 1e300 y la suma pierde precisión (línea 25) | Real (H-02) | Las pruebas de abuso 3 y 4 fallaron con el código anterior |
| Acceso dinámico `conceptos[nombre]` como inyección de objetos | Falso positivo | `nombre` viene de la constante `NOMBRES_CONCEPTOS`; el linter también lo marcó y quedó justificado |
| Mensajes de error que interpolan `nombre` | Falso positivo | `nombre` es una constante interna, no entrada del usuario |
| No hay tope máximo de negocio para el precio | Sospecha, no se corrige | La clienta no lo ha pedido; no se inventa un requisito. Va a pendientes |

**Lo que la IA no encontró:** la revisión recibió un solo archivo, así que no vio problemas del repositorio completo. Los encontré yo con comandos y capturas: faltaba `.env.example` (H-04), las dependencias tenían versiones flexibles (H-03), `npm audit` mostró vulnerabilidades en herramientas de desarrollo (H-06) y el archivo de TypeScript estaba mal nombrado (H-05). También la IA me dio una regla `.env.*` en el `.gitignore` que ignoraba el `.env.example`, error que detecté porque Git dijo «nothing to commit».

## 4. Pendientes

| Pendiente | Por qué no se corrigió todavía | Plan |
|---|---|---|
| Vulnerabilidades de dependencias de desarrollo (H-06) | El arreglo automático degrada Jest y typescript-eslint a versiones incompatibles; son herramientas de desarrollo | Volver a ejecutar `npm audit` y actualizar cuando salgan versiones corregidas de jest y typescript-eslint |
| Control de acceso por rol (RNF-01) | La API aún no existe | Al crear la API con NestJS: verificar el rol en cada operación y agregar una prueba de abuso |
| Consultas con parámetros y contraseñas con argon2 o bcrypt | El código aún no usa la base de datos ni el inicio de sesión | Aplicarlos al conectar PostgreSQL y al hacer el login |
| Tope máximo de negocio para el precio | No hay requisito de la clienta | Preguntarle si existe un límite |
| Error de decoradores al arrancar la API base con NestJS | Quedó sin resolver; los archivos están guardados aparte (git stash) | Corregir la configuración de TypeScript en el siguiente incremento |

**Claves expuestas:** Ninguna.

## 5. Actualización del 26 de noviembre de 2026

Las secciones anteriores describen el estado del 14/11, antes de que existieran la API y la base de datos.

| Id | Problema | Severidad | Estado |
|---|---|---|---|
| H-07 | `npm audit` reporta 28 vulnerabilidades (3 bajas, 16 moderadas, 9 altas). **9 están en dependencias de producción** (4 moderadas, 5 altas), según `npm audit --omit=dev`; entre ellas, paquetes que usa NestJS. La frase de H-06 «solo afectan herramientas de desarrollo» ya no es válida para el proyecto | Alta | Pendiente: corregirlas requiere cambios de versión mayor. No desplegar antes de resolverlas |

Otros pendientes actuales: `POST /viajes` no pide autorización de tratamiento de datos ni limita peticiones; no hay inicio de sesión ni roles (RNF-01). Las consultas ya usan parámetros.

## 6. Revisión de la web y la flota (26 de noviembre de 2026)

Controles aplicados: consultas con parámetros; validación en la API; clave de la coordinadora comparada en tiempo constante y que no deja pasar si está sin configurar; reserva del vehículo en una sola consulta; Angular escapa el texto que muestra. La web no tiene vulnerabilidades reportadas por `npm audit`.

| Id | Problema | Severidad | Estado |
|---|---|---|---|
| H-08 | `POST /viajes` es público y sin límite: alguien podría reservar todos los vehículos con solicitudes falsas | Alta | Pendiente |
| H-09 | Una sola clave compartida, sin usuarios, roles ni registro de quién hizo qué; sin límite de intentos | Alta | Pendiente (RNF-01) |
| H-10 | La autorización de datos se exige en la web, pero no se guarda y la API no la pide | Media | Pendiente |
| H-11 | `/vehiculos/disponibles` muestra la placa a cualquier persona | Baja | Decisión del alcance; confirmar con la empresa |
| H-12 | Sin HTTPS (solo ejecución local) | Alta antes de desplegar | Pendiente |
