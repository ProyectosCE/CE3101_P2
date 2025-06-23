import { getDb } from '../utils/database';

const db = getDb();

// Inserta un cliente nuevo
export const insertCliente = async (cliente: {
  cedula: string;
  nombre: string;
  edad: number;
  fecha_nacimiento: string;
  peso: number;
  imc: number;
  direccion: string;
  correo: string;
  password: string;
}) => {
  await db.runAsync(
    `INSERT INTO clientes (cedula, nombre, edad, fecha_nacimiento, peso, imc, direccion, correo, password, sincronizado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`,
    [
      cliente.cedula,
      cliente.nombre,
      cliente.edad,
      cliente.fecha_nacimiento,
      cliente.peso,
      cliente.imc,
      cliente.direccion,
      cliente.correo,
      cliente.password,
    ]
  );
};

// Obtiene un cliente por correo y contraseña (login)
export const getClienteByLogin = async (correo: string, password: string) => {
  const result = await db.getFirstAsync(
    `SELECT * FROM clientes WHERE correo = ? AND password = ?;`,
    [correo, password]
  );
  return result;
};

// Obtiene un cliente por cédula
export const getClienteByCedula = async (cedula: string) => {
  const result = await db.getFirstAsync(
    `SELECT * FROM clientes WHERE cedula = ?;`,
    [cedula]
  );
  return result;
};

// Actualiza campos editables del cliente
export const updateCliente = async (cliente: {
  edad: number;
  peso: number;
  imc: number;
  direccion: string;
  correo: string;
}) => {
  await db.runAsync(
    `UPDATE clientes SET edad = ?, peso = ?, imc = ?, direccion = ?, sincronizado = 0 WHERE correo = ?;`,
    [cliente.edad, cliente.peso, cliente.imc, cliente.direccion, cliente.correo]
  );
};
