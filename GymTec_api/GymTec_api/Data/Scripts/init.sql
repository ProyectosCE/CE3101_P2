
-- Creacion de tablas

CREATE TABLE Clase (
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

CREATE TABLE Cliente (
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

CREATE TABLE ClienteXClase (
	PRIMARY KEY (id_cliente, id_clase),
	--Fks
	id_cliente INT NOT NULL,
	id_clase INT NOT NULL
);

CREATE TABLE DetallePlan (
	id_detalle_plan SERIAL PRIMARY KEY,
	date DATE NOT NULL,
	actividad VARCHAR(100) NOT NULL,
	--Fks
	id_plan_trabajo INT NOT NULL
);

CREATE TABLE Empleado (
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
	id_sucursal INT NOT NULL,
	id_puesto INT NOT NULL
);

CREATE TABLE Maquina (
	id_maquina SERIAL PRIMARY KEY,
	marca VARCHAR(100) NOT NULL,
	num_serie VARCHAR(100) NOT NULL UNIQUE,
	costo NUMERIC(10, 2) NOT NULL,
	--Fks
	id_tipo_equipo INT NOT NULL,
	id_sucursal INT
);

CREATE TABLE Planilla (
	id_planilla SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE PlanTrabajo (
	id_plan_trabajo SERIAL PRIMARY KEY,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	descripcion VARCHAR(200) NOT NULL,
	--Fks
	id_cliente INT NOT NULL
);

CREATE TABLE Producto (
	codigo_barra VARCHAR(20) PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(200) NOT NULL,
	costo NUMERIC(10, 2) NOT NULL
);

CREATE TABLE Puesto (
	id_puesto SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL,
	is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Servicio (
	id_servicio SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE Sucursal (
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
	id_admin INT NOT NULL
);

CREATE TABLE SucursalXProducto (
	PRIMARY KEY (id_sucursal, codigo_barra),
	--Fks
	id_sucursal INT NOT NULL,
	codigo_barra VARCHAR(20) NOT NULL
);

CREATE TABLE SucursalXServicio (
	PRIMARY KEY (id_sucursal, id_servicio),
	--Fks
	id_sucursal INT NOT NULL,
	id_servicio INT NOT NULL
);

CREATE TABLE SucursalXTratamiento (
	PRIMARY KEY (id_sucursal, id_tratamiento),
	--Fks
	id_sucursal INT NOT NULL,
	id_tratamiento INT NOT NULL
);

CREATE TABLE TelefonosSucursal (
	id_telefono_sucursal SERIAL PRIMARY KEY,
	numero_telefono VARCHAR(20) NOT NULL UNIQUE,
	--Fks
	id_sucursal INT NOT NULL
);

CREATE TABLE Tipo_Equipo (
	id_tipo_equipo SERIAL PRIMARY KEY,
	descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE Tratamiento (
	id_tratamiento SERIAL PRIMARY KEY,
	nombre_tratamiento VARCHAR(100) NOT NULL,
	is_default BOOLEAN NOT NULL DEFAULT FALSE
);


-- Foreign Keys

ALTER TABLE Clase
	ADD CONSTRAINT fk_instructor FOREIGN KEY (id_instructor) 
		REFERENCES Empleado(id_empleado);

ALTER TABLE Clase
	ADD CONSTRAINT fk_servicio FOREIGN KEY (id_servicio) 
		REFERENCES Servicio(id_servicio);

ALTER TABLE Cliente
	ADD CONSTRAINT fk_instructor_cliente FOREIGN KEY (id_instructor) 
		REFERENCES Empleado(id_empleado);

ALTER TABLE ClienteXClase
	ADD CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) 
		REFERENCES Cliente(id_cliente);

ALTER TABLE ClienteXClase
	ADD CONSTRAINT fk_clase FOREIGN KEY (id_clase) 
		REFERENCES Clase(id_clase);

ALTER TABLE DetallePlan
	ADD CONSTRAINT fk_plan_trabajo FOREIGN KEY (id_plan_trabajo) 
		REFERENCES PlanTrabajo(id_plan_trabajo);

ALTER TABLE Empleado 
	ADD CONSTRAINT fk_planilla FOREIGN KEY (id_planilla) 
		REFERENCES Planilla(id_planilla);

ALTER TABLE Empleado
	ADD CONSTRAINT fk_sucursal FOREIGN KEY (id_sucursal) 
		REFERENCES Sucursal(id_sucursal);

ALTER TABLE Empleado
	ADD CONSTRAINT fk_puesto FOREIGN KEY (id_puesto) 
		REFERENCES Puesto(id_puesto);

ALTER TABLE Maquina
	ADD CONSTRAINT fk_sucursal_maquina FOREIGN KEY (id_sucursal) 
		REFERENCES Sucursal(id_sucursal);

ALTER TABLE Maquina 
	ADD CONSTRAINT fk_tipo_equipo FOREIGN KEY (id_tipo_equipo) 
		REFERENCES Tipo_Equipo(id_tipo_equipo);

ALTER TABLE PlanTrabajo
	ADD CONSTRAINT fk_cliente_plan FOREIGN KEY (id_cliente) 
		REFERENCES Cliente(id_cliente);

ALTER TABLE Sucursal 
	ADD CONSTRAINT fk_admin FOREIGN KEY (id_admin) 
		REFERENCES Empleado(id_empleado);

ALTER TABLE SucursalXProducto
	ADD CONSTRAINT fk_sucursal_producto FOREIGN KEY (id_sucursal) 
		REFERENCES Sucursal(id_sucursal);

ALTER TABLE SucursalXProducto
	ADD CONSTRAINT fk_producto FOREIGN KEY (codigo_barra) 
		REFERENCES Producto(codigo_barra);

ALTER TABLE SucursalXServicio
	ADD CONSTRAINT fk_sucursal_servicio FOREIGN KEY (id_sucursal) 
		REFERENCES Sucursal(id_sucursal);

ALTER TABLE SucursalXServicio
	ADD CONSTRAINT fk_servicio_sucursal FOREIGN KEY (id_servicio) 
		REFERENCES Servicio(id_servicio);

ALTER TABLE SucursalXTratamiento 
	ADD CONSTRAINT fk_sucursal_tratamiento FOREIGN KEY (id_sucursal) 
		REFERENCES Sucursal(id_sucursal);

ALTER TABLE SucursalXTratamiento
	ADD CONSTRAINT fk_tratamiento FOREIGN KEY (id_tratamiento) 
		REFERENCES Tratamiento(id_tratamiento);

ALTER TABLE TelefonosSucursal 
	ADD CONSTRAINT fk_sucursal_telefono FOREIGN KEY (id_sucursal) 
		REFERENCES Sucursal(id_sucursal);
