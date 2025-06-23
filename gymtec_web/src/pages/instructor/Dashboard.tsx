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
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>

        <button className={styles.homeButton} onClick={() => router.push('/instructor/Dashboard')}>
          <i className="fas fa-home" /> Inicio
        </button>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" /> Cerrar Sesión
        </button>

        <div className={styles.contentCard}>
          <h2 className={styles.mainHeader}>
            <i className="fas fa-dumbbell" /> Bienvenido, {user?.nombre}
          </h2>
          <p className={styles.subHeader}>
            Acceda rápidamente a sus funciones
          </p>

          <div className={styles.cardsRow}>
            <div className={styles.cardCustom}>
              <div className={styles.cardHeader}>
                <i className="fas fa-user-plus" /> Asignar Cliente
              </div>
              <div className={styles.cardBody}>
                <i className="fas fa-user-friends me-2 text-primary" />
                Asigne clientes sin instructor
              </div>
              <button className={styles.cardButton} onClick={() => router.push('/instructor/AssignClient')}>
                <i className="fas fa-user-check" /> Asignar Cliente
              </button>
            </div>

            <div className={styles.cardCustom}>
              <div className={styles.cardHeader}>
                <i className="fas fa-clipboard-list" /> Crear Plan de Trabajo
              </div>
              <div className={styles.cardBody}>
                <i className="fas fa-calendar-week me-2 text-success" />
                Diseñe y asigne planes
              </div>
              <button className={styles.cardButton} onClick={() => router.push('/instructor/CreateWorkPlan')}>
                <i className="fas fa-calendar-alt" /> Crear Plan
              </button>
            </div>

            <div className={styles.cardCustom}>
              <div className={styles.cardHeader}>
                <i className="fas fa-stopwatch" /> Registrar Clase
              </div>
              <div className={styles.cardBody}>
                <i className="fas fa-chalkboard-teacher me-2 text-warning" />
                Agende y facture sus clases
              </div>
              <button className={styles.cardButton} onClick={() => router.push('/instructor/RegisterClass')}>
                <i className="fas fa-chalkboard-teacher" /> Registrar Clase
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
