# Bitácora de uso de IA – Semana 5 (HU-02, calcularPrecio)

Asistente usado: Claude. Proyecto: Dina Express (Node.js, TypeScript y Jest).

## Entrada 1
- **Fecha:** 7 de noviembre de 2026
- **Sugerencia:** Crear primero `calcularPrecio` solo con la firma y un `throw new Error('No implementado')`, para que las pruebas fallen por la razón correcta antes de programar.
- **Decisión:** Aceptada
- **Por qué:** Si las pruebas no fallan antes de la implementación, no se sabe si de verdad comprueban algo.
- **Verificación:** Ejecuté `npm test` y fallaron las 7 pruebas; después hice el commit «Pruebas de calcularPrecio HU-02 (en rojo)».

## Entrada 2
- **Fecha:** 7 de noviembre de 2026
- **Sugerencia:** Instalar versiones fijas de las herramientas: `typescript@5`, `jest@29`, `ts-jest@29` y `@types/jest@29`.
- **Decisión:** Aceptada
- **Por qué:** Con versiones fijas evito incompatibilidades entre Jest, ts-jest y TypeScript que me harían perder tiempo.
- **Verificación:** `npm install` terminó sin errores y las pruebas se ejecutaron con `npm test`.

## Entrada 3
- **Fecha:** 7 de noviembre de 2026
- **Sugerencia:** Crear el script de pruebas con `npm pkg set scripts.test=jest`.
- **Decisión:** Ajustada
- **Por qué:** Al ejecutar `npm test` salió «Missing script: "test"»; el comando no había quedado en el `package.json`.
- **Verificación:** Revisé el archivo con `type package.json`, volví a configurar el script y comprobé que aparecía `"test": "jest"`. Después `npm test` ya corrió.

## Entrada 4
- **Fecha:** 7 de noviembre de 2026
- **Sugerencia:** Implementar `calcularPrecio` con un ciclo sobre los seis conceptos: lanza error si falta uno, lanza error si no es un entero de 0 o más, y suma los valores.
- **Decisión:** Aceptada
- **Por qué:** Es la versión más simple que cumple el contrato y los dos escenarios de HU-02, y puedo explicarla línea por línea.
- **Verificación:** `npm test` mostró 7 pruebas pasando, sin modificar ninguna prueba. Hice el commit de pruebas en verde.

## Entrada 5
- **Fecha:** 7 de noviembre de 2026
- **Sugerencia:** Refactorizar `calcularPrecio` separando una función `validarConcepto` y reemplazando el ciclo por `reduce`.
- **Decisión:** Aceptada
- **Por qué:** `calcularPrecio` queda solo con la suma y la validación tiene nombre propio. Se quita la variable `total` que se modificaba en el ciclo.
- **Verificación:** Ejecuté `npm test` con las mismas 7 pruebas sin tocarlas y siguieron en verde. Este cambio quedó incluido en un commit anterior al del refactor final; en un segundo refactor, en su propio commit, dejé los textos de error en funciones y la condición como `esEnteroNoNegativo`, y volví a comprobar las 7 pruebas.

## Entrada 6
- **Fecha:** 7 de noviembre de 2026
- **Sugerencia:** Convertir `calcularPrecio` en un servicio de NestJS con inyección de dependencias.
- **Decisión:** Rechazada
- **Por qué:** Para una función pura de seis sumas es sobreingeniería: agrega clases y módulos que las pruebas actuales no necesitan. Se hará cuando construya la API.
- **Verificación:** Mantuve la función simple y comprobé que las 7 pruebas pasan sin ese cambio.

## Reflexión final
El asistente me ayudó más a armar el contrato y las pruebas a partir de los criterios Gherkin de HU-02, porque ya tenía los números del ejemplo ($880.000) y pude convertirlos en pruebas rápido. En la fase en rojo, las 7 pruebas fallaron como se esperaba, lo que confirmó que probaban algo real. Las pruebas también me sirvieron en el refactor: demostraron que cambiar el código no cambió su comportamiento. Lo que más tiempo me quitó fue la configuración del entorno, con el error del script de pruebas. En la próxima funcionalidad ejecutaría `npm test` con una prueba mínima antes de escribir el resto. También le preguntaría a la clienta si la ganancia es un valor fijo o un porcentaje, porque mi contrato asume un valor fijo.