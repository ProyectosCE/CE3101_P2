// src/pages/cliente/SearchAndRegisterClass.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/ClientPage.module.css';

export default function SearchAndRegisterClass() {
  const { logout } = useAuth();
  const router = useRouter();

  const [sucursal, setSucursal] = useState('');
  const [servicio, setServicio] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Buscando en '${sucursal}', servicio '${servicio}', modalidad '${modalidad}', de ${fromDate} a ${toDate}`
    );
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
        onClick={() => router.push('/cliente/Dashboard')}
      >
        <i className="fas fa-home" /> Inicio
      </button>

      {/* Botón “Cerrar Sesión” */}
      <button
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        <i className="fas fa-sign-out-alt" /> Cerrar Sesión
      </button>

      {/* Contenedor principal */}
      <div className={styles.contentCard}>
        <h3>
          <i className="fas fa-search" /> Buscar y Registrar Clase
        </h3>

        <form onSubmit={handleSearch}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">
                <i className="fas fa-building me-1" /> Sucursal
              </label>
              <select
                className="form-select"
                value={sucursal}
                onChange={e => setSucursal(e.target.value)}
                required
              >
                <option value="">Seleccione sede…</option>
                <option>Campus Tecnológico Central Cartago</option>
                <option>Campus Tecnológico Local San Carlos</option>
                <option>Campus Tecnológico Local San José</option>
                <option>Centro Académico de Alajuela</option>
                <option>Centro Académico de Limón</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <i className="fas fa-dumbbell me-1" /> Tipo de Servicio
              </label>
              <select
                className="form-select"
                value={servicio}
                onChange={e => setServicio(e.target.value)}
                required
              >
                <option value="">Seleccione…</option>
                <option>Indoor Cycling</option>
                <option>Pilates</option>
                <option>Yoga</option>
                <option>Zumba</option>
                <option>Natación</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <i className="fas fa-layer-group me-1" /> Modalidad
              </label>
              <select
                className="form-select"
                value={modalidad}
                onChange={e => setModalidad(e.target.value)}
                required
              >
                <option value="">Seleccione…</option>
                <option value="Individual">Individual</option>
                <option value="Grupal">Grupal</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">
                <i className="fas fa-calendar-alt me-1" /> Desde
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-calendar-day" />
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label">
                <i className="fas fa-calendar-alt me-1" /> Hasta
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-calendar-day" />
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            <i className="fas fa-search" /> Buscar
          </button>
        </form>

        {/* Placeholder de resultados */}
        <div style={{ textAlign: 'center', color: '#777', marginTop: '2rem' }}>
          <i className="fas fa-spinner fa-pulse me-2" /> No hay datos para mostrar
        </div>
      </div>
    </div>
  );
}
