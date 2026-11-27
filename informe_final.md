# Informe final del proyecto integrador

**Proyecto:** Sistema de solicitud y gestión de servicios de transporte para Dina Express
**Estudiante:** Juan José Ramírez Lasso
**Repositorio:** <https://github.com/juanramirezla-ctrl/dina-express>
**Fecha:** 2026-11-26

## 1. Resumen

Dina Express transporta sobre todo para empresas del sector petrolero; sus vehículos quedan parados y no capta viajes ocasionales de personas naturales. Construí un primer incremento en Ionic, NestJS y PostgreSQL: el cliente ve los vehículos libres, elige uno y envía su solicitud; la coordinadora ve las solicitudes y administra la flota. Usé IA en las seis fases y verifiqué con pruebas, linter, citas de la clienta, pruebas contra la base real y auditoría. Resultado: 143 pruebas de la API y 23 de la web pasan y el pipeline está en verde, pero encontré errores de la IA en validación, pruebas, diseño y operación. No hay despliegue.

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
| 4. Código | `calcularPrecio`, API, web, panel, reserva, diseño visual y revisión de seguridad | Claude | [bitácora](https://github.com/juanramirezla-ctrl/dina-express/blob/main/bitacora_ia.md) (entradas 1 a 11, 16 y 17), [revisión](https://github.com/juanramirezla-ctrl/dina-express/blob/main/revision_seguridad.md), commits [f1ca0b0](https://github.com/juanramirezla-ctrl/dina-express/commit/f1ca0b0), [5164047](https://github.com/juanramirezla-ctrl/dina-express/commit/5164047) y [165b8b2](https://github.com/juanramirezla-ctrl/dina-express/commit/165b8b2), entradas 21 a 24 | Pruebas en rojo antes del código, ESLint, pruebas contra PostgreSQL y revisión en el navegador |
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

### Otros hallazgos

- La regla `.env.*` sugerida para `.gitignore` también ignoraba `.env.example`. Lo noté porque Git dijo «nothing to commit» (commit [2d3939f](https://github.com/juanramirezla-ctrl/dina-express/commit/2d3939f)).
- La IA integró `flota/disponibilidad.ts` sin pruebas, contra la metodología. La medición de cobertura mostró 0 %; las pruebas se agregaron después (commit [4718509](https://github.com/juanramirezla-ctrl/dina-express/commit/4718509)).
- Claude Code dejó encendida una copia antigua de la API. Mi clave correcta era rechazada; al comparar la hora de arranque del proceso con la de guardado del `.env` se vio que no la había leído. Se cerró el proceso (bitácora, entrada 22).
- En requisitos, las cifras de rendimiento y disponibilidad (5 segundos, 99 %) no las dijo la clienta; quedaron marcadas como propuestas y como preguntas P-07 y P-08.

## 5. Estado final del sistema

### Arquitectura

ADR-001: monolito con frontend Ionic y Angular, backend Node.js y PostgreSQL en la nube. La matriz dio 82 puntos al monolito y 81 a microservicios, una diferencia mínima; pesaron la menor complejidad de despliegue y el costo ([diseño y ADR](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/03_diseno_y_adr.md)).

Lo construido: web en Ionic y Angular, API en NestJS con consultas parametrizadas y PostgreSQL, todo en un computador local. Frente al diseño: no hay nube, chatbot, WhatsApp automático, mapas ni usuario conductor; `POST /viajes` recibe los datos del solicitante y el vehículo elegido. La web ofrece al cliente consultar y reservar un vehículo, y a la coordinadora un panel protegido por clave.

### Historias Must y relacionadas

| Historia | Estado real | Evidencia |
|---|---|---|
| HU-01 Solicitar un viaje | **Terminada**: web y API | [viajes/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/viajes), [web](https://github.com/juanramirezla-ctrl/dina-express/tree/main/frontend/src/app/home) |
| HU-02 Calcular precio | Función probada, sin ruta ni pantalla | [precio/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/precio) |
| HU-03 Disponibilidad de vehículos | **Terminada**: registrar, marcar y rechazar placa repetida | [flota/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/flota), [panel](https://github.com/juanramirezla-ctrl/dina-express/tree/main/frontend/src/app/panel) |
| HU-04 Disponibilidad de conductores | Parcial: función probada, sin pantalla | [disponibilidad.ts](https://github.com/juanramirezla-ctrl/dina-express/blob/main/backend/src/flota/disponibilidad.ts) |
| HU-05 Orden de la lista (Should) | Parcial: el último liberado va primero; falta el escenario «sin servicio en curso» | [flota/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/flota) |
| HU-06 Anticipo del 50 % | Parcial: cálculo probado; no registra cédula ni pago | [pagos/](https://github.com/juanramirezla-ctrl/dina-express/tree/main/backend/src/pagos) |

Además se agregaron, a partir de lo que pedí al probar: lista de solicitudes para la coordinadora, reserva del vehículo elegido y cancelación que lo libera. El sistema no incluye pasarela de pagos.

### Pruebas

- **143 pruebas en la API** (15 grupos) y **23 en la web** (6 grupos), todas pasan; linter sin avisos.
- **Cobertura de líneas de la lógica del negocio de la API: 91 %** (`precio` y `pagos` 100 %, `viajes` 96 %, `flota` 83 %), medida con Jest el 26/11. Los controladores de rutas son lo menos cubierto. No medí la cobertura de la web.
- La reserva se probó además contra PostgreSQL: 201, 409 al pedir el mismo vehículo, 401 sin clave y vehículo libre tras cancelar.
- Última ejecución del pipeline al escribir: [#13, en verde](https://github.com/juanramirezla-ctrl/dina-express/actions/runs/45922940082). Todas: [Actions](https://github.com/juanramirezla-ctrl/dina-express/actions).

### Pendientes y por qué

| Pendiente | Por qué |
|---|---|
| Pantallas de precio, conductores, anticipo y reembolso | No alcanzó el tiempo; existen como funciones |
| Usuarios y roles (RNF-01, HU-10) | Solo hay una clave compartida |
| Límite de solicitudes y vencimiento de reservas | Hoy alguien podría bloquear la flota con solicitudes falsas (H-08) |
| Vulnerabilidades de la API (H-06 y H-07) | Requieren cambios de versión mayor |
| Despliegue y restauración de respaldo | No hay servidor; el respaldo se hizo, la restauración no se probó |
| RNF-02, RNF-03 y RNF-04 | La web se revisó en tamaño de celular, pero no se midieron tiempos ni disponibilidad |

## 6. Reflexión ética y legal

| Principio | Decisión en mi proyecto | Evidencia |
|---|---|---|
| Datos personales (Ley 1581 de 2012) | Datos ficticios en pruebas y documentos; `.env` fuera del repositorio; consultas parametrizadas; la web informa la finalidad y exige autorización; las solicitudes solo se ven con clave. **Falta** guardar la autorización, permitir consultar y borrar datos y usar usuarios con roles. Con datos reales no debe usarse todavía | [home](https://github.com/juanramirezla-ctrl/dina-express/tree/main/frontend/src/app/home), [revisión, H-09 y H-10](https://github.com/juanramirezla-ctrl/dina-express/blob/main/revision_seguridad.md) |
| Sesgo | Se muestra primero el vehículo liberado más recientemente (regla de la clienta). Puede concentrar el trabajo en los mismos vehículos y conductores; falta revisarlo con ella. La reserva la gana quien llega primero | [flota.service.ts](https://github.com/juanramirezla-ctrl/dina-express/blob/main/backend/src/flota/flota.service.ts) |
| Transparencia | Declaro el uso de IA en README, bitácora e informe, incluidos sus errores. El producto no usa IA para decidir sobre nadie | [bitácora](https://github.com/juanramirezla-ctrl/dina-express/blob/main/bitacora_ia.md) |
| Responsabilidad | Respondo por el código aunque lo haya propuesto la IA. La coordinadora decide: revisa, contacta y elimina la solicitud. Los supuestos quedan marcados | [panel](https://github.com/juanramirezla-ctrl/dina-express/tree/main/frontend/src/app/panel), [registro de pruebas](https://github.com/juanramirezla-ctrl/dina-express/blob/main/registro_pruebas.md) |
| Propiedad intelectual y política de uso | Logo, foto y textos de la empresa usados con su autorización; sin logos de empresas clientes. Dependencias de la API con licencia MIT o Apache-2.0; no revisé una por una las de la web. **No revisé a fondo los términos de los asistentes** y la empresa no tiene política escrita de IA | [README](https://github.com/juanramirezla-ctrl/dina-express#8-autor-y-licencia) |

**El dilema principal: evidencia contra privacidad.** La entrega pide enlazar la evidencia de cada fase en un repositorio público y, a la vez, que no haya datos personales reales. Mis documentos originales tenían un nombre propio y un número de teléfono, y las citas de la entrevista son palabras de una persona real. Publicarlos tal cual daba mejor evidencia; no publicarlos protegía a las personas pero dejaba afirmaciones sin respaldo. Decidí publicar versiones sin nombres ni teléfonos, conservar textuales solo las frases que justifican requisitos, declarar en cada documento qué se quitó y no subir grabaciones ni capturas. El costo es que esas versiones no son idénticas a las originales. Queda una limitación: los textos originales sí pasaron por asistentes de IA, y la próxima vez los limpiaría antes de compartirlos.

## 7. Aprendizajes

**Qué sé hacer ahora.** Escribir pruebas antes del código y verlas fallar por la razón correcta; usar casos límite y tablas de decisión; conectar una web, una API y PostgreSQL con consultas parametrizadas; reservar un recurso sin que dos personas lo tomen a la vez; trabajar con ramas, pull requests y un pipeline.

**En qué confié de más.** En que una afirmación seguía siendo cierta porque lo fue una vez (las vulnerabilidades), en una regla de `.gitignore` que parecía obvia, en integrar la función de flota sin pruebas y en dar por cerrados procesos que seguían encendidos.

**Qué aprendí sobre la IA.** Sirve más cuando le doy contexto y restricciones. Su respuesta es un punto de partida: la verificación es una prueba, un comando o una frase de la clienta.

**Qué haría distinto.** Preguntar a la clienta lo que hoy son supuestos (si la ganancia es fija o porcentaje, cuánto se reembolsa), construir una historia completa de extremo a extremo desde el principio, y no dejar la web para el final, guardar el texto exacto de cada prompt y revisar la auditoría en cada cambio de dependencias.

## 8. Anexos

- Bitácora de uso de IA: [bitacora_ia.md](https://github.com/juanramirezla-ctrl/dina-express/blob/main/bitacora_ia.md)
- Módulo 1: [propuesta](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/01_propuesta.md)
- Módulo 2: [requisitos](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/02_requisitos.md)
- Módulo 3: [diseño y ADR](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/03_diseno_y_adr.md)
- Módulo 4: [revisión de código y seguridad](https://github.com/juanramirezla-ctrl/dina-express/blob/main/revision_seguridad.md)
- Módulo 5: [registro y plan de pruebas](https://github.com/juanramirezla-ctrl/dina-express/blob/main/registro_pruebas.md)
- Módulo 6: [guía de ejecución](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/04_guia_ejecucion_local.md) y [plan de operación](https://github.com/juanramirezla-ctrl/dina-express/blob/main/docs/05_plan_operacion.md)
