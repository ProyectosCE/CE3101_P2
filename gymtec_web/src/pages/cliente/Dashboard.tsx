// src/pages/cliente/Dashboard.tsx

import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/ClientPage.module.css';

export default function ClienteDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Cierra sesión y lleva a /login
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo centrado en la parte superior */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón de Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      {/* Tarjeta de contenido principal */}
      <div className={styles.contentCard}>
        {/* Encabezado de bienvenida */}
        <h2 className={styles.mainHeader}>
          <i className="fas fa-user-circle"></i> Bienvenido, {user?.nombre_completo}
        </h2>
        <p className={styles.subHeader}>
          Desde aquí puede ver su plan de trabajo o buscar y registrarse en nuevas clases.
        </p>

        {/* Filas de tarjetas con accesos rápidos */}
        <div className={styles.cardsRow}>
          {/* Tarjeta: Mi Plan de Trabajo */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-calendar-alt"></i> Mi Plan de Trabajo
            </div>
            <div className={styles.cardBody}>
              Consulte día a día el calendario de entrenamientos que tiene asignado.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/cliente/MyPlan')}
            >
              <i className="fas fa-eye"></i> Ver Mi Plan
            </button>
          </div>

          {/* Tarjeta: Buscar y registrar clase */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-search"></i> Buscar Clases
            </div>
            <div className={styles.cardBody}>
              Explore las clases disponibles por tipo, fecha e instructor y regístrese.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/cliente/SearchAndRegisterClass')}
            >
              <i className="fas fa-plus-circle"></i> Buscar Clases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
