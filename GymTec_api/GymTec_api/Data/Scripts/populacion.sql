
-- Poblacion inicial

-- Tratamiento
INSERT INTO tratamiento (nombre_tratamiento, is_default) VALUES
('Masaje relajante', TRUE),
('Masaje descarga muscular', TRUE),
('Sauna', TRUE),
('Baños a vapor', TRUE);

-- Puesto
INSERT INTO puesto (descripcion, is_default) VALUES
('admin',TRUE),
('instructor',TRUE),
('depen_spa',TRUE),
('depen_tienda',TRUE);

-- Planilla
INSERT INTO planilla (descripcion) VALUES
('Pago mensual'),
('Pago por horas'),
('Pago por clase');

-- Servicio
INSERT INTO servicio (descripcion, is_default) VALUES
('Indoor Cycling',TRUE),
('Pilates',TRUE),
('Yoga',TRUE),
('Zumba',TRUE),
('Natación',TRUE);

-- Tipo_Equipo
INSERT INTO tipo_equipo (descripcion) VALUES
('Cintas de correr'),
('Bicicletas estacionarias'),
('Multigimnasios'),
('Remos'),
('Pesas');

-- Productos
INSERT INTO producto (codigo_barra, nombre, descripcion, costo) VALUES
('PROD001', 'Proteína en polvo', 'Suplemento de proteína en polvo', 25000.00),
('PROD002', 'Creatina', 'Suplemento de creatina', 15000.00),
('PROD003', 'Aminoácidos', 'Suplemento de aminoácidos', 20000.00),
('PROD004', 'Barras energéticas', 'Barras energéticas para antes del ejercicio', 5000.00);