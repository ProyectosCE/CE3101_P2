// src/pages/admin/Dashboard.tsx

import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

export default function AdminDashboard() {
  // Se extraen datos de usuario y logout
  const { user, logout } = useAuth();
  const router = useRouter();

  // Maneja el cierre de sesión
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

      {/* Botón Configuración en la esquina superior izquierda */}
      <button
        className={styles.homeButton}
        style={{ left: '16px' }}
        onClick={() => router.push('/admin/GymConfiguration')}
      >
        <i className="fas fa-sliders-h"></i> Configuración
      </button>

      {/* Botón Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      {/* Encabezado */}
      <h2 className={styles.mainHeader}>
        <i className="fas fa-cogs"></i> Panel de Administrador
      </h2>
      <p className={styles.subHeader}>
        Desde aquí puede gestionar sedes, puestos, empleados, servicios, inventario, Spa, tipos de equipo, productos y tipos de planilla.
      </p>

      {/* Contenedor de sección Gestión */}
      <div className={styles.sectionContainer}>
        <div className={styles.cardsRow}>
          {/* Gestión de Sucursales */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-building"></i> Sucursales
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar sedes y horarios.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/Branches')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Sucursales
            </button>
          </div>

          {/* Gestión de Puestos */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-briefcase"></i> Puestos
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar los puestos del gimnasio.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/Positions')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Puestos
            </button>
          </div>

          {/* Gestión de Empleados */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-user-tie"></i> Empleados
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar empleados.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/Employees')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Empleados
            </button>
          </div>

          {/* Gestión de Servicios */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-dumbbell"></i> Servicios
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar servicios ofrecidos.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/Services')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Servicios
            </button>
          </div>

          {/* Gestión de Inventario */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-boxes"></i> Inventario
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar equipos y máquinas.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/Inventory')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Inventario
            </button>
          </div>

          {/* Gestión de Spa */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-spa"></i> Spa
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar tratamientos de Spa.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/SpaTreatments')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Spa
            </button>
          </div>

          {/* Gestión de Tipos de Equipo */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-cogs"></i> Tipos de Equipo
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar tipos de equipo del gimnasio.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/EquipmentTypes')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Tipos de Equipo
            </button>
          </div>

          {/* Gestión de Productos */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-barcode"></i> Productos
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar los productos de tienda.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/Products')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Productos
            </button>
          </div>

          {/* Gestión de Tipos de Planilla */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-file-invoice-dollar"></i> Tipos de Planilla
            </div>
            <div className={styles.cardBody}>
              Insertar, editar, eliminar y consultar tipos de planilla.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/PayrollTypes')}
            >
              <i className="fas fa-arrow-right"></i> Ir a Planillas
            </button>
          </div>
          {/* Generación de Planilla */}
        <div className={styles.cardCustom}>
          <div className={styles.cardHeader}>
            <i className="fas fa-file-alt"></i> Generación de Planilla
          </div>
          <div className={styles.cardBody}>
            Calcular montos a pagar a los empleados por sucursal.
          </div>
          <button
            className={styles.cardButton}
            onClick={() => router.push('/admin/PayrollGeneration')}
          >
            <i className="fas fa-arrow-right"></i> Ir a Generar
          </button>
        </div>
        {/* Copiar Calendario de Actividades */}
        <div className={styles.cardCustom}>
          <div className={styles.cardHeader}>
            <i className="fas fa-copy"></i> Copiar Calendario
          </div>
          <div className={styles.cardBody}>
            Copiar las actividades de una semana a otra fecha futura.
          </div>
          <button
            className={styles.cardButton}
            onClick={() => router.push('/admin/CopyCalendar')}
          >
            <i className="fas fa-calendar-week"></i> Ir a Copiar
          </button>
        </div>
        {/* — Nueva tarjeta: Copiar Gimnasio — */}
          <div className={styles.cardCustom}>
            <div className={styles.cardHeader}>
              <i className="fas fa-clone"></i> Copiar Gimnasio
            </div>
            <div className={styles.cardBody}>
              Realizar copia completa de un gimnasio existente en uno nuevo.
            </div>
            <button
              className={styles.cardButton}
              onClick={() => router.push('/admin/CopyGym')}
            >
              <i className="fas fa-clone"></i> Ir a Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
