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

  const [services, setServices] = useState<Service[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const [idServicio, setIdServicio] = useState<number | ''>('');
  const [idInstructor, setIdInstructor] = useState<number | ''>('');
  const [grupal, setGrupal] = useState<boolean>(false);
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [fecha, setFecha] = useState<string>('');
  const [horaInicio, setHoraInicio] = useState<string>('');
  const [horaFin, setHoraFin] = useState<string>('');

  useEffect(() => {
    fetch('/api/servicio')
        .then(res => res.json())
        .then(data => {
          if (data.success) setServices(data.data);
          else alert('Error cargando servicios');
        })
        .catch(() => alert('Error de servidor al cargar servicios'));

    fetch('/api/empleado/instructores')
        .then(res => res.json())
        .then(data => {
          if (data.success) setInstructors(data.data);
          else alert('Error cargando instructores');
        })
        .catch(() => alert('Error de servidor al cargar instructores'));
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const nuevaClase = {
      id_servicio: idServicio,
      id_instructor: idInstructor,
      grupal,
      capacidad: grupal ? capacidad : null,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
    };

    try {
      const res = await fetch('/api/clase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaClase)
      });
      const data = await res.json();

      if (res.status === 200) {
        alert('Clase creada con éxito');
        router.push('/admin/GymConfiguration');
      } else if (res.status === 400) {
        alert('Solicitud inválida: ' + (data.error || 'Error desconocido'));
      } else if (res.status === 401) {
        alert('No autorizado');
        router.push('/login');
      } else if (res.status === 404) {
        alert('No encontrado: ' + (data.error || 'Error desconocido'));
      } else if (res.status === 500) {
        alert('Error del servidor: ' + (data.error || 'Error interno'));
      } else {
        alert('Error desconocido');
      }
    } catch (error) {
      alert('Error de red o servidor.');
    }
  };

  return (
      <div className={styles.pageContainer}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>

        <button className={styles.homeButton} onClick={() => router.push('/admin/GymConfiguration')}>
          <i className="fas fa-sliders-h"></i> Configuración
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>

        <h2 className={styles.mainHeader}><i className="fas fa-chalkboard-teacher"></i> Crear Clases</h2>
        <p className={styles.subHeader}>Agregue nuevas clases indicando servicio, instructor y modalidad.</p>

        <div className={styles.sectionContainer}>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Servicio</label>
              <select className="form-select" value={idServicio} onChange={e => setIdServicio(Number(e.target.value))} required>
                <option value="">-- Seleccione servicio --</option>
                {services.map(s => (
                    <option key={s.id_servicio} value={s.id_servicio}>{s.descripcion}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Instructor</label>
              <select className="form-select" value={idInstructor} onChange={e => setIdInstructor(Number(e.target.value))} required>
                <option value="">-- Seleccione instructor --</option>
                {instructors.map(i => (
                    <option key={i.id_empleado} value={i.id_empleado}>{i.nombre_completo}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Modalidad</label>
              <div>
                <input type="radio" checked={!grupal} onChange={() => setGrupal(false)} /> Individual
                <input type="radio" checked={grupal} onChange={() => setGrupal(true)} /> Grupal
              </div>
            </div>

            {grupal && (
                <div className="col-md-6">
                  <label className="form-label">Capacidad</label>
                  <input type="number" className="form-control" min={1} value={capacidad} onChange={e => setCapacidad(Number(e.target.value))} required />
                </div>
            )}

            <div className="col-md-4">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} required />
            </div>

            <div className="col-md-4">
              <label className="form-label">Hora Inicio</label>
              <input type="time" className="form-control" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} required />
            </div>

            <div className="col-md-4">
              <label className="form-label">Hora Fin</label>
              <input type="time" className="form-control" value={horaFin} onChange={e => setHoraFin(e.target.value)} required />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success">Crear Clase</button>
            </div>
          </form>
        </div>
      </div>
  );
}
