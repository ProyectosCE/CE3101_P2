// src/pages/cliente/MyPlan.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/ClientPage.module.css';

export default function MyPlan() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Parsear fecha ISO → Date local
  const parseLocalDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const localDate = selectedDate ? parseLocalDate(selectedDate) : null;

  const formatDate = (date: Date) =>
    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botones Inicio & Cerrar Sesión */}
      <button
        className={styles.homeButton}
        onClick={() => router.push('/cliente/Dashboard')}
      >
        <i className="fas fa-home" /> Inicio
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt" /> Cerrar Sesión
      </button>

      <div className={styles.contentCard}>
        <h3>
          <i className="fas fa-calendar-alt" /> Mi Plan de Trabajo
        </h3>
        <p>Seleccione una fecha para ver su plan asignado:</p>

        {/* selector de fecha con icono */}
        <div className="input-group mx-auto" style={{ maxWidth: 200 }}>
          <span className="input-group-text">
            <i className="fas fa-calendar-day" />
          </span>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>

        {/* detalle del plan con iconos */}
        {localDate ? (
          <div style={{ marginTop: 20 }}>
            <h4>Plan para {formatDate(localDate)}</h4>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-fire-alt text-danger me-2" />
                Calentamiento: 10 min
              </li>
              <li>
                <i className="fas fa-running text-primary me-2" />
                Cardio: 20 min en cinta
              </li>
              <li>
                <i className="fas fa-dumbbell text-secondary me-2" />
                Fuerza: Circuito de piernas
              </li>
              <li>
                <i className="fas fa-child text-success me-2" />
                Estiramientos: 10 min
              </li>
            </ul>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>
            <i className="fas fa-info-circle me-2" />
            No hay fecha seleccionada.
          </div>
        )}
      </div>
    </div>
  );
}
