// src/pages/admin/GymConfiguration.tsx

import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

export default function GymConfiguration() {
  const { logout } = useAuth();
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
        onClick={() => router.push('/admin/Dashboard')}
      >
        <i className="fas fa-home"></i> Inicio
      </button>

      {/* Botón Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      {/* Encabezado */}
      <h2 className={styles.mainHeader}>
        <i className="fas fa-sliders-h"></i> Configuración de Gimnasio
      </h2>
      <p className={styles.subHeader}>
        Desde aquí puede asociar tratamientos, productos, inventario y crear clases.
      </p>

      {/* Contenedor de sección Configuración */}
      <div className={styles.sectionContainer}>
        <div className={styles.cardsRow}>
          {/* Tratamientos → Spa */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-spa"></i> Tratamientos → Spa
            </div>
            <div className={styles.cardBody}>
              Permite asociar tratamientos al Spa de cada sucursal.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/TreatmentAssignment')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Spa
            </button>
          </div>

          {/* Productos → Tienda */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-store"></i> Productos → Tienda
            </div>
            <div className={styles.cardBody}>
              Permite asociar productos a la tienda de conveniencia.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/ProductAssignment')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Tienda
            </button>
          </div>

          {/* Inventario → Sedes */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-warehouse"></i> Inventario → Sedes
            </div>
            <div className={styles.cardBody}>
              Permite asignar máquinas a sucursales.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/InventoryAssignment')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Inventario
            </button>
          </div>

          {/* Crear Clases */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-chalkboard-teacher"></i> Crear Clases
            </div>
            <div className={styles.cardBody}>
              Permite crear nuevas clases con tipo e instructor.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/CreateClasses')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Clases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
