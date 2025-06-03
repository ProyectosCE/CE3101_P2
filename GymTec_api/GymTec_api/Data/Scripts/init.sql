
-- Creacion de tablas

CREATE TABLE clase (
	id_clase SERIAL PRIMARY KEY,
	hora_inicio TIME NOT NULL,
	hora_fin TIME NOT NULL,
	grupal BOOLEAN NOT NULL,
	capacidad INT NOT NULL,
	fecha DATE NOT NULL,
	--Fks
	id_instructor INT NOT NULL,
	id_servicio INT NOT NULL
);

CREATE TABLE cliente (
	id_cliente SERIAL PRIMARY KEY,
	cedula VARCHAR(20) NOT NULL UNIQUE,
	peso REAL NOT NULL,
	imc REAL NOT NULL,
	correo VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
	nombres VARCHAR(100) NOT NULL,
	apellidos VARCHAR(100) NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	distrito VARCHAR(100) NOT NULL,
	canton VARCHAR(100) NOT NULL,
	provincia VARCHAR(100) NOT NULL,
	--Fks
	id_instructor INT
);

CREATE TABLE clientexclase (
	PRIMARY KEY (id_cliente, id_clase),
	--Fks
	id_cliente INT NOT NULL,
	id_clase INT NOT NULL
);

CREATE TABLE detalleplan (
	id_detalle_plan SERIAL PRIMARY KEY,
	fecha DATE NOT NULL,
	actividad VARCHAR(100) NOT NULL,
	--Fks
	id_plan_trabajo INT NOT NULL
);

CREATE TABLE empleado (
	id_empleado SERIAL PRIMARY KEY,
	cedula VARCHAR(20) NOT NULL UNIQUE,
	salario NUMERIC(10, 2) NOT NULL,
	correo VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
	clases_horas INT NOT NULL,
	nombres VARCHAR(100) NOT NULL,
	apellidos VARCHAR(100) NOT NULL,
	distrito VARCHAR(100) NOT NULL,
	canton VARCHAR(100) NOT NULL,
	provincia VARCHAR(100) NOT NULL,
	--Fks
	id_planilla INT NOT NULL,
	id_sucursal INT,
	id_puesto INT NOT NULL
);

CREATE TABLE maquina (
	id_maquina SERIAL PRIMARY KEY,
	marca VARCHAR(100) NOT NULL,
	num_serie VARCHAR(100) NOT NULL UNIQUE,
	costo NUMERIC(10, 2) NOT NULL,
	--Fks
	id_tipo_equipo INT NOT NULL,
	id_sucursal INT
);

