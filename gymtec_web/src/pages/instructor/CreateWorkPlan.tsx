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
  const instructorId = user?.id ?? -1;

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [idCliente, setIdCliente] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [createdPlans, setCreatedPlans] = useState<PlanTrabajo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/cliente`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));

          switch (res.status) {
            case 400:
              throw new Error(errorData.error || 'Solicitud incorrecta');
            case 401:
              logout();
              router.push('/login');
              return;
            case 404:
              throw new Error(errorData.error || 'Recurso no encontrado');
            case 500:
              throw new Error(errorData.error || 'Error del servidor');
            default:
              throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
          }
        }

        const data = await res.json();

        if (data.success) {
          setClientes(data.data);
          setError(null);
        } else {
          throw new Error(data.error || 'Error al obtener clientes');
        }
      } catch (err) {
        console.error('Error al obtener clientes:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al obtener clientes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, [API_URL, logout, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (idCliente === '' || !startDate || !endDate) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const nuevoPlan = {
      id_cliente: idCliente,
      start_date: startDate,
      end_date: endDate,
      descripcion,
      id_instructor: instructorId,
    };

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/plantrabajo/${idCliente}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPlan),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        switch (res.status) {
          case 400:
            throw new Error(errorData.error || 'Datos del plan de trabajo inválidos');
          case 401:
            logout();
            router.push('/login');
            return;
          case 404:
            throw new Error(errorData.error || 'Cliente no encontrado');
          case 500:
            throw new Error(errorData.error || 'Error al guardar el plan de trabajo');
          default:
            throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
        }
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al crear el plan');
      }

      setCreatedPlans(prev => [data.data, ...prev]);
      setError(null);
      alert('Plan creado correctamente.');

      // Resetear formulario
      setIdCliente('');
      setStartDate('');
      setEndDate('');
      setDescripcion('');
    } catch (error: any) {
      console.error('Error al crear plan:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className={styles.pageContainer}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>

        {/* Botón Inicio */}
        <button
            className={styles.homeButton}
            onClick={() => router.push('/instructor/Dashboard')}
        >
          <i className="fas fa-home"></i> Inicio
        </button>

        {/* Botón Cerrar Sesión */}
        <button className={styles.logoutButton} onClick={logout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>

        <main className="container">
          <h2 className={styles.mainHeader}>
            <i className="fas fa-clipboard-list"></i> Creación de Plan de Trabajo
          </h2>
          <p className={styles.subHeader}>
            Diseña un plan semanal o mensual y asígnalo a un cliente
          </p>

          {/* Mostrar mensaje de error si existe */}
          {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
          )}

          {/* Mostrar indicador de carga */}
          {isLoading && (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Procesando solicitud...</p>
              </div>
          )}

          <div className={styles.contentCard}>
            <h3><i className="fas fa-pen"></i> Nuevo Plan de Trabajo</h3>
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                />
              </div>

              <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
              >
                {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                ) : (
                    <>
                      <i className="fas fa-save"></i> Guardar Plan
                    </>
                )}
              </button>
            </form>

            {/* Planes creados */}
            {createdPlans.length > 0 && (
                <div className="mt-5">
                  <h3><i className="fas fa-list-alt"></i> Planes Creados</h3>
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