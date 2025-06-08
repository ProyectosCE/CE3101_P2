// src/pages/instructor/AssignClient.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/InstructorPage.module.css';

interface Cliente {
  id_cliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  id_instructor: number | null;
}

export default function AssignClientPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const instructorId = user?.id_empleado ?? -1;

  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id_cliente: 1,
      cedula: '101010101',
      nombres: 'Juan',
      apellidos: 'Pérez',
      correo: 'juan.perez@mail.com',
      id_instructor: null,
    },
    {
      id_cliente: 2,
      cedula: '202020202',
      nombres: 'María',
      apellidos: 'López',
      correo: 'maria.lopez@mail.com',
      id_instructor: null,
    },
    {
      id_cliente: 3,
      cedula: '303030303',
      nombres: 'Carlos',
      apellidos: 'Martínez',
      correo: 'carlos.mart@mail.com',
      id_instructor: 7,
    },
    {
      id_cliente: 4,
      cedula: '404040404',
      nombres: 'Ana',
      apellidos: 'Gómez',
      correo: 'ana.gomez@mail.com',
      id_instructor: null,
    },
  ]);

  useEffect(() => {
    // Si integras API, haz fetch aquí
  }, []);

  const asignarInstructor = (idCliente: number) => {
    setClientes(prev =>
      prev.map(c =>
        c.id_cliente === idCliente
          ? { ...c, id_instructor: instructorId }
          : c
      )
    );
    alert(`Instructor asignado al cliente con cédula ${
      clientes.find(c => c.id_cliente === idCliente)?.cedula
    }.`);
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
          <i className="fas fa-user-plus"></i> Asignar Instructor a Cliente
        </h2>
        <p className={styles.subHeader}>
          Asigna a los clientes que aún no tienen instructor
        </p>

        {/* Contenido en tarjeta */}
        <div className={styles.contentCard}>
          <h3>
            <i className="fas fa-users"></i> Clientes Disponibles
          </h3>
          <div className="table-responsive">
            <table className="table table-hover mt-3">
              <thead>
                <tr>
                  <th><i className="fas fa-id-badge"></i> ID</th>
                  <th><i className="fas fa-address-card"></i> Cédula</th>
                  <th><i className="fas fa-user"></i> Nombre Completo</th>
                  <th><i className="fas fa-envelope"></i> Correo</th>
                  <th><i className="fas fa-user-check"></i> Estado</th>
                  <th><i className="fas fa-cog"></i> Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td>{cliente.id_cliente}</td>
                    <td>{cliente.cedula}</td>
                    <td>{cliente.nombres} {cliente.apellidos}</td>
                    <td>{cliente.correo}</td>
                    <td>
                      {cliente.id_instructor ? (
                        <span className="badge bg-success">
                          <i className="fas fa-check-circle"></i> Asignado
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          <i className="fas fa-user-slash"></i> Sin Instructor
                        </span>
                      )}
                    </td>
                    <td>
                      {!cliente.id_instructor ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => asignarInstructor(cliente.id_cliente)}
                        >
                          <i className="fas fa-user-plus"></i> Asignar
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-secondary" disabled>
                          <i className="fas fa-user-alt-slash"></i> Asignado
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
