// src/pages/instructor/Dashboard.tsx

import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import styles from '../../styles/InstructorPage.module.css';

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo centrado */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón Inicio */}
      <button
        className={styles.homeButton}
        onClick={() => router.push('/instructor/Dashboard')}
      >
        <i className="fas fa-home" /> Inicio
      </button>

      {/* Botón Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt" /> Cerrar Sesión
      </button>

      {/* Contenedor principal con tarjetas */}
      <div className={styles.contentCard}>
        {/* Encabezado de bienvenida */}
        <h2 className={styles.mainHeader}>
          <i className="fas fa-dumbbell" /> Bienvenido, {user?.nombre_completo}
        </h2>
        <p className={styles.subHeader}>
          Acceda rápidamente a las funciones de Instructor
        </p>

        {/* Fila de tarjetas */}
        <div className={styles.cardsRow}>
          {/* Asignar Cliente */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-user-plus" /> Asignar Cliente
            </div>
            <div className={styles.cardBody}>
              <i className="fas fa-user-friends me-2 text-primary" />
              Busque clientes sin instructor y asígnese como su entrenador.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/instructor/AssignClient')}
            >
              <i className="fas fa-user-check" /> Asignar Cliente
            </button>
          </div>

          {/* Crear Plan de Trabajo */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-clipboard-list" /> Crear Plan de Trabajo
            </div>
            <div className={styles.cardBody}>
              <i className="fas fa-calendar-week me-2 text-success" />
              Diseñe y asigne planes semanales o mensuales a sus clientes.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/instructor/CreateWorkPlan')}
            >
              <i className="fas fa-calendar-alt" /> Crear Plan
            </button>
          </div>

          {/* Registrar Clase */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-stopwatch" /> Registrar Clase
            </div>
            <div className={styles.cardBody}>
              <i className="fas fa-chalkboard-teacher me-2 text-warning" />
              Agende y facture sus clases (individuales o grupales).
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/instructor/RegisterClass')}
            >
              <i className="fas fa-chalkboard-teacher" /> Registrar Clase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
