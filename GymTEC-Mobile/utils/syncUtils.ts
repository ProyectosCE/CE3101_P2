import { getDb } from './database';

const db = getDb();

// Marca como sincronizado un registro específico por tabla e ID
export const marcarComoSincronizado = async (tabla: string, campoId: string, valorId: string | number) => {
  await db.runAsync(
    `UPDATE ${tabla} SET sincronizado = 1 WHERE ${campoId} = ?;`,
    [valorId]
  );
};

// Obtiene todos los registros no sincronizados de una tabla
export const obtenerNoSincronizados = async (tabla: string) => {
  return await db.getAllAsync(`SELECT * FROM ${tabla} WHERE sincronizado = 0;`);
};

// Borra un registro sincronizado (opcional para limpiezas)
export const borrarSiSincronizado = async (tabla: string, campoId: string, valorId: string | number) => {
  await db.runAsync(
    `DELETE FROM ${tabla} WHERE ${campoId} = ? AND sincronizado = 1;`,
    [valorId]
  );
};
