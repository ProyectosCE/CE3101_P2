import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { API_URL } from '@/stores/api';
import styles from '../../styles/InstructorPage.module.css';

interface Servicio {
  id_servicio: number;
  descripcion: string;
}

interface Sucursal {
  id_sucursal: number;
  nombre_sucursal: string;
}

export default function RegisterClassPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const id_instructor = user?.id ?? -1;

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [form, setForm] = useState({
    hora_inicio: '',
    hora_fin: '',
    fecha: '',
    grupal: false,
    capacidad: '',
    id_servicio: '',
    id_sucursal: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, sucRes] = await Promise.all([
          fetch(`${API_URL}/api/servicio`),
          fetch(`${API_URL}/api/sucursal`)
        ]);

        const servData = await servRes.json();
        const sucData = await sucRes.json();

        if (servData.success) setServicios(servData.data);
        if (sucData.success) setSucursales(sucData.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar servicios o sucursales.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const id = target.id;
    const value = target.value;
    
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        [id]: target.checked
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { hora_inicio, hora_fin, fecha, capacidad, id_servicio, id_sucursal } = form;

    if (!hora_inicio || !hora_fin || !fecha || !capacidad || !id_servicio || !id_sucursal) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const toTimeWithSeconds = (time: string) => {
      return time.length === 5 ? `${time}:00` : time; // añade ":00" si falta
    };

    const claseData = {
      id_clase: 0, // no requerido por backend, pero no estorba
      hora_inicio: toTimeWithSeconds(form.hora_inicio),
      hora_fin: toTimeWithSeconds(form.hora_fin),
      fecha: form.fecha,
      grupal: form.grupal,
      capacidad: Number(form.capacidad),
      id_servicio: Number(form.id_servicio),
      id_sucursal: Number(form.id_sucursal),
      id_instructor
    };


    try {
      const res = await fetch(`${API_URL}/api/clase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claseData)
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Error al crear la clase.');
      }

      alert('Clase creada correctamente.');
      router.push('/instructor/Dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      <button className={styles.logoutButton} onClick={logout}>
        <i className="fas fa-sign-out-alt" /> Cerrar Sesión
      </button>

      <main className={styles.contentCard}>
        <h2 className={styles.mainHeader}>
          <i className="fas fa-chalkboard-teacher" /> Registrar Nueva Clase
        </h2>
        <p className={styles.subHeader}>
          Complete el formulario para agendar una clase presencial.
        </p>

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="hora_inicio"><i className="fas fa-clock"></i> Hora Inicio:</label>
            <input
              type="time"
              id="hora_inicio"
              className="form-control"
              value={form.hora_inicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="hora_fin"><i className="fas fa-clock"></i> Hora Fin:</label>
            <input
              type="time"
              id="hora_fin"
              className="form-control"
              value={form.hora_fin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="fecha"><i className="fas fa-calendar-alt"></i> Fecha:</label>
            <input
              type="date"
              id="fecha"
              className="form-control"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="capacidad"><i className="fas fa-users"></i> Capacidad:</label>
            <input
              type="number"
              id="capacidad"
              className="form-control"
              value={form.capacidad}
              onChange={handleChange}
              required
              min={1}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="id_servicio"><i className="fas fa-concierge-bell"></i> Servicio:</label>
            <select
              id="id_servicio"
              className="form-control"
              value={form.id_servicio}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione --</option>
              {servicios.map(s => (
                <option key={s.id_servicio} value={s.id_servicio}>
                  {s.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="id_sucursal"><i className="fas fa-map-marker-alt"></i> Sucursal:</label>
            <select
              id="id_sucursal"
              className="form-control"
              value={form.id_sucursal}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione --</option>
              {sucursales.map(s => (
                <option key={s.id_sucursal} value={s.id_sucursal}>
                  {s.nombre_sucursal}
                </option>
              ))}
            </select>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              id="grupal"
              className="form-check-input"
              checked={form.grupal}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="grupal">
              <i className="fas fa-users"></i> Clase Grupal
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="fas fa-save" /> Registrar Clase
          </button>
        </form>
      </main>
    </div>
  );
}
