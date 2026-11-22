# Registro de pruebas: tabla de casos y pruebas de la IA

Proyecto: Dina Express
Estudiante: Juan José Ramírez Lasso
Fecha: 2026-11-21

## 1. Tabla de casos

### Regla 1: calcularPrecio, el precio de un viaje es la suma de sus seis conceptos

**Regla completa (el oráculo):** HU-02 y necesidad N-02. La clienta dijo: «Se calcula con el gasto del vehículo, el del conductor, combustible, mantenimiento y gastos administrativos y una parte de ganancia». El precio es la suma de los seis conceptos, cada uno en pesos enteros de 0 o más. Si falta un concepto, no se calcula y se indica cuál falta (HU-02, escenario 2).

**Ambigüedades encontradas:** la «parte de ganancia» puede ser un valor fijo o un porcentaje (pregunta P-02). Decisión provisional: valor fijo en pesos. Tampoco hay un precio máximo definido por la clienta.

**Tabla de casos**

| Id | Técnica | Caso | Entrada | Esperado | Origen del esperado |
|---|---|---|---|---|---|
| PRE-01 | Partición válida | Ejemplo de HU-02 | 200000, 150000, 300000, 50000, 100000, 80000 | 880000 | HU-02, escenario 1 |
| PRE-02 | Partición válida | Otro viaje | 100000, 80000, 120000, 20000, 30000, 50000 | 400000 | Suma de los seis conceptos |
| PRE-03 | Partición válida | Solo un concepto con valor | vehiculo 500000, los demás en 0 | 500000 | Suma de los seis conceptos |
| PRE-04 | Valor límite | Cada concepto en 0 (último valor válido), 6 casos | Ejemplo con un concepto en 0 | 680000, 730000, 580000, 830000, 780000, 800000 | Suma sin ese concepto |
| PRE-05 | Valor límite | Cada concepto en -1 (primer valor inválido), 6 casos | Ejemplo con un concepto en -1 | Error: El concepto (nombre) debe ser un número entero de 0 o más | Regla: pesos enteros de 0 o más |
| PRE-06 | Partición inválida | Falta un concepto, 6 casos | Ejemplo sin un concepto | Error: Falta el concepto: (nombre) | HU-02, escenario 2 |
| PRE-07 | Partición inválida | Decimal | combustible 1000.5 | Error: El concepto combustible debe ser un número entero de 0 o más | Regla: pesos enteros |
| PRE-08 | Partición inválida | No es un número (NaN) | ganancia NaN | Error: El concepto ganancia debe ser un número entero de 0 o más | Regla: pesos enteros |
| PRE-09 | Partición inválida | Texto | conductor «5000» | Error: El concepto conductor debe ser un número entero de 0 o más | Regla: pesos enteros |
| PRE-10 | Partición inválida | Infinito | mantenimiento Infinity | Error: El concepto mantenimiento debe ser un número entero de 0 o más | Regla: pesos enteros |
| PRE-11 | Valor límite | Total igual al máximo entero seguro | vehiculo 9007199254740991, los demás en 0 | 9007199254740991 | Decisión de diseño (revisión de seguridad H-02) |
| PRE-12 | Valor límite | Total un peso mayor que el máximo | vehiculo 9007199254740991, conductor 1 | Error: El precio total supera el máximo permitido | Decisión de diseño (revisión de seguridad H-02) |

### Regla 2: calcularAnticipoYSaldo, el anticipo es el 50 % del precio y el otro 50 % se paga al terminar

**Regla completa (el oráculo):** HU-06, HU-07 y necesidad N-05. La clienta dijo: «persona natural se pide 50% de anticipo [...] y al finalizar el servicio se le pide el otro 50%». Ejemplo de HU-06: viaje de $880.000, anticipo $440.000, saldo pendiente $440.000.

**Ambigüedades encontradas:** la regla no dice cómo redondear cuando el precio es impar (por ejemplo, $100.001). Decisión provisional: el anticipo es la mitad redondeada hacia abajo y el saldo es el resto, así que anticipo + saldo siempre es igual al precio. Queda como pregunta nueva para la clienta (P-16). Tampoco dice si un viaje de precio $0 es válido; se acepta y da anticipo $0 y saldo $0.

**Tabla de casos**

