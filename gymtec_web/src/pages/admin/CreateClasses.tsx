// src/pages/admin/CreateClasses.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Service {
  id_servicio: number;
  descripcion: string;
}

interface Instructor {
  id_empleado: number;
  nombre_completo: string;
}

interface Clase {
  id_clase: number;
  id_servicio: number;
  id_instructor: number;
  grupal: boolean;
  capacidad: number | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export default function CreateClasses() {
  const { logout } = useAuth();
  const router = useRouter();

  // Datos de ejemplo (reemplazar con API más adelante)
  const [services, setServices] = useState<Service[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  // Form state
  const [idServicio, setIdServicio] = useState<number | ''>('');
  const [idInstructor, setIdInstructor] = useState<number | ''>('');
  const [grupal, setGrupal] = useState<boolean>(false);
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [fecha, setFecha] = useState<string>('');
  const [horaInicio, setHoraInicio] = useState<string>('');
  const [horaFin, setHoraFin] = useState<string>('');

  // Clases creadas en memoria
  const [created, setCreated] = useState<Clase[]>([]);

  useEffect(() => {
    // Servicios de ejemplo
    setServices([
      { id_servicio: 1, descripcion: 'Indoor Cycling' },
      { id_servicio: 2, descripcion: 'Pilates' },
      { id_servicio: 3, descripcion: 'Yoga' },
      { id_servicio: 4, descripcion: 'Zumba' },
      { id_servicio: 5, descripcion: 'Natación' },
    ]);
    // Instructores de ejemplo
    setInstructors([
      { id_empleado: 10, nombre_completo: 'Ana Gómez' },
      { id_empleado: 11, nombre_completo: 'Luis Rodríguez' },
      { id_empleado: 12, nombre_completo: 'María Pérez' },
    ]);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      idServicio === '' ||
      idInstructor === '' ||
      !fecha ||
      !horaInicio ||
      !horaFin ||
      (grupal && (capacidad === '' || capacidad < 1))
    ) {
      alert('Complete todos los campos obligatorios.');
      return;
    }
    const newId = Date.now();
    const nueva: Clase = {
      id_clase: newId,
      id_servicio: idServicio as number,
      id_instructor: idInstructor as number,
      grupal,
      capacidad: grupal ? (capacidad as number) : null,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
    };
    setCreated([nueva, ...created]);
    // Reset
    setIdServicio('');
    setIdInstructor('');
    setGrupal(false);
    setCapacidad('');
    setFecha('');
    setHoraInicio('');
    setHoraFin('');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón Configuración */}
      <button
        className={styles.homeButton}
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
        <i className="fas fa-chalkboard-teacher"></i> Crear Clases
      </h2>
      <p className={styles.subHeader}>
        Agregue nuevas clases indicando servicio, instructor y modalidad.
      </p>

      {/* Contenedor de sección */}
      <div className={styles.sectionContainer}>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Servicio */}
          <div className="col-md-6">
            <label htmlFor="servicio" className="form-label">
              <i className="fas fa-dumbbell"></i> Servicio
            </label>
            <select
              id="servicio"
              className="form-select"
              value={idServicio}
              onChange={e => setIdServicio(Number(e.target.value))}
              required
            >
              <option value="">-- Seleccione servicio --</option>
              {services.map(s => (
                <option key={s.id_servicio} value={s.id_servicio}>
                  {s.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div className="col-md-6">
            <label htmlFor="instructor" className="form-label">
              <i className="fas fa-user-tie"></i> Instructor
            </label>
            <select
              id="instructor"
              className="form-select"
              value={idInstructor}
              onChange={e => setIdInstructor(Number(e.target.value))}
              required
            >
              <option value="">-- Seleccione instructor --</option>
              {instructors.map(i => (
                <option key={i.id_empleado} value={i.id_empleado}>
                  {i.nombre_completo}
                </option>
              ))}
            </select>
          </div>

          {/* Modalidad */}
          <div className="col-md-6">
            <label className="form-label">
              <i className="fas fa-toggle-on"></i> Modalidad
            </label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="ind"
                  name="modalidad"
                  className="form-check-input"
                  checked={!grupal}
                  onChange={() => setGrupal(false)}
                />
                <label htmlFor="ind" className="form-check-label">
                  Individual
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="grp"
                  name="modalidad"
                  className="form-check-input"
                  checked={grupal}
                  onChange={() => setGrupal(true)}
                />
                <label htmlFor="grp" className="form-check-label">
                  Grupal
                </label>
              </div>
            </div>
          </div>

          {/* Capacidad */}
          {grupal && (
            <div className="col-md-6">
              <label htmlFor="capacidad" className="form-label">
                <i className="fas fa-chart-bar"></i> Capacidad Máxima
              </label>
              <input
                type="number"
                id="capacidad"
                className="form-control"
                min={1}
                value={capacidad}
                onChange={e => setCapacidad(Number(e.target.value))}
                required
              />
            </div>
          )}

          {/* Fecha */}
          <div className="col-md-4">
            <label htmlFor="fecha" className="form-label">
              <i className="fas fa-calendar-alt"></i> Fecha
            </label>
            <input
              type="date"
              id="fecha"
              className="form-control"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Hora Inicio */}
          <div className="col-md-4">
            <label htmlFor="horaInicio" className="form-label">
              <i className="fas fa-hourglass-start"></i> Hora Inicio
            </label>
            <input
              type="time"
              id="horaInicio"
              className="form-control"
              value={horaInicio}
              onChange={e => setHoraInicio(e.target.value)}
              required
            />
          </div>

          {/* Hora Fin */}
          <div className="col-md-4">
            <label htmlFor="horaFin" className="form-label">
              <i className="fas fa-hourglass-end"></i> Hora Fin
            </label>
            <input
              type="time"
              id="horaFin"
              className="form-control"
              value={horaFin}
              onChange={e => setHoraFin(e.target.value)}
              required
            />
          </div>

          {/* Botón Registrar */}
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success">
              <i className="fas fa-save"></i> Crear Clase
            </button>
          </div>
        </form>

        {/* Tabla de clases creadas */}
        {created.length > 0 && (
          <div className="table-responsive mt-4">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Servicio</th>
                  <th>Instructor</th>
                  <th>Modalidad</th>
                  <th>Capacidad</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                </tr>
              </thead>
              <tbody>
                {created.map(c => (
                  <tr key={c.id_clase}>
                    <td>{c.id_clase}</td>
                    <td>{services.find(s => s.id_servicio === c.id_servicio)?.descripcion}</td>
                    <td>{instructors.find(i => i.id_empleado === c.id_instructor)?.nombre_completo}</td>
                    <td>{c.grupal ? 'Grupal' : 'Individual'}</td>
                    <td>{c.grupal ? c.capacidad : '—'}</td>
                    <td>{c.fecha}</td>
                    <td>{c.hora_inicio} – {c.hora_fin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
