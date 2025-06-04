
-- Poblacion inicial

-- Tratamiento
INSERT INTO tratamiento (nombre_tratamiento, is_default) VALUES
('Masaje relajante', TRUE),
('Masaje descarga muscular', TRUE),
('Sauna', TRUE),
('Ba�os a vapor', TRUE);

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
('Nataci�n',TRUE);

-- Tipo_Equipo
INSERT INTO tipo_equipo (descripcion) VALUES
('Cintas de correr'),
('Bicicletas estacionarias'),
('Multigimnasios'),
('Remos'),
('Pesas');

-- Productos
INSERT INTO producto (codigo_barra, nombre, descripcion, costo) VALUES
('PROD001', 'Prote�na en polvo', 'Suplemento de prote�na en polvo', 25000.00),
('PROD002', 'Creatina', 'Suplemento de creatina', 15000.00),
('PROD003', 'Amino�cidos', 'Suplemento de amino�cidos', 20000.00),
('PROD004', 'Barras energ�ticas', 'Barras energ�ticas para antes del ejercicio', 5000.00);