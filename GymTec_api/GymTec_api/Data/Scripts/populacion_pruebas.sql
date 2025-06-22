
-- Productos
INSERT INTO producto (codigo_barra, nombre, descripcion, costo) VALUES
('PROD001', 'Proteína en polvo', 'Suplemento de proteína en polvo', 25000.00),
('PROD002', 'Creatina', 'Suplemento de creatina', 15000.00),
('PROD003', 'Aminoácidos', 'Suplemento de aminoácidos', 20000.00),
('PROD004', 'Barras energéticas', 'Barras energéticas para antes del ejercicio', 5000.00);


-- Para Pruebas

-- Cliente
INSERT INTO cliente (cedula, peso, imc, correo, password, nombres, apellidos, fecha_nacimiento, distrito, canton, provincia) VALUES
('111111111', 70.5, 22.5, 'cliente1@gym.com', 'clientepass', 'Jose Eduardo', 'Campos Salazar', '1990-05-15', 'San Ramón', 'Alajuela', 'Alajuela'),
('222222222', 65.0, 21.8, 'cliente2@gym.com', 'clientepass', 'Jimmy', 'Feng Feng', '1988-09-10', 'Oriental', 'Cartago', 'Cartago'),
('333333333', 70.5, 22.5, 'cliente3@gym.com', 'clientepass', 'Alexander', 'Montero', '1990-05-15', 'San Ramón', 'Alajuela', 'Alajuela'),
('444444444', 65.0, 21.8, 'cliente4@gym.com', 'clientepass', 'Jose Bernardo', 'Barquero', '1988-09-10', 'Oriental', 'Cartago', 'Cartago'),
('555555555', 70.5, 22.5, 'cliente5@gym.com', 'clientepass', 'Diego', 'Salas', '1990-05-15', 'San Ramón', 'Alajuela', 'Alajuela'),
('666666666', 65.0, 21.8, 'cliente6@gym.com', 'clientepass', 'Adrian', 'Muñóz', '1988-09-10', 'Oriental', 'Cartago', 'Cartago');

-- Empleado Admin 
INSERT INTO empleado (cedula, salario, correo, password, clases_horas, nombres, apellidos, distrito, canton, provincia, id_planilla, id_puesto) VALUES
('101010101', 800000.00, 'admin@gym.com', 'adminpass', 0, 'Carlos', 'Guzmán', 'Carmen', 'San José', 'San José', 1, 1), --Admin
('202020202', 800000.00, 'admin2@gym.com', 'adminpass', 0, 'Adriana', 'Lima', 'Occidental', 'Cartago', 'Cartago', 1, 1);   -- Admin

-- Surcursal
INSERT INTO sucursal (nombre_sucursal, fecha_apertura, horario_atencion, capacidad_max, distrito, canton, provincia, id_admin) 
VALUES 
('Sucursal Central', '2020-01-01', '06:00 - 22:00', 100, 'Carmen', 'San José', 'San José', 1),
('Sucursal Secundaria', '2021-01-01', '06:00 - 22:00', 100, 'Oriental', 'Cartago', 'Cartago', 2); 

UPDATE empleado SET id_sucursal = 1 WHERE cedula = '101010101'; -- Asignar admin a la sucursal
UPDATE empleado SET id_sucursal = 2 WHERE cedula = '202020202'; -- Asignar admin a la sucursal secundaria

-- Empleado (Instructor)
INSERT INTO empleado (cedula, salario, correo, password, clases_horas, nombres, apellidos, distrito, canton, provincia, id_planilla, id_puesto, id_sucursal) VALUES
('303030303', 500000.00, 'instructor@gym.com', 'instpass', 20, 'María', 'Lopez', 'Hatillo', 'San José', 'San José', 2, 2, 1), -- Instructor
('404040404', 600000.00, 'isntructor2@gym.com', 'instpass', 4, 'Luis', 'Fernandez', 'Oriental', 'Cartago', 'Cartago', 3, 2, 1),  --Instructor
('505050505', 500000.00, 'instructor3@gym.com', 'instpass', 20, 'María', 'Lopez', 'Hatillo', 'San José', 'San José', 2, 2, 2), -- Instructor
('606060606', 600000.00, 'isntructor4@gym.com', 'instpass', 4, 'Luis', 'Fernandez', 'Oriental', 'Cartago', 'Cartago', 3, 2, 2);  --Instructor

-- SucursalXServicio
INSERT INTO sucursalxservicio (id_sucursal, id_servicio) VALUES
(1, 1), -- Sucursal Central ofrece Indoor Cycling
(1, 2), -- Sucursal Central ofrece Pilates
(1, 3), -- Sucursal Central ofrece Yoga
(1, 4), -- Sucursal Central ofrece Zumba
(1, 5), -- Sucursal Central ofrece Natación
(1, 6), -- Sucursal Central ofrece Tienda de suplementos

