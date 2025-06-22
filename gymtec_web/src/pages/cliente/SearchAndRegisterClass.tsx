import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/ClientPage.module.css';

export default function SearchAndRegisterClass() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [sucursal, setSucursal] = useState('');
  const [servicio, setServicio] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [clases, setClases] = useState<any[]>([]);
  const [filteredClases, setFilteredClases] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const fetchClases = async () => {
    try {
      const res = await fetch('/api/clase/clases_disponibles');
      const data = await res.json();
      if (data.success) {
        setClases(data.data);
      } else {
        setClases([]);
      }
    } catch (error) {
      console.error('Error fetching clases disponibles:', error);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = clases.filter(c => {
      const fechaClase = c.fecha;
      return (!sucursal || c.sucursal === sucursal) &&
          (!servicio || c.servicio === servicio) &&
          (!modalidad || (modalidad === 'Grupal' ? c.grupal : !c.grupal)) &&
          (!fromDate || fechaClase >= fromDate) &&
          (!toDate || fechaClase <= toDate);
    });
    setFilteredClases(result);
  };

  return (
      <div className={styles.pageContainer}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>

        <button className={styles.homeButton} onClick={() => router.push('/cliente/Dashboard')}>
          <i className="fas fa-home" /> Inicio
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" /> Cerrar Sesión
        </button>

        <div className={styles.contentCard}>
          <h3><i className="fas fa-search" /> Buscar y Registrar Clase</h3>

          <form onSubmit={handleSearch}>
            <div className="row g-3">
              {/* Sucursal */}
              <div className="col-md-6">
                <label className="form-label"><i className="fas fa-building me-1" /> Sucursal</label>
                <select className="form-select" value={sucursal} onChange={e => setSucursal(e.target.value)}>
                  <option value="">Seleccione sede…</option>
                  <option>Campus Tecnológico Central Cartago</option>
                  <option>Campus Tecnológico Local San Carlos</option>
                  <option>Campus Tecnológico Local San José</option>
                  <option>Centro Académico de Alajuela</option>
                  <option>Centro Académico de Limón</option>
                </select>
              </div>

              {/* Servicio */}
              <div className="col-md-6">
                <label className="form-label"><i className="fas fa-dumbbell me-1" /> Tipo de Servicio</label>
                <select className="form-select" value={servicio} onChange={e => setServicio(e.target.value)}>
                  <option value="">Seleccione…</option>
                  <option>Indoor Cycling</option>
                  <option>Pilates</option>
                  <option>Yoga</option>
                  <option>Zumba</option>
                  <option>Natación</option>
                </select>
              </div>

              {/* Modalidad */}
              <div className="col-md-6">
                <label className="form-label"><i className="fas fa-layer-group me-1" /> Modalidad</label>
                <select className="form-select" value={modalidad} onChange={e => setModalidad(e.target.value)}>
                  <option value="">Seleccione…</option>
                  <option value="Individual">Individual</option>
                  <option value="Grupal">Grupal</option>
                </select>
              </div>

              {/* Fecha Desde */}
              <div className="col-md-3">
                <label className="form-label"><i className="fas fa-calendar-alt me-1" /> Desde</label>
                <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>

              {/* Fecha Hasta */}
              <div className="col-md-3">
                <label className="form-label"><i className="fas fa-calendar-alt me-1" /> Hasta</label>
                <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4"><i className="fas fa-search" /> Buscar</button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            {filteredClases.length > 0 ? (
                filteredClases.map((clase, index) => (
                    <div key={index} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                      <p><strong>{clase.servicio}</strong> en <strong>{clase.sucursal}</strong></p>
                      <p>Modalidad: {clase.grupal ? 'Grupal' : 'Individual'}</p>
                      <p>Fecha: {clase.fecha} | Hora: {clase.hora_inicio} - {clase.hora_fin}</p>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', color: '#777' }}>
                  <i className="fas fa-info-circle me-2" /> No hay datos para mostrar
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
