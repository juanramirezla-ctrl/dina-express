# Documento de requisitos (módulo 2)

Sistema web de solicitud y gestión de servicios de transporte para Dina Express. 24 de octubre de 2026.

> **Sobre esta versión:** se quitaron los nombres propios del estudiante y de la persona entrevistada. Las citas de la clienta están textuales. Los nombres, cédulas, teléfonos y placas de los escenarios son datos ficticios.

## 1. Introducción

**Propósito:** Dina Express presta servicios de transporte, sobre todo a empresas del sector petrolero. Este sistema web busca que también pueda recibir y gestionar solicitudes de viajes ocasionales de personas naturales, y que los vehículos no queden sin servicio.

**Alcance:** recibir solicitudes de servicio por la página web, calcular el precio de un viaje, llevar la disponibilidad de vehículos y conductores, registrar el anticipo del 50 %, el saldo final y los reembolsos de personas naturales, guardar los documentos en digital y controlar quién puede ver y quién puede editar los datos de los clientes. **Queda fuera:** el asistente virtual (chatbot) y la cotización automática con IA propuestos en mi Trabajo 2, porque la clienta no los mencionó (ver P-01), el pago en línea (P-10) y la conexión con WhatsApp (P-14).

**Cliente:** la coordinadora de transporte de Dina Express, empresa de transporte de carga y pasajeros.

**Entrevista:** 24/10/2026, 17 minutos, por llamada, a la persona encargada de la coordinación de transporte de la empresa.

**Permiso:** la encargada de coordinación de transporte dio autorización de grabar la llamada y responder a las preguntas.

## 2. Actores

| Actor | Qué hace en el sistema | Tipo |
|---|---|---|
| Persona natural (cliente particular) | Solicita un servicio, paga el 50 % de anticipo y el otro 50 % al terminar; si cancela, se le reembolsa. | Persona |
| Empresa cliente | Solicita un servicio entregando su RUT y las especificaciones del servicio. | Persona |
| Coordinadora de transporte | Atiende las solicitudes las 24 horas por el celular de operaciones y lleva el listado de vehículos y conductores. | Persona |
| Relevo de coordinación | Contesta las solicitudes cuando la coordinadora descansa. | Persona |
| Proceso comercial | Es el único que puede digitar y editar los datos de los clientes. | Persona |
| Encargadas del sistema de gestión | Consultan los datos de los clientes, sin editarlos. | Persona |
| Asistente administrativa | Maneja la documentación de los servicios. | Persona |
| Talento humano | Parte del proceso del que la clienta quiere que dependa el servicio; su función está por confirmar (P-05). | Persona |
| Conductores | Se registran como disponibles o en servicio; si usan el sistema está por confirmar (P-06). | Persona |
| WhatsApp y correo electrónico | Canales por los que llegan hoy las solicitudes (90 % y 10 %). | Sistema externo |

## 3. Necesidades con cita

| Id | Necesidad | Cita del cliente | Tipo |
|---|---|---|---|
| N-01 | Que los clientes puedan contactar a la empresa por la página web | «Contacta por la página web a correos y contactos operativos» | Funcional |
| N-02 | Calcular el precio de un viaje con sus costos y una ganancia | «Se calcula con el gasto del vehículo, el del conductor, combustible, mantenimiento y gastos administrativos y una parte de ganancia» | Funcional |
| N-03 | Saber qué vehículos y conductores están en servicio o disponibles | «Llevan un formato de listado de vehículos que ahí se registran los que están en servicio o disponibles y lo mismo para los conductores» | Funcional |
| N-04 | Que el vehículo que queda sin servicio encabece la lista de disponibles | «Queda en standby y queda encabezando la lista de vehículos disponibles para la prestación de servicios» | Funcional |
| N-05 | Pedir los datos y los pagos según el tipo de cliente | «Si es empresa dar el rut y especificaciones de servicio y persona natural se pide 50% de anticipo, cédula y datos para lo del extracto y al finalizar el servicio se le pide el otro 50%» | Funcional |
| N-06 | Reembolsar el dinero a la persona natural que cancela | «Si es una persona natural se le reembolsa el dinero» | Funcional |
| N-07 | Atender las solicitudes las 24 horas | «Hay una persona encargada de coordinación de transporte encargada 24 horas. Hay un celular para operaciones el cual deben contestar siempre» | No funcional |
| N-08 | Que el proceso no dependa solo de la persona encargada | «Que el proceso no depende 100% de la persona encargada, que dependa de talento humano, asistente administrativa para la documentación» | Funcional |
| N-09 | Pasar la documentación de físico a digital | «La documentación se maneja en físico y sería más fácil digital» | Funcional |
| N-10 | Que solo el proceso comercial edite los datos de los clientes | «Todas las encargadas del sistema de gestión pueden visualizarla más no editarla. Solo el proceso comercial lo puede digitar» | No funcional |
| N-11 | Responder a los clientes sin demora y desde el celular | «Se contesta rápido, se hace desde el cel. 90% vía whatsapp y 10% correo» | No funcional |

