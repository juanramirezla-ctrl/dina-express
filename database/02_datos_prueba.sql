INSERT INTO conductor (nombre, telefono, estado) VALUES
  ('Pedro Gil', '3001112233', 'en_servicio'),
  ('Luis Mora', '3004445566', 'disponible');

INSERT INTO vehiculo (placa, estado, disponible_desde) VALUES
  ('TKX123', 'disponible',  now() - interval '3 hours'),
  ('TKX456', 'disponible',  now() - interval '4 hours'),
  ('TKX789', 'disponible',  now() - interval '5 hours'),
  ('TKX321', 'en_servicio', now());

INSERT INTO cliente (tipo, nombre, documento, telefono) VALUES
  ('persona_natural', 'Camila Rojas', '1000000000', '3000000000');

INSERT INTO viaje (id_cliente, fecha_hora, origen, destino)
SELECT id_cliente, '2026-11-15 08:00-05', 'Neiva', 'Bogotá'
FROM cliente WHERE nombre = 'Camila Rojas';