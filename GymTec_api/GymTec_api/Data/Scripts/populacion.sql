
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