## 4. Historias de usuario y criterios de aceptación

**HU-01.** Como persona natural, quiero enviar una solicitud de servicio de transporte desde la página web, para que la empresa reciba mi solicitud y me responda. Origen: N-01.
- Escenario 1, solicitud enviada: dado que soy «Camila Rojas» y estoy en la página de solicitud, cuando envío una solicitud de viaje Neiva–Bogotá para el 15/11/2026 con mi teléfono 300 000 0000, entonces veo el mensaje «Solicitud recibida» y la solicitud queda guardada.
- Escenario 2 (error), falta el contacto: dado que estoy llenando la solicitud, cuando intento enviarla sin teléfono ni correo, entonces el sistema no la envía y me pide un dato de contacto.

**HU-02.** Como coordinadora de transporte, quiero calcular el precio de un viaje a partir del gasto del vehículo, el del conductor, el combustible, el mantenimiento, los gastos administrativos y la ganancia, para dar un precio al cliente. Origen: N-02.
- Escenario 1, precio calculado: dado que un viaje tiene vehículo $200.000, conductor $150.000, combustible $300.000, mantenimiento $50.000, gastos administrativos $100.000 y ganancia de $80.000, cuando calculo el precio, entonces el sistema muestra un precio de $880.000.
- Escenario 2 (error), falta un concepto: dado que estoy calculando un viaje, cuando dejo vacío el combustible, entonces el sistema no calcula y me indica que falta el combustible.

**HU-03.** Como coordinadora de transporte, quiero marcar un vehículo como disponible o en servicio, para saber qué vehículos tengo libres. Origen: N-03.
- Escenario 1, vehículo disponible: dado que el vehículo de placa TKX456 está en servicio, cuando lo marco como disponible, entonces aparece en la lista de vehículos disponibles.
- Escenario 2 (error), placa repetida: dado que el vehículo de placa TKX456 ya está registrado, cuando intento registrar otro con la placa TKX456, entonces el sistema no lo registra y me indica que la placa ya existe.

**HU-04.** Como coordinadora de transporte, quiero marcar un conductor como disponible o en servicio, para saber qué conductores tengo libres. Origen: N-03.
- Escenario 1, conductor disponible: dado que el conductor «Pedro Gil» está en servicio, cuando lo marco como disponible, entonces aparece en la lista de conductores disponibles.
- Escenario 2 (error), conductor ocupado: dado que «Pedro Gil» está en servicio, cuando intento asignarlo a otro servicio, entonces el sistema no lo asigna y me avisa que no está disponible.

**HU-05.** Como coordinadora de transporte, quiero que un vehículo que termina un servicio quede de primero en la lista de disponibles, para asignarlo al siguiente servicio. Origen: N-04.
- Escenario 1, vehículo al inicio de la lista: dado que la lista de disponibles es TKX123, TKX456 y TKX789, cuando el vehículo TKX321 termina un servicio y lo marco como finalizado, entonces la lista queda TKX321, TKX123, TKX456 y TKX789.
- Escenario 2 (error), sin servicio en curso: dado que el vehículo TKX321 no tiene un servicio en curso, cuando intento marcarlo como finalizado, entonces el sistema me indica que no tiene servicio en curso y no cambia la lista.

**HU-06.** Como coordinadora de transporte, quiero registrar el anticipo del 50 % de una persona natural con su cédula y los datos para el extracto, para confirmar su servicio. Origen: N-05.
- Escenario 1, anticipo registrado: dado que el servicio de «Camila Rojas» vale $880.000, cuando registro un anticipo de $440.000 con su cédula 1 000 000 000, entonces el saldo pendiente queda en $440.000.
- Escenario 2 (error), falta la cédula: dado que estoy registrando el anticipo de «Camila Rojas», cuando intento guardarlo sin la cédula, entonces el sistema no lo registra y me pide la cédula.

**HU-07.** Como coordinadora de transporte, quiero registrar el otro 50 % al finalizar el servicio de una persona natural, para cerrar su servicio. Origen: N-05.
- Escenario 1, pago final: dado que «Camila Rojas» tiene un saldo pendiente de $440.000 y el servicio finalizó, cuando registro un pago de $440.000, entonces el saldo queda en $0 y el servicio queda cerrado.
- Escenario 2 (error), pago mayor al saldo: dado que el saldo pendiente es $440.000, cuando intento registrar un pago de $500.000, entonces el sistema no lo registra y me indica que el pago supera el saldo.

