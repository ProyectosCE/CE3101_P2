import { getDb } from '../utils/database';

const db = getDb();

// Inserta una clase nueva
export const insertClase = async (clase: {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  cupo_maximo: number;
  instructor: string;
  id_sucursal: number;
  id_servicio: number;
}) => {
  await db.runAsync(
    `INSERT INTO clases (id, nombre, fecha_inicio, fecha_fin, cupo_maximo, instructor, id_sucursal, id_servicio, sincronizado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0);`,
    [
      clase.id,
      clase.nombre,
      clase.fecha_inicio,
      clase.fecha_fin,
      clase.cupo_maximo,
      clase.instructor,
      clase.id_sucursal,
      clase.id_servicio,
    ]
  );
};

// Buscar clases con filtros opcionales
export const getClasesFiltradas = async (filtros: {
  idSucursal?: number;
  idServicio?: number;
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  const condiciones: string[] = [];
  const valores: any[] = [];

  if (filtros.idSucursal) {
    condiciones.push('id_sucursal = ?');
    valores.push(filtros.idSucursal);
  }
  if (filtros.idServicio) {
    condiciones.push('id_servicio = ?');
    valores.push(filtros.idServicio);
  }
  if (filtros.fechaInicio && filtros.fechaFin) {
    condiciones.push('fecha_inicio >= ? AND fecha_fin <= ?');
    valores.push(filtros.fechaInicio, filtros.fechaFin);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

  const results = await db.getAllAsync(
    `SELECT clases.*, sucursales.nombre as nombre_sucursal, servicios.nombre as nombre_servicio
     FROM clases
     JOIN sucursales ON clases.id_sucursal = sucursales.id
     JOIN servicios ON clases.id_servicio = servicios.id
     ${where};`,
    valores
  );

  return results;
};

// Obtener una clase por ID
export const getClaseById = async (id: number) => {
  return await db.getFirstAsync(`SELECT * FROM clases WHERE id = ?`, [id]);
};