| Id | Técnica | Caso | Entrada | Esperado | Origen del esperado |
|---|---|---|---|---|---|
| ANT-01 | Partición válida | Precio par, ejemplo de HU-06 | 880000 | anticipo 440000, saldo 440000 | HU-06, escenario 1 |
| ANT-02 | Partición válida | Precio impar | 100001 | anticipo 50000, saldo 50001 | Decisión provisional (redondeo hacia abajo) |
| ANT-03 | Valor límite | Precio 0 (último valor válido) | 0 | anticipo 0, saldo 0 | 50 % de 0 |
| ANT-04 | Valor límite | Precio 1 (primer positivo) | 1 | anticipo 0, saldo 1 | Decisión provisional (redondeo hacia abajo) |
| ANT-05 | Valor límite | Máximo entero seguro | 9007199254740991 | anticipo 4503599627370495, saldo 4503599627370496 | Decisión provisional (redondeo hacia abajo) |
| ANT-06 | Valor límite | Precio -1 (primer valor inválido) | -1 | Error: El precio debe ser un número entero de 0 o más | Regla: pesos enteros de 0 o más |
| ANT-07 | Partición inválida | Decimal | 10.5 | Error: El precio debe ser un número entero de 0 o más | Regla: pesos enteros |
| ANT-08 | Partición inválida | No es número (NaN y texto) | NaN, «880000» | Error: El precio debe ser un número entero de 0 o más | Regla: pesos enteros |
| ANT-09 | Valor límite | Un peso más que el máximo entero seguro | 9007199254740992 | Error: El precio debe ser un número entero de 0 o más | Decisión de diseño |
| ANT-10 | Propiedad | Anticipo + saldo = precio | 0, 1, 2, 99, 100001, 880000 | La suma da el precio | HU-07: el otro 50 % |

### Regla 3: calcularReembolso, qué se devuelve cuando se cancela un servicio

**Regla completa (el oráculo):** HU-08 y necesidad N-06. La clienta dijo: «Si es una empresa no pasa nada. Si es una persona natural se le reembolsa el dinero». HU-08, escenario 1: una persona natural pagó $440.000 y cancela, entonces se reembolsan $440.000. Escenario 2: una persona natural que no ha pagado nada no recibe reembolso y el sistema indica que no hay dinero para devolver.

**Ambigüedades encontradas:** la clienta no dijo si se devuelve todo o hay descuentos (P-11); decisión provisional: se devuelve todo lo pagado. Tampoco dijo qué pasa si se pide un reembolso sin cancelar el servicio; decisión provisional: es un error, porque el reembolso solo existe al cancelar. Si el servicio no está cancelado y además no se pagó nada, la regla no dice qué error se muestra primero; decisión provisional: primero se revisa la cancelación.

**Tabla de decisión (tres condiciones, 8 combinaciones, simplificada a 4 reglas)**

| Regla | Tipo de cliente | ¿Servicio cancelado? | ¿Pagó algo? | Resultado | Casos |
|---|---|---|---|---|---|
| D1 | Persona natural | Sí | Sí | Reembolso = lo pagado | REE-01 |
| D2 | Persona natural | Sí | No | Error: No hay dinero para devolver | REE-02 |
| D3 | Persona natural | No | No importa | Error: El servicio no está cancelado | REE-03, REE-04 |
| D4 | Empresa | No importa | No importa | Reembolso 0 | REE-05 a REE-08 |

**Tabla de casos**

| Id | Técnica | Caso | Entrada | Esperado | Origen del esperado |
|---|---|---|---|---|---|
| REE-01 | Tabla de decisión (D1) | Natural, cancelado, pagó 440000 | persona_natural, 440000, sí | 440000 | HU-08, escenario 1 |
| REE-02 | Tabla de decisión (D2) | Natural, cancelado, no pagó | persona_natural, 0, sí | Error: No hay dinero para devolver | HU-08, escenario 2 |
| REE-03 | Tabla de decisión (D3) | Natural, no cancelado, pagó | persona_natural, 440000, no | Error: El servicio no está cancelado | Supuesto: el reembolso solo existe al cancelar |
| REE-04 | Tabla de decisión (D3) | Natural, no cancelado, no pagó | persona_natural, 0, no | Error: El servicio no está cancelado | Decisión provisional: primero se revisa la cancelación |
| REE-05 a REE-08 | Tabla de decisión (D4) | Empresa, las 4 combinaciones de cancelado y pagó | empresa | 0 | «Si es una empresa no pasa nada» |
| REE-09 | Valor límite | Natural, cancelado, pagó 1 (primer positivo) | persona_natural, 1, sí | 1 | Regla: se devuelve lo pagado |
| REE-10 | Partición inválida | Tipo de cliente desconocido | «otro», 440000, sí | Error: El tipo de cliente no es válido | Regla: solo persona natural o empresa |
| REE-11 | Valor límite | Monto -1 (primer valor inválido) | persona_natural, -1, sí | Error: El monto pagado debe ser un número entero de 0 o más | Regla: pesos enteros de 0 o más |
| REE-12 | Partición inválida | Monto decimal | persona_natural, 100.5, sí | Error: El monto pagado debe ser un número entero de 0 o más | Regla: pesos enteros |
| REE-13 | Partición inválida | Monto NaN | persona_natural, NaN, sí | Error: El monto pagado debe ser un número entero de 0 o más | Regla: pesos enteros |
| REE-14 | Partición inválida | Empresa con monto inválido | empresa, -1, sí | Error: El monto pagado debe ser un número entero de 0 o más | Regla de validación nuestra |

