// src/pages/instructor/CreateWorkPlan.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/InstructorPage.module.css';

interface Cliente {
  id_cliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
}

interface PlanTrabajo {
  id_plan_trabajo: number;
  id_cliente: number;
  start_date: string;
  end_date: string;
  descripcion: string;
  id_instructor: number;
}

export default function CreateWorkPlanPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const instructorId = user?.id_empleado ?? -1;

  const [clientes] = useState<Cliente[]>([
    { id_cliente: 1, cedula: '101010101', nombres: 'Juan', apellidos: 'Pérez' },
    { id_cliente: 2, cedula: '202020202', nombres: 'María', apellidos: 'López' },
    { id_cliente: 3, cedula: '303030303', nombres: 'Carlos', apellidos: 'Martínez' },
    { id_cliente: 4, cedula: '404040404', nombres: 'Ana', apellidos: 'Gómez' },
  ]);

  const [idCliente, setIdCliente] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [createdPlans, setCreatedPlans] = useState<PlanTrabajo[]>([]);

  useEffect(() => {
    const guardados = localStorage.getItem('gymtec_created_plans');
    if (guardados) setCreatedPlans(JSON.parse(guardados));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idCliente === '' || !startDate || !endDate) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    const nuevoPlan: PlanTrabajo = {
      id_plan_trabajo: Date.now(),
      id_cliente: idCliente as number,
      start_date: startDate,
      end_date: endDate,
      descripcion,
      id_instructor: instructorId,
    };
    const updated = [nuevoPlan, ...createdPlans];
    setCreatedPlans(updated);
    localStorage.setItem('gymtec_created_plans', JSON.stringify(updated));
    setIdCliente('');
    setStartDate('');
    setEndDate('');
    setDescripcion('');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón “Inicio” */}
      <button
        className={styles.homeButton}
        onClick={() => router.push('/instructor/Dashboard')}
      >
        <i className="fas fa-home"></i> Inicio
      </button>

      {/* Botón Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={() => logout()}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      <main className="container">
        {/* Encabezado */}
        <h2 className={styles.mainHeader}>
          <i className="fas fa-clipboard-list"></i> Creación de Plan de Trabajo
        </h2>
        <p className={styles.subHeader}>
          Diseña un plan semanal o mensual y asígnalo a un cliente
        </p>

        {/* Contenido en tarjeta */}
        <div className={styles.contentCard}>
          <h3>
            <i className="fas fa-pen"></i> Nuevo Plan de Trabajo
          </h3>
          <form onSubmit={handleSubmit} className="mt-3">
            {/* Cliente */}
            <div className="mb-3">
              <label htmlFor="clienteSelect" className="form-label">
                <i className="fas fa-user"></i> Cliente
              </label>
              <select
                id="clienteSelect"
                className="form-select"
                value={idCliente}
                onChange={e => setIdCliente(Number(e.target.value))}
                required
              >
                <option value="">-- Seleccione un cliente --</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombres} {c.apellidos} (Cédula: {c.cedula})
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Inicio */}
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                <i className="fas fa-calendar-alt"></i> Fecha de Inicio
              </label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* Fecha de Fin */}
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">
                <i className="fas fa-calendar-check"></i> Fecha de Fin
              </label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>

            {/* Descripción */}
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                <i className="fas fa-align-left"></i> Descripción
              </label>
              <textarea
                id="descripcion"
                className="form-control"
                rows={4}
                placeholder="Describe objetivos, ejercicios y metas..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success">
              <i className="fas fa-save"></i> Guardar Plan
            </button>
          </form>

          {/* Lista de planes creados */}
          {createdPlans.length > 0 && (
            <div className="mt-5">
              <h3>
                <i className="fas fa-list-alt"></i> Planes Creados
              </h3>
              <div className="table-responsive">
                <table className="table table-bordered mt-3">
                  <thead className="table-light">
                    <tr>
                      <th>ID Plan</th>
                      <th>Cliente</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdPlans.map(plan => {
                      const cli = clientes.find(c => c.id_cliente === plan.id_cliente);
                      return (
                        <tr key={plan.id_plan_trabajo}>
                          <td>{plan.id_plan_trabajo}</td>
                          <td>{cli?.nombres} {cli?.apellidos}</td>
                          <td>{plan.start_date}</td>
                          <td>{plan.end_date}</td>
                          <td>{plan.descripcion || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
