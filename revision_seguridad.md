# Informe de revisión de código y seguridad

Proyecto: Dina Express
Estudiante: Juan José Ramírez Lasso
Fecha: 2026-11-14
Commit revisado: c0a3722

## 1. Herramientas y criterios

- **Linter:** ESLint [COMPLETA: versión que sale en package.json] con typescript-eslint y eslint-plugin-security. Configuración en `backend/eslint.config.mjs`; se ejecuta con `npm run lint`.
- **Auditoría de dependencias:** npm audit. Resultado: [COMPLETA: «0 vulnerabilidades» o la lista].
- **Lista de revisión:** la de la semana 6 (corrección y pruebas, diseño y legibilidad, seguridad).
- **Revisión con IA:** Claude con el prompt de revisión de la semana (ver sección 3 y la bitácora).

### Puntos de seguridad revisados

| Punto | ¿Aplica? | Resultado |
|---|---|---|
| Inyección (consultas con parámetros) | No todavía: el código no ejecuta consultas SQL; solo hay un script de esquema estático | Sin hallazgos. Pendiente al conectar PostgreSQL: consultas con parámetros |
| Secretos (código, historial, .gitignore, .env.example) | Sí | `.env` está en `.gitignore`; el historial no tiene claves; se agregó `.env.example` (H-04) |
| Contraseñas (scrypt, bcrypt o argon2 con sal) | No todavía: el código no guarda contraseñas; la tabla `usuario` ya usa la columna `clave_hash` | Sin hallazgos. Al hacer el inicio de sesión se usará argon2 o bcrypt |
| Control de acceso (rol verificado y prueba de abuso) | No todavía: no hay operaciones restringidas en el código | Sin hallazgos. Las pruebas de abuso de este incremento son de validación de entradas (H-01, H-02) |
| Dependencias (existen, necesarias, versión fijada, npm audit) | Sí | Todas existen y son herramientas de desarrollo necesarias (compilador, pruebas, linter). Versiones fijadas (H-03). [COMPLETA: resultado de npm audit] |

## 2. Tabla de hallazgos

| Id | Archivo y línea | Problema | Categoría | Severidad | Corrección | Commit |
|---|---|---|---|---|---|---|
| H-01 | backend/src/precio/calcular-precio.ts:39 | Si `conceptos` es `undefined` o `null` falla con TypeError sin mensaje claro | Validación de entradas | Media | Validar que sea un objeto y prueba de abuso | [COMPLETA: hash] |
| H-02 | backend/src/precio/calcular-precio.ts:25 | `Number.isInteger` acepta enteros enormes (1e300) y la suma puede perder precisión | Validación de entradas | Media | `Number.isSafeInteger` y comprobar el total, con pruebas | [COMPLETA: hash] |
| H-03 | backend/package.json | Dependencias con versión flexible (^) | Dependencias | Baja | Versiones exactas | [COMPLETA: hash] |
| H-04 | raíz del repositorio | Faltaba `.env.example` | Secretos y configuración | Baja | Se creó sin valores reales | [COMPLETA: hash] |
| H-05 | backend/ts.config.json | El archivo de configuración de TypeScript tenía mal el nombre (ts.config.json) y no se aplicaba (sin modo estricto) | Configuración | Media | Renombrado a tsconfig.json; las 12 pruebas y el linter siguen en verde | [COMPLETA: hash] |

**Severidad:** alta (permite acceder o cambiar datos sin permiso, o expone secretos), media (error probable o riesgo con condiciones), baja (estilo o mantenibilidad).

H-01 y H-02 se confirmaron antes de corregir: sus pruebas de abuso fallaron en rojo con el código anterior (commit «Pruebas de abuso de calcularPrecio (en rojo)») y pasan después de la corrección.

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
| Acceso dinámico `conceptos[nombre]` como inyección de objetos | Falso positivo | `nombre` viene de la constante `NOMBRES_CONCEPTOS`; el linter lo marcó y quedó justificado |
| Mensajes de error que interpolan `nombre` | Falso positivo | `nombre` es una constante interna, no entrada del usuario |
| No hay tope máximo de negocio para el precio | Sospecha, no se corrige | La clienta no lo ha pedido; no se inventa un requisito. Va a pendientes |

**Lo que la IA no encontró:** la revisión recibió un solo archivo, así que no vio problemas del repositorio completo. Los encontré yo con comandos: faltaba `.env.example` (H-04), las dependencias tenían versiones flexibles con `^` (H-03) y no había un linter configurado.
el nombre incorrecto de tsconfig.json (H-05) y que .gitignore ignoraba .env.example (H-04)

## 4. Pendientes

| Pendiente | Por qué no se corrigió todavía | Plan |
|---|---|---|
| Control de acceso por rol (RNF-01) | La API aún no existe | Al crear la API con NestJS: verificar el rol en cada operación y agregar una prueba de abuso |
| Consultas con parámetros y contraseñas con argon2 o bcrypt | El código aún no usa la base de datos ni el inicio de sesión | Aplicarlos al conectar PostgreSQL y al hacer el login |
| Tope máximo de negocio para el precio | No hay requisito de la clienta | Preguntarle si existe un límite |
| Error de decoradores al arrancar la API base con NestJS | Quedó sin resolver; los archivos están guardados aparte (git stash) | Corregir la configuración de TypeScript en el siguiente incremento |

**Claves expuestas:** Ninguna. [COMPLETA: confirma que la búsqueda en el historial del bloque 3 no mostró claves reales]