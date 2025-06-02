import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('gymtec.db');

export const createTables = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS clientes (
      cedula TEXT PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      edad INTEGER,
      fecha_nacimiento TEXT,
      peso REAL,
      imc REAL,
      direccion TEXT,
      correo TEXT NOT NULL,
      password TEXT NOT NULL,
      sincronizado INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sucursales (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      ubicacion TEXT NOT NULL,
      sincronizado INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS servicios (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      sincronizado INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS clases (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      fecha_inicio TEXT NOT NULL,
      fecha_fin TEXT NOT NULL,
      cupo_maximo INTEGER,
      instructor TEXT,
      id_sucursal INTEGER,
      id_servicio INTEGER,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
      FOREIGN KEY (id_servicio) REFERENCES servicios(id)
    );

    CREATE TABLE IF NOT EXISTS clientexclase (
      id_cliente TEXT,
      id_clase INTEGER,
      PRIMARY KEY (id_cliente, id_clase),
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (id_cliente) REFERENCES clientes(cedula),
      FOREIGN KEY (id_clase) REFERENCES clases(id)
    );

    CREATE TABLE IF NOT EXISTS plan_trabajo (
      id INTEGER PRIMARY KEY NOT NULL,
      id_cliente TEXT NOT NULL,
      fecha_inicio TEXT NOT NULL,
      fecha_fin TEXT NOT NULL,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (id_cliente) REFERENCES clientes(cedula)
    );

    CREATE TABLE IF NOT EXISTS detalle_plan (
      id INTEGER PRIMARY KEY NOT NULL,
      id_plan INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      tipo_actividad TEXT,
      duracion TEXT,
      observaciones TEXT,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (id_plan) REFERENCES plan_trabajo(id)
    );
  `);
};

export const getDb = () => db;