# Registro de pruebas: tabla de casos y pruebas de la IA

Proyecto: Dina Express
Estudiante: Juan José Ramírez Lasso
Fecha: 2026-11-21

## 1. Tabla de casos

### Regla 1: calcularPrecio, el precio de un viaje es la suma de sus seis conceptos

**Regla completa (el oráculo):** HU-02 y necesidad N-02. La clienta dijo: «Se calcula con el gasto del vehículo, el del conductor, combustible, mantenimiento y gastos administrativos y una parte de ganancia». El precio es la suma de los seis conceptos, cada uno en pesos enteros de 0 o más. Si falta un concepto, no se calcula y se indica cuál falta (HU-02, escenario 2).

**Ambigüedades encontradas:** la «parte de ganancia» puede ser un valor fijo o un porcentaje (pregunta P-02). Decisión provisional: valor fijo en pesos. Tampoco hay un precio máximo definido por la clienta.

### Regla 2: calcularAnticipoYSaldo, el anticipo es el 50 % del precio y el otro 50 % se paga al terminar

**Regla completa (el oráculo):** HU-06, HU-07 y necesidad N-05. La clienta dijo: «persona natural se pide 50% de anticipo [...] y al finalizar el servicio se le pide el otro 50%». Ejemplo de HU-06: viaje de $880.000, anticipo $440.000, saldo pendiente $440.000.

**Ambigüedades encontradas:** la regla no dice cómo redondear cuando el precio es impar (por ejemplo, $100.001). Decisión provisional: el anticipo es la mitad redondeada hacia abajo y el saldo es el resto, así que anticipo + saldo siempre es igual al precio. Queda como pregunta nueva para la clienta (P-16). Tampoco dice si un viaje de precio $0 es válido; se acepta y da anticipo $0 y saldo $0.

### Regla 3: calcularReembolso, qué se devuelve cuando se cancela un servicio

**Regla completa (el oráculo):** HU-08 y necesidad N-06. La clienta dijo: «Si es una empresa no pasa nada. Si es una persona natural se le reembolsa el dinero». HU-08, escenario 1: una persona natural pagó $440.000 y cancela, entonces se reembolsan $440.000. Escenario 2: una persona natural que no ha pagado nada no recibe reembolso y el sistema indica que no hay dinero para devolver.

**Ambigüedades encontradas:** la clienta no dijo si se devuelve todo o hay descuentos (P-11); decisión provisional: se devuelve todo lo pagado. Tampoco dijo qué pasa si se pide un reembolso sin cancelar el servicio; decisión provisional: es un error, porque el reembolso solo existe al cancelar.