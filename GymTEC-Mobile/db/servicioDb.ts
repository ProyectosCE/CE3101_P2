import { getDb } from '../utils/database';

const db = getDb();

// Insertar un servicio
export const insertServicio = async (servicio: {
  id: number;
  nombre: string;
  descripcion: string;
}) => {
  await db.runAsync(
    `INSERT INTO servicios (id, nombre, descripcion, sincronizado)
     VALUES (?, ?, ?, 0);`,
    [servicio.id, servicio.nombre, servicio.descripcion]
  );
};

// Obtener todos los servicios
export const getAllServicios = async () => {
  return await db.getAllAsync(`SELECT * FROM servicios;`);
};