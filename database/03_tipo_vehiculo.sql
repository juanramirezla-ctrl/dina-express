-- Agrega el tipo de vehículo para el panel de flota. Se puede ejecutar más de una vez y no borra datos.

ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS tipo VARCHAR(20)
  CHECK (tipo IN ('camioneta', 'microbus_buseta', 'turbo', 'carrotanque', 'volqueta', 'carga_pesada'));

-- Datos ficticios para los vehículos de prueba.
UPDATE vehiculo SET tipo = 'camioneta', marca = 'Toyota', modelo = 'Hilux 2023' WHERE placa = 'TKX123' AND tipo IS NULL;
UPDATE vehiculo SET tipo = 'camioneta', marca = 'Nissan', modelo = 'Frontier 2022' WHERE placa = 'TKX456' AND tipo IS NULL;
UPDATE vehiculo SET tipo = 'microbus_buseta', marca = 'Chevrolet', modelo = 'NPR 2021' WHERE placa = 'TKX789' AND tipo IS NULL;
UPDATE vehiculo SET tipo = 'volqueta', marca = 'Kenworth', modelo = 'T370 2020' WHERE placa = 'TKX321' AND tipo IS NULL;