(2, 1), -- Sucursal Secundaria ofrece Indoor Cycling
(2, 2), -- Sucursal Secundaria ofrece Pilates
(2, 3), -- Sucursal Secundaria ofrece Yoga
(2, 4), -- Sucursal Secundaria ofrece Zumba
(2, 5), -- Sucursal Secundaria ofrece Natación
(2, 6); -- Sucursal Secundaria ofrece Tienda de suplementos

-- SucursalXTratamiento
INSERT INTO sucursalxtratamiento (id_sucursal, id_tratamiento) VALUES
(1, 1), -- Sucursal Central ofrece Masaje relajante
(1, 2), -- Sucursal Central ofrece Masaje descarga muscular
(1, 3), -- Sucursal Central ofrece Sauna
(1, 4), -- Sucursal Central ofrece Baños a vapor

(2, 1), -- Sucursal Secundaria ofrece Masaje relajante
(2, 2), -- Sucursal Secundaria ofrece Masaje descarga muscular
(2, 3), -- Sucursal Secundaria ofrece Sauna
(2, 4); -- Sucursal Secundaria ofrece Baños a vapor

-- SucursalXProducto
INSERT INTO sucursalxproducto (id_sucursal, codigo_barra) VALUES
(1, 'PROD001'), -- Sucursal Central ofrece Proteína en polvo
(1, 'PROD002'), -- Sucursal Central ofrece Creatina
(1, 'PROD003'), -- Sucursal Central ofrece Aminoácidos
(1, 'PROD004'), -- Sucursal Central ofrece Barras energéticas

(2, 'PROD001'), -- Sucursal Secundaria ofrece Proteína en polvo
(2, 'PROD002'), -- Sucursal Secundaria ofrece Creatina
(2, 'PROD003'), -- Sucursal Secundaria ofrece Aminoácidos
(2, 'PROD004'); -- Sucursal Secundaria ofrece Barras energéticas

-- TelefonsSucursal
INSERT INTO telefonossucursal (numero_telefono, id_sucursal) VALUES
('22222222', 1), -- Sucursal Central
('33333333', 2); -- Sucursal Secundaria

-- Clase
INSERT INTO clase (hora_inicio, hora_fin, grupal, capacidad, fecha, id_instructor, id_servicio, id_sucursal) VALUES
('08:00:00', '09:00:00', FALSE, 20, '2023-10-01', 3, 1, 1), -- Clase de Indoor Cycling
('10:00:00', '11:00:00', TRUE, 15, '2023-10-01', 5, 2, 2), -- Clase de Pilates
('12:00:00', '13:00:00', TRUE, 25, '2023-10-01', 3, 3, 1), -- Clase de Yoga
('14:00:00', '15:00:00', TRUE, 30, '2023-10-01', 5, 4, 2); -- Clase de Zumba

-- clientexclase
INSERT INTO clientexclase (id_cliente, id_clase) VALUES
(1, 1), -- Cliente 1 inscrito en Clase de Indoor Cycling
(2, 2), -- Cliente 2 inscrito en Clase de Pilates
(3, 3), -- Cliente 3 inscrito en Clase de Yoga
(4, 4), -- Cliente 4 inscrito en Clase de Zumba
(5, 1), -- Cliente 5 inscrito en Clase de Indoor Cycling 
(5, 2), -- Cliente 5 inscrito en Clase de Indoor Pilates
(6, 3); -- Cliente 6 inscrito en Clase de Yoga


-- Asignar instructor a clientes
UPDATE cliente SET id_instructor = 3 WHERE cedula = '111111111'; -- Cliente 1 asignado al instructor 3
UPDATE cliente SET id_instructor = 5 WHERE cedula = '222222222'; -- Cliente 2 asignado al instructor 5

-- plantrabajo
INSERT INTO plantrabajo (id_cliente, start_date, end_date, descripcion) VALUES
(1, '2023-10-01', '2023-10-31', 'Plan de entrenamiento personalizado para Cliente 1'),
(2, '2023-10-01', '2023-10-31', 'Plan de entrenamiento personalizado para Cliente 2');

-- DetallePlan
INSERT INTO detalleplan (id_plan_trabajo, fecha, actividad) VALUES
(1, '2023-10-01', 'Entrenamiento de fuerza'),
(1, '2023-10-02', 'Cardio'),
(2, '2023-10-01', 'Entrenamiento funcional'),
(2, '2023-10-02', 'Yoga');


