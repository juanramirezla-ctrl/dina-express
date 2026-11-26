# Informe final del proyecto integrador

**Proyecto:** Sistema de solicitud y gestión de servicios de transporte para Dina Express
**Estudiante:** Juan José Ramírez Lasso
**Repositorio:** <https://github.com/juanramirezla-ctrl/dina-express>
**Fecha:** 2026-11-26

## 1. Resumen

Dina Express transporta sobre todo para empresas del sector petrolero; sus vehículos quedan parados y no capta viajes ocasionales de personas naturales. Construí el primer incremento: una API en NestJS con PostgreSQL que recibe solicitudes de viaje, y funciones de precio, anticipo, reembolso y disponibilidad. Usé IA en las seis fases. Verifiqué con pruebas, linter, revisión contra las citas de la clienta y auditoría de dependencias. Resultado: 107 pruebas pasan y el pipeline está en verde, pero encontré errores de la IA en validación, pruebas, diseño y en un dato de seguridad desactualizado. No hay interfaz web ni despliegue.

## 2. Problema y usuario

**Quién lo tiene.** La empresa y, en el día a día, su coordinadora de transporte. El usuario externo es la persona natural que necesita un viaje ocasional.

**Cómo se resolvía antes.** Según la entrevista de 17 minutos, las solicitudes llegan 90 % por WhatsApp y 10 % por correo; la coordinadora atiende las 24 horas desde un celular; la disponibilidad de vehículos y conductores se lleva en un listado y la documentación en físico ([requisitos](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/02_requisitos.md)). La clienta pidió «que el proceso no depende 100% de la persona encargada».

**Qué necesita.** Recibir solicitudes por la web, calcular el precio con seis conceptos, saber qué vehículos y conductores están libres y manejar el anticipo del 50 % ([necesidades con cita](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/02_requisitos.md)).

**De la propuesta al alcance final.** Mi [propuesta del módulo 1](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/01_propuesta.md) planteaba la subutilización de la flota y un chatbot o una API de cotización con IA. **Ninguno de los dos se construyó ni hace parte del alcance final:** la clienta no los mencionó. El producto no usa IA; la IA se usó para construirlo.

La persona entrevistada autorizó grabar la llamada y, según confirmé, usar sus respuestas con IA.

## 3. La IA en el ciclo de vida