**HU-08.** Como coordinadora de transporte, quiero registrar el reembolso a una persona natural que cancela, para devolverle lo que pagó. Origen: N-06.
- Escenario 1, reembolso: dado que «Camila Rojas» pagó un anticipo de $440.000 y cancela el servicio, cuando registro la cancelación, entonces queda un reembolso de $440.000 y el servicio queda cancelado.
- Escenario 2 (error), sin dinero que devolver: dado que «Camila Rojas» no ha pagado ningún anticipo, cuando intento registrar un reembolso, entonces el sistema no lo registra y me indica que no hay dinero para devolver.

**HU-09.** Como asistente administrativa, quiero cargar en el sistema los documentos de un servicio, para dejar de manejarlos en físico. Origen: N-08, N-09.
- Escenario 1, documento cargado: dado que existe el servicio de «Transportes Andina S.A.S.», cuando cargo su RUT en un archivo PDF, entonces el documento queda asociado al servicio y aparece en su lista de documentos.
- Escenario 2 (error), sin archivo: dado que estoy en los documentos de «Transportes Andina S.A.S.», cuando intento cargar sin seleccionar un archivo, entonces el sistema no hace nada y me pide seleccionar un documento.

**HU-10.** Como encargada del sistema de gestión, quiero consultar los datos de los clientes sin poder editarlos, para revisarlos sin modificarlos. Origen: N-08, N-10.
- Escenario 1, consulta: dado que tengo el rol de consulta, cuando abro la ficha de «Camila Rojas», entonces veo sus datos y no aparece ninguna opción de editar.
- Escenario 2 (error), intento de edición: dado que tengo el rol de consulta, cuando intento cambiar el teléfono de «Camila Rojas», entonces el sistema no lo cambia y me indica que solo el proceso comercial puede editar.

## 5. Requisitos no funcionales

| Id | Requisito | ISO/IEC 25010 | Cómo se verifica |
|---|---|---|---|
| RNF-01 | Solo los usuarios del proceso comercial pueden editar los datos de los clientes; los usuarios con rol de consulta no pueden. (N-10) | Seguridad | Con un usuario comercial y uno de consulta: el comercial edita un dato y el de consulta falla en 3 de 3 intentos de edición |
| RNF-02 | La solicitud de HU-01 se puede completar desde un celular con pantalla de 360 píxeles de ancho, sin desplazamiento horizontal. (N-11) | Usabilidad | Completar HU-01 en un celular o en el emulador del navegador a 360 píxeles y revisar que no aparezca barra horizontal |
| RNF-03 | El sistema confirma la recepción de una solicitud en máximo 5 segundos. (N-11) | Eficiencia de desempeño | Enviar 10 solicitudes de prueba y medir el tiempo hasta el mensaje «Solicitud recibida»: las 10 en máximo 5 segundos |
| RNF-04 | El sistema está disponible las 24 horas, con una disponibilidad mensual de al menos 99 %. (N-07) | Fiabilidad | Monitoreo durante un mes: máximo 7 horas sin servicio en 30 días |

Las cifras de RNF-02, RNF-03 y RNF-04 son propuestas del analista, no las dijo la clienta; se validan en P-07 y P-08. La idoneidad funcional se cubre con las historias; compatibilidad, mantenibilidad y portabilidad no se mencionaron en la entrevista.

## 6. Priorización y trazabilidad

| Historia | Prioridad | Razón |
|---|---|---|
| HU-01 | Must | Es la forma de captar a los clientes particulares, que es el propósito del proyecto. |
| HU-02 | Must | Sin precio no se puede ofrecer el servicio. |
| HU-03 | Must | La disponibilidad de vehículos es la base para asignar servicios. |
| HU-04 | Must | Sin conductor disponible no se puede asignar un servicio. |
| HU-05 | Should | Ordena la lista, pero la asignación se puede hacer con HU-03 y HU-04. |
| HU-06 | Must | Con el anticipo se confirma el servicio de una persona natural. |
| HU-07 | Should | Cierra el pago, pero el anticipo ya confirma el servicio. |
| HU-08 | Should | Solo pasa cuando una persona natural cancela. |
| HU-09 | Could | La clienta dijo que sería más fácil en digital, pero hoy la documentación funciona en físico. |
| HU-10 | Should | Es una regla que ya se cumple hoy, pero el sistema puede arrancar con pocos usuarios. |

**Resumen:** Must 5, Should 4, Could 1, Won't 0. Porcentaje de Must: 50 %.