-- Maquina
INSERT INTO maquina (marca, num_serie, costo, id_tipo_equipo, id_sucursal) VALUES
('Marca A', 'MAQ001', 500000.00, 1, 1),
('Marca B', 'MAQ002', 600000.00, 2, 1),
('Marca C', 'MAQ003', 700000.00, 3, 2),
('Marca D', 'MAQ004', 800000.00, 4, 2);

-- ===============Sucursal para eliminar===================

INSERT INTO empleado (cedula, salario, correo, password, clases_horas, nombres, apellidos, distrito, canton, provincia, id_planilla, id_puesto) VALUES
('707070707', 800000.00, 'admin3@gym.com', 'adminpass', 0, 'Alberto', 'Chinchilla', 'Santa Ana', 'San José', 'San José', 1, 1);


-- Surcursal
INSERT INTO sucursal (nombre_sucursal, fecha_apertura, horario_atencion, capacidad_max, distrito, canton, provincia, id_admin) 
VALUES 
('Sucursal prueba', '2022-01-01', '06:00 - 22:00', 100, 'San Francisco', 'Heredia', 'Heredia', 7);

UPDATE empleado SET id_sucursal = 3 WHERE cedula = '707070707'; -- Asignar admin a la sucursal

-- Empleado (Instructor)
INSERT INTO empleado (cedula, salario, correo, password, clases_horas, nombres, apellidos, distrito, canton, provincia, id_planilla, id_puesto, id_sucursal) VALUES
('808080808', 500000.00, 'instructor8@gym.com', 'instpass', 20, 'inst8', 'Lopez', 'Hatillo', 'San José', 'San José', 2, 2, 3), -- Instructor
('909090909', 600000.00, 'isntructor9@gym.com', 'instpass', 4, 'inst9', 'Fernandez', 'Oriental', 'Cartago', 'Cartago', 3, 2, 3);  --Instructor

-- SucursalXServicio
INSERT INTO sucursalxservicio (id_sucursal, id_servicio) VALUES
(3, 1), -- Sucursal Central ofrece Indoor Cycling
(3, 2), -- Sucursal Central ofrece Pilates
(3, 3), -- Sucursal Central ofrece Yoga
(3, 4), -- Sucursal Central ofrece Zumba
(3, 5), -- Sucursal Central ofrece Natación
(3, 6); -- Sucursal Central ofrece Tienda de suplementos

-- SucursalXTratamiento
INSERT INTO sucursalxtratamiento (id_sucursal, id_tratamiento) VALUES
(3, 1), -- Sucursal Central ofrece Masaje relajante
(3, 2), -- Sucursal Central ofrece Masaje descarga muscular
(3, 3), -- Sucursal Central ofrece Sauna
(3, 4); -- Sucursal Central ofrece Baños a vapor

-- SucursalXProducto
INSERT INTO sucursalxproducto (id_sucursal, codigo_barra) VALUES
(3, 'PROD001'), -- Sucursal Central ofrece Proteína en polvo
(3, 'PROD002'), -- Sucursal Central ofrece Creatina
(3, 'PROD003'), -- Sucursal Central ofrece Aminoácidos
(3, 'PROD004'); -- Sucursal Central ofrece Barras energéticas


-- TelefonsSucursal
INSERT INTO telefonossucursal (numero_telefono, id_sucursal) VALUES
('333333333', 3);

-- Clase
INSERT INTO clase (hora_inicio, hora_fin, grupal, capacidad, fecha, id_instructor, id_servicio, id_sucursal) VALUES
('08:00:00', '09:00:00', FALSE, 20, '2023-10-01', 8, 1, 3), -- Clase de Indoor Cycling
('10:00:00', '11:00:00', TRUE, 15, '2023-10-01', 8, 2, 3), -- Clase de Pilates
('12:00:00', '13:00:00', TRUE, 25, '2023-10-01', 9, 3, 3), -- Clase de Yoga
('14:00:00', '15:00:00', TRUE, 30, '2023-10-01', 9, 4, 3); -- Clase de Zumba

-- clientexclase
INSERT INTO clientexclase (id_cliente, id_clase) VALUES
(1, 5), -- Cliente 1 inscrito en Clase de Indoor Cycling
(2, 6), -- Cliente 2 inscrito en Clase de Pilates
(3, 7), -- Cliente 3 inscrito en Clase de Yoga
(4, 8), -- Cliente 4 inscrito en Clase de Zumba
(5, 5), -- Cliente 5 inscrito en Clase de Indoor Cycling 
(5, 6), -- Cliente 5 inscrito en Clase de Indoor Pilates
(6, 7); -- Cliente 6 inscrito en Clase de Yoga