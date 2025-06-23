import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/InstructorPage.module.css';
import { API_URL } from '@/stores/api';

interface Cliente {
  id_cliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  id_instructor?: number; // por si acaso
}

export default function AsignarClientes() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const instructorId = user?.id ?? -1;

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cliente`);

        if (!res.ok) {
          if (res.status === 401) {
            logout();
            router.push('/login');
            return;
          }
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        if (data.success) {
          setClientes(data.data);
        } else {
          setError(data.error || 'Error al obtener clientes sin instructor');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    fetchClientes();
  }, [API_URL, logout, router]);

  const asignarInstructor = async (cliente: Cliente) => {
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/cliente/${cliente.id_cliente}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cliente, id_instructor: instructorId }), 
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Cliente ${cliente.nombres} ${cliente.apellidos} asignado correctamente.`);
        // eliminar de la lista
        setClientes(prev => prev.filter(c => c.id_cliente !== cliente.id_cliente));
      } else {
        throw new Error(data.error || 'No se pudo asignar el cliente.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar instructor');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      <button className={styles.homeButton} onClick={() => router.push('/instructor/Dashboard')}>
        <i className="fas fa-home"></i> Inicio
      </button>

      <button className={styles.logoutButton} onClick={logout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      <main className="container">
        <h2 className={styles.mainHeader}>
          <i className="fas fa-user-plus"></i> Asignar Clientes Sin Instructor
        </h2>

        {error && <div className="alert alert-danger"><i className="fas fa-exclamation-triangle"></i> {error}</div>}
        {successMessage && <div className="alert alert-success"><i className="fas fa-check-circle"></i> {successMessage}</div>}

        <div className={styles.contentCard}>
          {clientes.length === 0 ? (
            <p>No hay clientes sin instructor.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cédula</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td>{cliente.nombres} {cliente.apellidos}</td>
                    <td>{cliente.cedula}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => asignarInstructor(cliente)}
                      >
                        <i className="fas fa-user-check"></i> Asignar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