## 2. Pruebas de la IA que corregí o descarté

Se completa en el paso 6, después de revisar cada prueba con las tres preguntas: ¿el esperado sale de la regla?, ¿fallaría si rompo el código?, ¿cubre algo que otra prueba no cubre?

| Prueba | Decisión | Razón | Qué hice en su lugar |
|---|---|---|---|
| PRE-01 | Descartada (redundante) | Misma entrada y mismo esperado que «suma los seis conceptos del ejemplo de HU-02» en src/precio/calcular-precio.spec.ts | Queda cubierta por la prueba original |
| PRE-02 | Descartada (redundante) | Mismos valores y esperado que «calcula el precio de otro viaje» en la suite original | Queda cubierta por la prueba original |
| PRE-04, ganancia en 0 | Descartada (redundante) | Igual a «acepta la ganancia en cero» de la suite original | Se conservan los otros cinco conceptos en 0 |
| PRE-06, falta combustible | Descartada (redundante) | Igual a «rechaza el calculo si falta el combustible» de la suite original | Se conservan los otros cinco conceptos |
| PRE-11 | Descartada (redundante) | Igual a «acepta un total igual al maximo entero seguro» en calcular-precio.seguridad.spec.ts | Queda cubierta por esa prueba |
| PRE-12 | Descartada (redundante) | Igual a «rechaza un total que supera el maximo entero seguro» en calcular-precio.seguridad.spec.ts | Queda cubierta por esa prueba |
| REE-06 y REE-07 | Descartadas (redundantes) | La rama de empresa es una sola; REE-05 y REE-08 ya prueban los dos extremos de la combinación | Se conservan REE-05 y REE-08 |
| ANT-02, ANT-04, ANT-05 | Conservadas, con aviso | El esperado sale de la decisión provisional de redondear hacia abajo, no de la regla del cliente | Marcadas en la tabla y en las ambigüedades; se confirma con la clienta (P-16) |
| REE-03 y REE-04 | Conservadas, con aviso | El esperado sale de un supuesto y de una decisión provisional (primero se revisa la cancelación) | Marcadas en la tabla de decisión |
| REE-14 | Conservada, con aviso | Es una regla de validación nuestra, no del cliente | Marcada como regla de validación nuestra |

## 3. Errores que introduje a propósito

Se completa en el paso 7.

| # | Cambio que hice | Prueba que falló | Caso que agregué | Deshecho con git restore |
|---|---|---|---|---|
| 1 | `Math.floor` por `Math.ceil` en calcularAnticipoYSaldo (calcular-pagos.ts) | ANT-02, ANT-04 y ANT-05 (3 pruebas) | Ninguno, ya la detectaban | Sí |
| 2 | `montoPagado === 0` por `=== 1` en calcularReembolso (calcular-pagos.ts) | REE-09 y REE-02 (2 pruebas) | Ninguno, ya la detectaban | Sí |
| 3 | `valor >= 0` por `valor > 0` en esEnteroSeguroNoNegativo (calcular-pagos.ts) | ANT-03, ANT-10 (precio 0), REE-02, REE-04 y REE-08 (5 pruebas) | Ninguno, ya la detectaban | Sí |
| 4 | `return montoPagado` por `return 440000` en calcularReembolso (calcular-pagos.ts) | REE-09 (1 prueba; REE-01 pasó porque su esperado es justo 440000) | Ninguno, ya la detectaba | Sí |

## 4. Datos de prueba sintéticos

Se completa en el paso 8.

- **Origen:** datos inventados con IA (Claude), con contexto del Huila: rutas entre Neiva, Pitalito, Garzón, La Plata, Campoalegre, Aipe, Rivera, San Agustín y Tello. Ninguna persona es real y los teléfonos (3000000001 a 3000000008) son ficticios. Los resultados esperados los calculé a mano desde las reglas y los comprobé sumando por aparte. Están en `backend/tests/fixtures/viajes-sinteticos.ts`.
- **Casos difíciles incluidos:** tildes y ñ (Nicolás Peña, Íñigo Ñáñez Ávila, Aurora Cañón Rodríguez, Ñeque), apóstrofo (O'Neill, D'Angelo), nombre vacío, viaje con todos los valores en cero, precio impar (500001), un solo concepto con valor, ganancia en cero y empresas.