-- Dina Express - esquema de la base de datos (PostgreSQL)

DROP VIEW  IF EXISTS v_vehiculos_disponibles, v_saldo_viaje;
DROP TABLE IF EXISTS pago, calculo_precio, viaje, vehiculo, conductor, cliente, usuario CASCADE;

-- Usuarios internos y su rol (RNF-01 y HU-10)
CREATE TABLE usuario (
  id_usuario  SERIAL PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  clave_hash  VARCHAR(255) NOT NULL,
  rol         VARCHAR(20)  NOT NULL
              CHECK (rol IN ('coordinadora', 'comercial', 'consulta', 'administrativa'))
);

-- Persona natural o empresa (N-05). documento = cédula o RUT
CREATE TABLE cliente (
  id_cliente  SERIAL PRIMARY KEY,
  tipo        VARCHAR(20)  NOT NULL CHECK (tipo IN ('persona_natural', 'empresa')),
  nombre      VARCHAR(120) NOT NULL,
  documento   VARCHAR(30),
  telefono    VARCHAR(20),
  email       VARCHAR(120),
  CONSTRAINT cliente_contacto_requerido CHECK (telefono IS NOT NULL OR email IS NOT NULL)
);

-- HU-04: conductor disponible o en servicio
CREATE TABLE conductor (
  id_conductor SERIAL PRIMARY KEY,
  nombre       VARCHAR(120) NOT NULL,
  telefono     VARCHAR(20),
  licencia     VARCHAR(30),
  estado       VARCHAR(20) NOT NULL DEFAULT 'disponible'
               CHECK (estado IN ('disponible', 'en_servicio'))
);

-- HU-03 y HU-05: vehículo disponible o en servicio
CREATE TABLE vehiculo (
  id_vehiculo      SERIAL PRIMARY KEY,
  placa            VARCHAR(10) NOT NULL UNIQUE,
  marca            VARCHAR(40),
  modelo           VARCHAR(40),
  estado           VARCHAR(20) NOT NULL DEFAULT 'disponible'
                   CHECK (estado IN ('disponible', 'en_servicio')),
  disponible_desde TIMESTAMPTZ NOT NULL DEFAULT now(),
  id_conductor     INT REFERENCES conductor (id_conductor)
);

-- Servicio de transporte (viaje)
CREATE TABLE viaje (
  id_viaje     SERIAL PRIMARY KEY,
  id_cliente   INT NOT NULL REFERENCES cliente (id_cliente),
  id_conductor INT REFERENCES conductor (id_conductor),
  id_vehiculo  INT REFERENCES vehiculo (id_vehiculo),
  fecha_hora   TIMESTAMPTZ NOT NULL,
  origen       VARCHAR(120) NOT NULL,
  destino      VARCHAR(120) NOT NULL,
  tarifa       NUMERIC(12, 0) CHECK (tarifa >= 0),
  estado       VARCHAR(20) NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente', 'cotizado', 'confirmado', 'en_curso', 'finalizado', 'cancelado')),
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- HU-02: desglose del precio; el total se calcula solo
CREATE TABLE calculo_precio (
  id_calculo             SERIAL PRIMARY KEY,
  id_viaje               INT NOT NULL UNIQUE REFERENCES viaje (id_viaje) ON DELETE CASCADE,
  costo_vehiculo         NUMERIC(12, 0) NOT NULL CHECK (costo_vehiculo >= 0),
  costo_conductor        NUMERIC(12, 0) NOT NULL CHECK (costo_conductor >= 0),
  combustible            NUMERIC(12, 0) NOT NULL CHECK (combustible >= 0),
  mantenimiento          NUMERIC(12, 0) NOT NULL CHECK (mantenimiento >= 0),
  gastos_administrativos NUMERIC(12, 0) NOT NULL CHECK (gastos_administrativos >= 0),
  ganancia               NUMERIC(12, 0) NOT NULL CHECK (ganancia >= 0),
  total                  NUMERIC(12, 0) GENERATED ALWAYS AS (
    costo_vehiculo + costo_conductor + combustible + mantenimiento + gastos_administrativos + ganancia
  ) STORED
);

-- HU-06, HU-07, HU-08: anticipo del 50 %, saldo final y reembolso
CREATE TABLE pago (
  id_pago    SERIAL PRIMARY KEY,
  id_viaje   INT NOT NULL REFERENCES viaje (id_viaje),
  id_usuario INT REFERENCES usuario (id_usuario),
  tipo       VARCHAR(20) NOT NULL CHECK (tipo IN ('anticipo', 'saldo', 'reembolso')),
  monto      NUMERIC(12, 0) NOT NULL CHECK (monto > 0),
  fecha      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_viaje_estado ON viaje (estado);
CREATE INDEX idx_vehiculo_disponibles ON vehiculo (estado, disponible_desde DESC);

-- Vehículos disponibles, el que terminó más reciente de primero (HU-05)
CREATE VIEW v_vehiculos_disponibles AS
SELECT id_vehiculo, placa, marca, modelo, disponible_desde
FROM vehiculo
WHERE estado = 'disponible'
ORDER BY disponible_desde DESC;

-- Lo pagado y el saldo pendiente de cada viaje (HU-06, HU-07, HU-08)
CREATE VIEW v_saldo_viaje AS
SELECT t.id_viaje,
       t.tarifa,
       t.pagado,
       t.tarifa - t.pagado AS saldo_pendiente
FROM (
  SELECT v.id_viaje,
         v.tarifa,
         COALESCE(SUM(CASE WHEN p.tipo IN ('anticipo', 'saldo') THEN p.monto END), 0)
         - COALESCE(SUM(CASE WHEN p.tipo = 'reembolso' THEN p.monto END), 0) AS pagado
  FROM viaje v
  LEFT JOIN pago p ON p.id_viaje = v.id_viaje
  GROUP BY v.id_viaje, v.tarifa
) t;