| Necesidad | Historia o RNF | Prueba prevista |
|---|---|---|
| N-01 | HU-01 | Enviar solicitud completa y otra sin contacto |
| N-02 | HU-02 | Calcular con los 6 conceptos y con el combustible vacío |
| N-03 | HU-03 | Marcar TKX456 como disponible y registrar placa repetida |
| N-03 | HU-04 | Marcar a «Pedro Gil» disponible y asignarlo estando en servicio |
| N-04 | HU-05 | Finalizar TKX321 y finalizar un vehículo sin servicio |
| N-05 | HU-06 | Registrar anticipo de $440.000 con y sin cédula |
| N-05 | HU-07 | Pagar $440.000 y $500.000 con saldo de $440.000 |
| N-06 | HU-08 | Reembolsar $440.000 con anticipo y sin anticipo |
| N-08, N-09 | HU-09 | Cargar un RUT en PDF y cargar sin archivo |
| N-08, N-10 | HU-10 | Consultar y tratar de editar con rol de consulta |
| N-10 | RNF-01 | Prueba con usuario comercial y usuario de consulta |
| N-11 | RNF-02, RNF-03 | Prueba a 360 píxeles y 10 envíos cronometrados |
| N-07 | RNF-04 | Monitoreo de disponibilidad por un mes |

N-08 queda cubierta solo en parte: HU-09 y HU-10 dan acceso a la asistente administrativa y a las encargadas del sistema de gestión, pero qué hace talento humano está sin definir (P-05).

## 7. Uso de IA

- **Qué hizo la IA:** Claude me ayudó a pasar las respuestas de la entrevista a necesidades con cita, historias de usuario, escenarios Gherkin, requisitos no funcionales, prioridad MoSCoW, matriz de trazabilidad y preguntas pendientes, usando la plantilla del profesor.
- **Qué hice yo:** hice la entrevista de 17 minutos a la coordinadora de transporte, le pregunté lo que necesitaba saber de la empresa a partir de mi Trabajo 2 y revisé que cada necesidad tenga una frase de ella. Decido qué queda en el documento y qué va a preguntas pendientes.
- **Requisitos inventados detectados:** (1) El chatbot y la cotización automática vienen de mi Trabajo 2; la clienta no los mencionó, por eso quedaron fuera del alcance. (2) Los datos que pide una solicitud (origen, destino, fecha) no los dijo la clienta; van como supuesto en P-03. (3) Que la ganancia sea un porcentaje no lo dijo; en HU-02 usé un valor y la pregunta está en P-02. (4) Las cifras de los requisitos no funcionales no las dijo la clienta. (5) Que la empresa también pague anticipo no lo dijo; solo habló de la persona natural (P-13). (6) La clienta dice que el 90 % de las solicitudes llegan por WhatsApp, pero mi sistema es una página web; eso es una diferencia que debo validar (P-14).
- **Qué corregí:** dejé fuera del alcance lo que no tenía frase de la clienta, separé el pago en dos historias (anticipo y saldo) para que cada una describa una sola cosa y dejé las cifras como propuestas que se validan con ella.

## 8. Preguntas pendientes

| Id | Pregunta para el cliente | Relacionada con |
|---|---|---|
| P-01 | ¿Quiere que el sistema calcule el precio solo y que un asistente virtual atienda a los clientes, o prefiere que lo siga haciendo la coordinadora? | HU-02, alcance |
| P-02 | ¿La «parte de ganancia» es un porcentaje o un valor fijo? ¿Quién la define? | HU-02 |
| P-03 | ¿Qué datos del viaje necesita hoy para dar un precio (origen, destino, fecha, número de pasajeros, tipo de vehículo)? | HU-01, HU-02 |
| P-04 | ¿Qué es el «extracto» y qué datos necesita de la persona natural además de la cédula? | HU-06 |
| P-05 | ¿Qué hace talento humano y qué hace la asistente administrativa en el proceso? ¿Qué parte quiere que deje de depender de la coordinadora? | N-08, HU-09 |
| P-06 | ¿Los conductores usarán el sistema o solo la coordinadora los registra? | HU-04 |
| P-07 | ¿Cuánto tiempo considera que es contestar rápido a un cliente? | RNF-03 |
| P-08 | ¿Cuántas horas sin servicio al mes puede aceptar el sistema? | RNF-04 |
| P-09 | ¿Qué documentos se manejan hoy en físico? | HU-09 |
| P-10 | ¿Cómo se paga hoy el anticipo y el saldo (transferencia, efectivo, en línea)? ¿Quiere pagos en línea? | HU-06, HU-07 |
| P-11 | ¿Cuánto se reembolsa si la persona natural cancela: todo lo pagado o hay descuentos? | HU-08 |
| P-12 | ¿Cuántos usuarios y qué roles tendría el sistema (comercial, consulta, coordinación)? | HU-10, RNF-01 |
| P-13 | ¿Las empresas también pagan anticipo? | HU-06 |
| P-14 | ¿Debe el sistema recibir las solicitudes que llegan por WhatsApp, que son el 90 %? | N-11, HU-01 |
| P-15 | ¿Quién registra los pagos, anticipos y reembolsos? | HU-06, HU-07, HU-08 |
