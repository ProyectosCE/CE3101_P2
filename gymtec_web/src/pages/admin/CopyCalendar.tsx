import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

export default function CopyCalendarPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [sourceWeek, setSourceWeek] = useState('');  // fecha inicio semana origen
  const [targetWeek, setTargetWeek] = useState('');  // fecha inicio semana destino
  const [message, setMessage] = useState('');

  const handleCopy = () => {
    if (!sourceWeek || !targetWeek) {
      alert('Debe seleccionar ambas fechas de semana.');
      return;
    }
    // Aquí iría la llamada al API / SP para copiar
    setMessage(`Actividades de la semana del ${sourceWeek} copiados a la semana del ${targetWeek}.`);
  };

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
        <i className="fas fa-copy"></i> Copiar Calendario
      </h2>
      <p className={styles.subHeader}>
        Seleccione la semana de origen y la semana destino para duplicar actividades.
      </p>

      {/* Contenedor de formulario */}
      <div className={styles.contentCard}>
        <div className="row g-3 align-items-end">
          {/* Semana origen */}
          <div className="col-md-6">
            <label className="form-label"><strong>Semana Origen</strong></label>
            <input
              type="date"
              className="form-control"
              value={sourceWeek}
              onChange={e => setSourceWeek(e.target.value)}
            />
            <small className="text-muted">Fecha inicio de la semana a copiar</small>
          </div>

          {/* Semana destino */}
          <div className="col-md-6">
            <label className="form-label"><strong>Semana Destino</strong></label>
            <input
              type="date"
              className="form-control"
              value={targetWeek}
              onChange={e => setTargetWeek(e.target.value)}
            />
            <small className="text-muted">Fecha inicio de la nueva semana</small>
          </div>

          {/* Botón Copiar */}
          <div className="col-12 text-end">
            <button className="btn btn-primary" onClick={handleCopy}>
              <i className="fas fa-copy"></i> Copiar Actividades
            </button>
          </div>
        </div>

        {/* Mensaje de confirmación */}
        {message && (
          <div className="alert alert-success mt-4">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
