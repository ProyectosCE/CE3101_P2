import { getDb } from '../utils/database';

const db = getDb();

// Insertar una sucursal
export const insertSucursal = async (sucursal: {
  id: number;
  nombre: string;
  ubicacion: string;
}) => {
  await db.runAsync(
    `INSERT INTO sucursales (id, nombre, ubicacion, sincronizado)
     VALUES (?, ?, ?, 0);`,
    [sucursal.id, sucursal.nombre, sucursal.ubicacion]
  );
};

// Obtener todas las sucursales
export const getAllSucursales = async () => {
  return await db.getAllAsync(`SELECT * FROM sucursales;`);
};