import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/InstructorPage.module.css';

interface Servicio { id_servicio: number; descripcion: string; }
interface Clase {
  id_clase: number;
  id_servicio: number;
  id_instructor: number;
  grupal: boolean;
  capacidad: number | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_dispo: number;
  clientes_iniciales: number[];
}
export default function RegisterClassPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const instructorId = user?.id ?? -1;

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [idServicio, setIdServicio] = useState<number | ''>('');
  const [grupal, setGrupal] = useState(false);
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createdClasses, setCreatedClasses] = useState<Clase[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadFromStorage = localStorage.getItem('gymtec_created_classes');
    if (loadFromStorage) setCreatedClasses(JSON.parse(loadFromStorage));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/servicio`)
        .then(res => res.json())
        .then(json => { if (json.success) setServicios(json.data); })
        .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (idServicio === '' || !fecha || !horaInicio || !horaFin) {
      setError('Completa todos los campos.');
      return;
    }
    if (grupal && (!capacidad || capacidad < 1)) {
      setError('Capacidad inválida.');
      return;
    }

    try {
      const payload = {
        id_servicio: idServicio,
        id_instructor: instructorId,
        grupal,
        capacidad: grupal ? capacidad : null,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      };

      const res = await fetch(`${API_URL}/api/clase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Error ${res.status}`);
      }

      const nuevaClase: Clase = json.data;
      const updated = [nuevaClase, ...createdClasses];
      setCreatedClasses(updated);
      localStorage.setItem('gymtec_created_classes', JSON.stringify(updated));

      // reset
      setIdServicio('');
      setGrupal(false);
      setCapacidad('');
      setFecha('');
      setHoraInicio('');
      setHoraFin('');
      setError(null);

    } catch (err: any) {
      setError(err.message || 'Error al registrar la clase.');
    }
  };

  return (
      <div className={styles.pageContainer}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage}/>
        </div>
        <button className={styles.homeButton} onClick={() => router.push('/instructor/Dashboard')}>
          <i className="fas fa-home"/> Inicio
        </button>
        <button className={styles.logoutButton} onClick={() => logout()}>
          <i className="fas fa-sign-out-alt"/> Cerrar Sesión
        </button>

        <main className="container mt-4">
          <h2 className={styles.mainHeader}><i className="fas fa-stopwatch"/> Registro de Clase</h2>
          <p className={styles.subHeader}>Complete los datos y registre la clase</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className={styles.contentCard}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label"><i className="fas fa-dumbbell"/> Servicio</label>
                <select className="form-select" value={idServicio} onChange={e => setIdServicio(Number(e.target.value))} required>
                  <option value="">-- Seleccione --</option>
                  {servicios.map(s => (
                      <option key={s.id_servicio} value={s.id_servicio}>{s.descripcion}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="fas fa-users"/> Modalidad</label><br/>
                <div className="form-check form-check-inline">
                  <input type="radio" id="ind" className="form-check-input" checked={!grupal} onChange={() => setGrupal(false)}/>
                  <label htmlFor="ind" className="form-check-label">Individual</label>
                </div>
                <div className="form-check form-check-inline">
                  <input type="radio" id="grp" className="form-check-input" checked={grupal} onChange={() => setGrupal(true)}/>
                  <label htmlFor="grp" className="form-check-label">Grupal</label>
                </div>
              </div>

              {grupal && (
                  <div className="mb-3">
                    <label className="form-label"><i className="fas fa-chart-bar"/> Capacidad</label>
                    <input type="number" className="form-control" value={capacidad} onChange={e => setCapacidad(Number(e.target.value))} min={1} required/>
                  </div>
              )}

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label"><i className="fas fa-calendar-day"/> Fecha</label>
                  <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} required/>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label"><i className="fas fa-hourglass-start"/> Hora Inicio</label>
                  <input type="time" className="form-control" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} required/>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label"><i className="fas fa-hourglass-end"/> Hora Fin</label>
                  <input type="time" className="form-control" value={horaFin} onChange={e => setHoraFin(e.target.value)} required/>
                </div>
              </div>

              <button type="submit" className="btn btn-success"><i className="fas fa-check-circle"/> Registrar Clase</button>
            </form>

            {createdClasses.length > 0 && (
                <div className="mt-5">
                  <h3><i className="fas fa-list"/> Clases Registradas</h3>
                  <div className="table-responsive">
                    <table className="table table-bordered mt-3">
                      <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Servicio</th>
                        <th>Modalidad</th>
                        <th>Capacidad</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                      </tr>
                      </thead>
                      <tbody>
                      {createdClasses.map(c => (
                          <tr key={c.id_clase}>
                            <td>{c.id_clase}</td>
                            <td>{servicios.find(s => s.id_servicio === c.id_servicio)?.descripcion}</td>
                            <td>{c.grupal ? 'Grupal' : 'Individual'}</td>
                            <td>{c.grupal ? c.capacidad : '—'}</td>
                            <td>{c.fecha}</td>
                            <td>{c.hora_inicio} – {c.hora_fin}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}
          </div>
        </main>
      </div>
  );
}
