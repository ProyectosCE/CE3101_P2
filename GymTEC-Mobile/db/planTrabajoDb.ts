import { getDb } from '../utils/database';

const db = getDb();

// Inserta un plan de trabajo
export const insertPlanTrabajo = async (plan: {
  id: number;
  id_cliente: string;
  fecha_inicio: string;
  fecha_fin: string;
}) => {
  await db.runAsync(
    `INSERT INTO plan_trabajo (id, id_cliente, fecha_inicio, fecha_fin, sincronizado)
     VALUES (?, ?, ?, ?, 0);`,
    [plan.id, plan.id_cliente, plan.fecha_inicio, plan.fecha_fin]
  );
};

// Inserta un detalle de plan de trabajo
export const insertDetallePlan = async (detalle: {
  id: number;
  id_plan: number;
  fecha: string;
  tipo_actividad: string;
  duracion: string;
  observaciones: string;
}) => {
  await db.runAsync(
    `INSERT INTO detalle_plan (id, id_plan, fecha, tipo_actividad, duracion, observaciones, sincronizado)
     VALUES (?, ?, ?, ?, ?, ?, 0);`,
    [
      detalle.id,
      detalle.id_plan,
      detalle.fecha,
      detalle.tipo_actividad,
      detalle.duracion,
      detalle.observaciones,
    ]
  );
};

// Obtener plan de trabajo por cliente
export const getPlanTrabajoByCliente = async (cedula: string) => {
  return await db.getAllAsync(
    `SELECT * FROM plan_trabajo WHERE id_cliente = ?;`,
    [cedula]
  );
};

// Obtener detalle del plan por fecha específica
export const getDetallePlanByFecha = async (idPlan: number, fecha: string) => {
  return await db.getFirstAsync(
    `SELECT * FROM detalle_plan WHERE id_plan = ? AND fecha = ?;`,
    [idPlan, fecha]
  );
};