CREATE TABLE planilla (
	id_planilla SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE plantrabajo (
	id_plan_trabajo SERIAL PRIMARY KEY,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	descripcion VARCHAR(200) NOT NULL,
	--Fks
	id_cliente INT NOT NULL
);

CREATE TABLE producto (
	codigo_barra VARCHAR(20) PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(200) NOT NULL,
	costo NUMERIC(10, 2) NOT NULL
);

CREATE TABLE puesto (
	id_puesto SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL,
	is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE servicio (
	id_servicio SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL,
	is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE sucursal (
	id_sucursal SERIAL PRIMARY KEY,
	nombre_sucursal VARCHAR(100) NOT NULL UNIQUE,
	fecha_apertura DATE NOT NULL, 
	horario_atencion VARCHAR(100) NOT NULL,
	capacidad_max INT NOT NULL,
	spa_activo BOOLEAN NOT NULL DEFAULT FALSE,
	tienda_activo BOOLEAN NOT NULL DEFAULT FALSE,
	distrito VARCHAR(100) NOT NULL,
	canton VARCHAR(100) NOT NULL,
	provincia VARCHAR(100) NOT NULL,
	--Fks
	id_admin INT
);

CREATE TABLE sucursalxproducto (
	PRIMARY KEY (id_sucursal, codigo_barra),
	--Fks
	id_sucursal INT NOT NULL,
	codigo_barra VARCHAR(20) NOT NULL
);

CREATE TABLE sucursalxservicio (
	PRIMARY KEY (id_sucursal, id_servicio),
	--Fks
	id_sucursal INT NOT NULL,
	id_servicio INT NOT NULL
);

CREATE TABLE sucursalxtratamiento (
	PRIMARY KEY (id_sucursal, id_tratamiento),
	--Fks
	id_sucursal INT NOT NULL,
	id_tratamiento INT NOT NULL
);

CREATE TABLE telefonossucursal (
	id_telefono_sucursal SERIAL PRIMARY KEY,
	numero_telefono VARCHAR(20) NOT NULL UNIQUE,
	--Fks
	id_sucursal INT NOT NULL
);

CREATE TABLE tipo_equipo (
	id_tipo_equipo SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE tratamiento (
	id_tratamiento SERIAL PRIMARY KEY,
	nombre_tratamiento VARCHAR(100) NOT NULL,
	is_default BOOLEAN NOT NULL DEFAULT FALSE
);


-- Foreign Keys

ALTER TABLE clase
	ADD CONSTRAINT fk_instructor FOREIGN KEY (id_instructor) 
		REFERENCES empleado(id_empleado);

ALTER TABLE clase
	ADD CONSTRAINT fk_servicio FOREIGN KEY (id_servicio) 
		REFERENCES servicio(id_servicio);

ALTER TABLE cliente
	ADD CONSTRAINT fk_instructor_cliente FOREIGN KEY (id_instructor) 
		REFERENCES empleado(id_empleado);

ALTER TABLE clientexclase
	ADD CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) 
		REFERENCES cliente(id_cliente);

ALTER TABLE clientexclase
	ADD CONSTRAINT fk_clase FOREIGN KEY (id_clase) 
		REFERENCES clase(id_clase);

ALTER TABLE detalleplan
	ADD CONSTRAINT fk_plan_trabajo FOREIGN KEY (id_plan_trabajo) 
		REFERENCES plantrabajo(id_plan_trabajo);

ALTER TABLE empleado 
	ADD CONSTRAINT fk_planilla FOREIGN KEY (id_planilla) 
		REFERENCES planilla(id_planilla);

ALTER TABLE empleado
	ADD CONSTRAINT fk_sucursal FOREIGN KEY (id_sucursal) 
		REFERENCES sucursal(id_sucursal);

ALTER TABLE empleado
	ADD CONSTRAINT fk_puesto FOREIGN KEY (id_puesto) 
		REFERENCES puesto(id_puesto);

ALTER TABLE maquina
	ADD CONSTRAINT fk_sucursal_maquina FOREIGN KEY (id_sucursal) 
		REFERENCES sucursal(id_sucursal);

ALTER TABLE maquina 
	ADD CONSTRAINT fk_tipo_equipo FOREIGN KEY (id_tipo_equipo) 
		REFERENCES tipo_equipo(id_tipo_equipo);

ALTER TABLE plantrabajo
	ADD CONSTRAINT fk_cliente_plan FOREIGN KEY (id_cliente) 
		REFERENCES cliente(id_cliente);

ALTER TABLE sucursal 
	ADD CONSTRAINT fk_admin FOREIGN KEY (id_admin) 
		REFERENCES empleado(id_empleado);

ALTER TABLE sucursalxproducto
	ADD CONSTRAINT fk_sucursal_producto FOREIGN KEY (id_sucursal) 
		REFERENCES sucursal(id_sucursal);

ALTER TABLE sucursalxproducto
	ADD CONSTRAINT fk_producto FOREIGN KEY (codigo_barra) 
		REFERENCES producto(codigo_barra);

ALTER TABLE sucursalxservicio
	ADD CONSTRAINT fk_sucursal_servicio FOREIGN KEY (id_sucursal) 
		REFERENCES sucursal(id_sucursal);

ALTER TABLE sucursalxservicio
	ADD CONSTRAINT fk_servicio_sucursal FOREIGN KEY (id_servicio) 
		REFERENCES servicio(id_servicio);

ALTER TABLE sucursalxtratamiento 
	ADD CONSTRAINT fk_sucursal_tratamiento FOREIGN KEY (id_sucursal) 
		REFERENCES Sucursal(id_sucursal);

ALTER TABLE sucursalxtratamiento
	ADD CONSTRAINT fk_tratamiento FOREIGN KEY (id_tratamiento) 
		REFERENCES tratamiento(id_tratamiento);

ALTER TABLE telefonossucursal 
	ADD CONSTRAINT fk_sucursal_telefono FOREIGN KEY (id_sucursal) 
		REFERENCES sucursal(id_sucursal);


-- Vistas
CREATE OR REPLACE VIEW clases_disponibles
AS SELECT
    s.descripcion AS nombre_servicio,
    c.grupal AS es_grupal,
    su.nombre_sucursal,
    c.capacidad,
	CONCAT(e.nombres, ' ', e.apellidos) AS instructor,
    c.hora_inicio, 
    c.hora_fin, 
    c.fecha,
    (c.capacidad - COUNT(cxc.id_cliente)) AS cupos_disponibles
FROM clase c
JOIN servicio s ON c.id_servicio = s.id_servicio
JOIN empleado e ON c.id_instructor = e.id_empleado
JOIN sucursal su ON e.id_sucursal = su.id_sucursal 
LEFT JOIN clientexclase cxc ON c.id_clase = cxc.id_clase
GROUP BY 
    s.descripcion, 
    c.grupal, 
    su.nombre_sucursal, 
    c.capacidad, 
    e.nombres, 
    e.apellidos, 
    c.hora_inicio, 
    c.hora_fin, 
    c.fecha;