| Módulo y fase | Qué hice con IA | Herramienta | Evidencia | Cómo verifiqué |
|---|---|---|---|---|
| 1. Fundamentos | Prototipar una página y explorar el problema con diez prompts | Asistente de IA | [propuesta](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/01_propuesta.md) | Comparé cada respuesta con lo pedido: usó HTML, CSS y JavaScript y no Ionic y Angular, y al principio no era de la empresa |
| 2. Requisitos | Necesidades, historias, Gherkin, RNF, MoSCoW y trazabilidad | Claude | [requisitos](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/02_requisitos.md) | Cada necesidad debía tener una frase de la clienta; lo demás pasó a preguntas pendientes |
| 3. Diseño | Alternativas, diagramas C4, modelo de datos y API | Claude y ChatGPT | [diseño y ADR](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/03_diseno_y_adr.md), [esquema](https://github.com/juanramirezla-ctrl/dina-express/blob/main/database/01_esquema.sql) | Matriz ponderada, revisión de cardinalidades y de rutas REST |
| 4. Código | `calcularPrecio`, conexión a PostgreSQL, HU-01 y revisión de seguridad | Claude | [bitácora](https://github.com/juanramirezla-ctrl/dina-express/blob/main/bitacora_ia.md) (entradas 1 a 11, 16 y 17), [revisión](https://github.com/juanramirezla-ctrl/dina-express/blob/main/revision_seguridad.md), commit [f1ca0b0](https://github.com/juanramirezla-ctrl/dina-express/commit/f1ca0b0) | Pruebas en rojo antes del código, ESLint con reglas de seguridad |
| 5. Pruebas | Tablas de casos, pruebas parametrizadas y datos sintéticos | Claude | [registro de pruebas](https://github.com/juanramirezla-ctrl/dina-express/blob/main/registro_pruebas.md), commits [affc6c1](https://github.com/juanramirezla-ctrl/dina-express/commit/affc6c1) y [0a87bd5](https://github.com/juanramirezla-ctrl/dina-express/commit/0a87bd5), entradas 12 a 15 | Descarté redundantes, calculé a mano los esperados y rompí el código cuatro veces |
| 6. Operación | Pipeline, guía de ejecución y plan de operación | Claude y Claude Code | [ci.yml](https://github.com/juanramirezla-ctrl/dina-express/blob/main/.github/workflows/ci.yml), [ejecución #3](https://github.com/juanramirezla-ctrl/dina-express/actions/runs/45732714722), [guía](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/04_guia_ejecucion_local.md), [plan](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/05_plan_operacion.md), entradas 18 a 20 | Ejecuciones en verde, rutas probadas con `curl`, respaldo con `pg_dump` |

La guía y el plan de operación se escribieron al cierre, con ayuda de IA.

## 4. Verificación: lo que la IA hizo mal y cómo lo encontré

### Caso 1: la función de precio aceptaba entradas que la rompían

- **Fase:** código.
- **Qué propuso la IA:** implementar `calcularPrecio` recorriendo los seis conceptos y validando con `Number.isInteger` (entradas 4 y 5 de la bitácora).
- **Qué estaba mal:** sin objeto de conceptos fallaba con un `TypeError` sin mensaje útil, y aceptaba valores como `1e300`, con los que la suma pierde precisión. En un precio, eso es un cobro erróneo.
- **Cómo lo detecté:** una revisión de seguridad con IA señaló los dos puntos. No los di por ciertos: escribí pruebas de abuso y cuatro fallaron con el código anterior (commit en rojo [28b67a7](https://github.com/juanramirezla-ctrl/dina-express/commit/28b67a7)). De las demás sospechas, dos eran falsos positivos y una pedía un tope de precio que la clienta nunca mencionó.
- **Qué hice:** `Number.isSafeInteger`, validación del objeto y del total (commit [475b155](https://github.com/juanramirezla-ctrl/dina-express/commit/475b155); hallazgos H-01 y H-02).

### Caso 2: pruebas que sumaban número pero no protegían más

- **Fase:** pruebas.
- **Qué propuso la IA:** 57 pruebas nuevas, para un total de 70 (entrada 13).
- **Qué estaba mal:** 8 eran redundantes: repetían entradas y esperados de pruebas que ya existían, o recorrían la misma rama.
- **Cómo lo detecté:** apliqué a cada una tres preguntas: ¿el esperado sale de la regla?, ¿fallaría si rompo el código?, ¿cubre algo que ninguna otra cubre?
- **Qué hice:** las descarté y anoté cada razón ([registro, sección 2](https://github.com/juanramirezla-ctrl/dina-express/blob/main/registro_pruebas.md); commit [affc6c1](https://github.com/juanramirezla-ctrl/dina-express/commit/affc6c1)). Quedaron 62. Después introduje cuatro errores a propósito y las pruebas detectaron los cuatro (entrada 15).

### Caso 3: el modelo impedía los viajes pendientes

- **Fase:** diseño.
- **Qué propuso la IA:** una relación obligatoria 1 a 1 entre viaje y conductor, y microservicios desde el primer día.
- **Qué estaba mal:** una solicitud recién llegada todavía no tiene conductor, así que no se podría guardar. Los microservicios eran sobreingeniería para este tamaño.
- **Cómo lo detecté:** contrasté el modelo con el flujo: la solicitud entra antes de asignar.
- **Qué hice:** cardinalidad N a 0..1 y monolito ([diseño, prompts 1 y 3](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/03_diseno_y_adr.md)). En el esquema, `id_conductor` admite nulo (commit [f291e87](https://github.com/juanramirezla-ctrl/dina-express/commit/f291e87)). Por eso HU-01 pudo guardar viajes sin conductor.

### Caso 4: un dato de seguridad que ya no era cierto

- **Fase:** operación.
- **Qué propuso la IA:** al preparar el cierre, un resumen hecho con IA indicaba reportar 14 vulnerabilidades, solo en herramientas de desarrollo. Era lo medido el 14/11.
- **Qué estaba mal:** después se agregaron NestJS y `pg`. El 26/11 había 28 vulnerabilidades, **9 en dependencias de producción**. El pipeline seguía en verde porque la auditoría no bloquea.
- **Cómo lo detecté:** antes de cerrar pedí a Claude Code inspeccionar el repositorio sin modificarlo; al ejecutar de nuevo `npm audit` y `npm audit --omit=dev`, las cifras no coincidieron con lo documentado.
- **Qué hice:** registré H-07 y corregí la afirmación ([revisión, sección 5](https://github.com/juanramirezla-ctrl/dina-express/blob/main/revision_seguridad.md)). **No corregí las vulnerabilidades:** requieren cambios de versión mayor que no podía probar bien antes de la entrega.

### Otros hallazgos menores

- La regla `.env.*` sugerida para `.gitignore` también ignoraba `.env.example`. Lo noté porque Git dijo «nothing to commit» (commit [2d3939f](https://github.com/juanramirezla-ctrl/dina-express/commit/2d3939f)).
- En requisitos, las cifras de rendimiento y disponibilidad (5 segundos, 99 %) no las dijo la clienta; quedaron marcadas como propuestas y como preguntas P-07 y P-08.

## 5. Estado final del sistema

### Arquitectura

ADR-001: monolito con frontend Ionic y Angular, backend Node.js y PostgreSQL en la nube. La matriz dio 82 puntos al monolito y 81 a microservicios, una diferencia mínima; pesaron la menor complejidad de despliegue y el costo ([diseño y ADR](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/03_diseno_y_adr.md)).

Lo construido es la parte de servidor: API en NestJS, consultas parametrizadas con `pg` y PostgreSQL local. Frente al diseño: no hay frontend, nube, chatbot, WhatsApp, mapas ni usuario conductor, y `POST /viajes` recibe los datos del solicitante, no un `id_cliente`.

### Historias Must

| Historia | Estado real | Evidencia |
|---|---|---|
| HU-01 Solicitar un viaje | Terminada en la API, sin formulario web | [viajes/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/viajes) |
| HU-02 Calcular precio | Función probada, sin ruta HTTP | [precio/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/precio) |
| HU-03 Disponibilidad de vehículos | Parcial: función que lista disponibles, **sin pruebas** ni ruta | [disponibilidad.ts](https://github.com/juanramirezla-ctrl/dina-express/blob/main/backend/src/flota/disponibilidad.ts) |
| HU-04 Disponibilidad de conductores | Parcial: función que evalúa la asignación, **sin pruebas** ni ruta | mismo archivo |
| HU-06 Anticipo del 50 % | Parcial: cálculo probado; no registra cédula ni pago | [pagos/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/pagos) |

El sistema no incluye pasarela de pagos.

### Pruebas

- **107 pruebas** en 10 grupos, todas pasan; linter sin avisos.
- **Cobertura de líneas de la lógica del negocio: 80 %** (`precio` y `pagos` 100 %, `viajes` 98 %, `flota` 0 %), medida con Jest el 26/11 sobre esas cuatro carpetas.
- Última ejecución en `main` al escribir: [#5, en verde](https://github.com/juanramirezla-ctrl/dina-express/actions/runs/45911244925) (commit 2e93f33). Todas: [Actions](https://github.com/juanramirezla-ctrl/dina-express/actions).

### Pendientes y por qué

| Pendiente | Por qué |
|---|---|
| Frontend Ionic y Angular | No alcanzó el tiempo; prioricé la API, las pruebas y el pipeline |
| Rutas de precio, disponibilidad, anticipo y reembolso | Mismo motivo; existen como funciones |
| Pruebas de `flota` | La función se integró sin ellas, contra mi propia metodología |
| Inicio de sesión y roles (RNF-01, HU-10) | No implementados |
| Vulnerabilidades (H-06 y H-07) | Requieren cambios de versión mayor |
| Despliegue y restauración de respaldo | No hay servidor; el respaldo se hizo, la restauración no se probó |
| RNF-02, RNF-03 y RNF-04 | Sin interfaz ni despliegue no se pueden medir |

## 6. Reflexión ética y legal

| Principio | Decisión en mi proyecto | Evidencia |
|---|---|---|
| Datos personales (Ley 1581 de 2012) | Pruebas y documentos con datos ficticios; quité nombres antes de publicar; `.env` fuera del repositorio; consultas parametrizadas. **Falta** pedir autorización y explicar la finalidad antes de guardar nombre y contacto, y permitir consultar, corregir y borrar. Con datos reales no debe usarse todavía | [datos sintéticos](https://github.com/juanramirezla-ctrl/dina-express/blob/main/backend/tests/fixtures/viajes-sinteticos.ts), [viajes.service.ts](https://github.com/juanramirezla-ctrl/dina-express/blob/main/backend/src/viajes/viajes.service.ts) |
| Sesgo | La regla de la clienta pone primero el vehículo que quedó libre más recientemente. Aplicada sin control, puede concentrar el trabajo en los mismos vehículos y conductores y dejar a otros esperando. La respeté, y la coordinadora debe decidir la asignación; falta revisarlo con la clienta | [disponibilidad.ts](https://github.com/juanramirezla-ctrl/dina-express/blob/main/backend/src/flota/disponibilidad.ts), HU-05 |
| Transparencia | Declaro el uso de IA en README, bitácora e informe, incluidos sus errores. El producto no usa IA para decidir sobre nadie | [bitácora](https://github.com/juanramirezla-ctrl/dina-express/blob/main/bitacora_ia.md) |
| Responsabilidad | Respondo por el código aunque lo haya propuesto la IA. El sistema no asigna ni cobra solo; los supuestos quedan marcados para que la clienta los confirme | [registro de pruebas](https://github.com/juanramirezla-ctrl/dina-express/blob/main/registro_pruebas.md) |
| Propiedad intelectual y política de uso | Dependencias con licencia MIT o Apache-2.0; proyecto de uso académico. No copié en `docs/` los logos de empresas clientes. **No revisé a fondo los términos de uso de los asistentes** y la empresa no tiene una política escrita de IA | [package.json](https://github.com/juanramirezla-ctrl/dina-express/blob/main/backend/package.json), [README](https://github.com/juanramirezla-ctrl/dina-express#8-autor-y-licencia) |

**El dilema principal: evidencia contra privacidad.** La entrega pide enlazar la evidencia de cada fase en un repositorio público y, a la vez, que no haya datos personales reales. Mis documentos originales tenían un nombre propio y un número de teléfono, y las citas de la entrevista son palabras de una persona real. Publicarlos tal cual daba mejor evidencia; no publicarlos protegía a las personas pero dejaba afirmaciones sin respaldo. Decidí publicar versiones sin nombres ni teléfonos, conservar textuales solo las frases que justifican requisitos, declarar en cada documento qué se quitó y no subir grabaciones ni capturas. El costo es que esas versiones no son idénticas a las originales. Queda una limitación: los textos originales sí pasaron por asistentes de IA, y la próxima vez los limpiaría antes de compartirlos.

## 7. Aprendizajes

**Qué sé hacer ahora.** Escribir pruebas antes del código y verlas fallar por la razón correcta; usar casos límite y tablas de decisión; conectar una API a PostgreSQL con consultas parametrizadas; trabajar con ramas, pull requests y un pipeline.

**En qué confié de más.** En que una afirmación seguía siendo cierta porque lo fue una vez (las vulnerabilidades), en una regla de `.gitignore` que parecía obvia y en integrar la función de flota sin pruebas.

**Qué aprendí sobre la IA.** Sirve más cuando le doy contexto y restricciones. Su respuesta es un punto de partida: la verificación es una prueba, un comando o una frase de la clienta.

**Qué haría distinto.** Preguntar a la clienta lo que hoy son supuestos (si la ganancia es fija o porcentaje, cuánto se reembolsa), construir una historia completa de extremo a extremo antes de abrir otras, guardar el texto exacto de cada prompt y revisar la auditoría en cada cambio de dependencias.

## 8. Anexos

- Bitácora de uso de IA: [bitacora_ia.md](https://github.com/juanramirezla-ctrl/dina-express/blob/main/bitacora_ia.md)
- Módulo 1: [propuesta](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/01_propuesta.md)
- Módulo 2: [requisitos](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/02_requisitos.md)
- Módulo 3: [diseño y ADR](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/03_diseno_y_adr.md)
- Módulo 4: [revisión de código y seguridad](https://github.com/juanramirezla-ctrl/dina-express/blob/main/revision_seguridad.md)
- Módulo 5: [registro y plan de pruebas](https://github.com/juanramirezla-ctrl/dina-express/blob/main/registro_pruebas.md)
- Módulo 6: [guía de ejecución](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/04_guia_ejecucion_local.md) y [plan de operación](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/05_plan_operacion.md)
