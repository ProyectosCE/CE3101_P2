// src/pages/instructor/RegisterClass.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/InstructorPage.module.css';

interface Cliente {
  id_cliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
}

interface Servicio {
  id_servicio: number;
  descripcion: string;
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
  cupo_dispo: number;
  clientes_iniciales: number[];
}

export default function RegisterClassPage() {
  // Se obtiene usuario y rutas
  const { user, logout } = useAuth();
  const router = useRouter();
  const instructorId = user?.id_empleado ?? -1;

  // Datos de ejemplo
  const [clientes] = useState<Cliente[]>([
    { id_cliente: 1, cedula: '101010101', nombres: 'Juan', apellidos: 'Pérez' },
    { id_cliente: 2, cedula: '202020202', nombres: 'María', apellidos: 'López' },
    { id_cliente: 3, cedula: '303030303', nombres: 'Carlos', apellidos: 'Martínez' },
    { id_cliente: 4, cedula: '404040404', nombres: 'Ana', apellidos: 'Gómez' },
    { id_cliente: 5, cedula: '505050505', nombres: 'Luis', apellidos: 'Rodríguez' },
  ]);
  const [servicios] = useState<Servicio[]>([
    { id_servicio: 1, descripcion: 'Indoor Cycling' },
    { id_servicio: 2, descripcion: 'Pilates' },
    { id_servicio: 3, descripcion: 'Yoga' },
    { id_servicio: 4, descripcion: 'Zumba' },
    { id_servicio: 5, descripcion: 'Natación' },
  ]);

  // Estados del formulario
  const [idServicio, setIdServicio] = useState<number | ''>('');
  const [grupal, setGrupal] = useState<boolean>(false);
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  // Métodos de agregar cliente
  const [metodoSeleccion, setMetodoSeleccion] = useState<'id' | 'lista'>('id');
  const [clienteIdInput, setClienteIdInput] = useState<number | ''>('');
  const [clientesSeleccionados, setClientesSeleccionados] = useState<Set<number>>(new Set());
  const [showListModal, setShowListModal] = useState(false);

  // Clases creadas
  const [createdClasses, setCreatedClasses] = useState<Clase[]>([]);

  // Carga clases desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gymtec_created_classes');
    if (saved) setCreatedClasses(JSON.parse(saved));
  }, []);

  // Resetea selección cuando cambia modalidad
  useEffect(() => {
    setCapacidad('');
    setClientesSeleccionados(new Set());
    setClienteIdInput('');
    setMetodoSeleccion('id');
  }, [grupal]);

  // Ajusta selección si supera capacidad
  useEffect(() => {
    if (grupal && typeof capacidad === 'number') {
      setClientesSeleccionados(prev => {
        const arr = Array.from(prev);
        return arr.length <= capacidad
          ? prev
          : new Set(arr.slice(0, capacidad));
      });
    }
  }, [capacidad, grupal]);

  // Alterna cliente en el set
  const toggleCliente = (id: number) => {
    setClientesSeleccionados(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (typeof capacidad === 'number' && next.size >= capacidad) {
          alert(`Capacidad máxima de ${capacidad} alcanzada.`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  // Añade cliente por ID
  const handleAddById = () => {
    if (!clienteIdInput) {
      alert('Debe ingresar un ID de cliente válido.');
      return;
    }
    if (!clientes.some(c => c.id_cliente === clienteIdInput)) {
      alert('ID de cliente no encontrado.');
      return;
    }
    if (typeof capacidad === 'number' && clientesSeleccionados.size >= capacidad) {
      alert(`Límite de ${capacidad} clientes.`);
      return;
    }
    setClientesSeleccionados(prev => new Set(prev).add(clienteIdInput as number));
    setClienteIdInput('');
  };

  // Envía formulario y guarda clase
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idServicio === '' || !fecha || !horaInicio || !horaFin) {
      alert('Complete servicio, fecha y hora.');
      return;
    }
    if (grupal) {
      if (!capacidad || capacidad < 1) {
        alert('Ingrese capacidad válida.');
        return;
      }
      if (clientesSeleccionados.size < 1) {
        alert('Debe agregar al menos un cliente.');
        return;
      }
    }

    const nuevoId = Date.now();
    const iniciales = grupal ? Array.from(clientesSeleccionados) : [];
    const disponible = grupal ? (capacidad as number) - iniciales.length : 0;
    const nuevaClase: Clase = {
      id_clase: nuevoId,
      id_servicio: idServicio as number,
      id_instructor: instructorId,
      grupal,
      capacidad: grupal ? (capacidad as number) : null,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      cupo_dispo: disponible,
      clientes_iniciales: iniciales,
    };

    const updated = [nuevaClase, ...createdClasses];
    setCreatedClasses(updated);
    localStorage.setItem('gymtec_created_classes', JSON.stringify(updated));

    // Limpia formulario
    setIdServicio('');
    setGrupal(false);
    setCapacidad('');
    setFecha('');
    setHoraInicio('');
    setHoraFin('');
    setClientesSeleccionados(new Set());
    setClienteIdInput('');
    setMetodoSeleccion('id');
  };

  // Comprueba si puede agregar clientes: capacidad debe ser ≥1
  const canAddClientes = grupal && typeof capacidad === 'number' && capacidad > 0;

  return (
    <div className={styles.pageContainer}>
      {/* Logo y navegación */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>
      <button className={styles.homeButton} onClick={() => router.push('/instructor/Dashboard')}>
        <i className="fas fa-home"></i> Inicio
      </button>
      <button className={styles.logoutButton} onClick={() => logout()}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      <main className="container mt-4">
        <h2 className={styles.mainHeader}>
          <i className="fas fa-stopwatch"></i> Registro de Clase
        </h2>
        <p className={styles.subHeader}>
          Complete los datos y agregue clientes.
        </p>

        <div className={styles.contentCard}>
          <form onSubmit={handleSubmit}>
            {/* Servicio */}
            <div className="mb-3">
              <label className="form-label"><i className="fas fa-dumbbell"></i> Servicio</label>
              <select
                className="form-select"
                value={idServicio}
                onChange={e => setIdServicio(Number(e.target.value))}
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

            {/* Modalidad */}
            <div className="mb-3">
              <label className="form-label"><i className="fas fa-users"></i> Modalidad</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={!grupal}
                    onChange={() => setGrupal(false)}
                  />
                  <label className="form-check-label"><i className="fas fa-user"></i> Individual</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={grupal}
                    onChange={() => setGrupal(true)}
                  />
                  <label className="form-check-label"><i className="fas fa-users"></i> Grupal</label>
                </div>
              </div>
            </div>

            {/* Capacidad */}
            {grupal && (
              <div className="mb-3">
                <label className="form-label"><i className="fas fa-chart-bar"></i> Capacidad</label>
                <input
                  type="number"
                  className="form-control"
                  value={capacidad}
                  onChange={e => setCapacidad(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>
            )}

            {/* Método de agregar clientes */}
            {grupal && (
              <div className="mb-3">
                <label className="form-label"><i className="fas fa-user-friends"></i> Agregar Clientes</label>
                <div className="btn-group mb-2">
                  <button
                    type="button"
                    className={`btn btn-outline-primary ${metodoSeleccion === 'id' ? 'active' : ''}`}
                    onClick={() => setMetodoSeleccion('id')}
                    disabled={!canAddClientes}
                  >
                    Por ID
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setMetodoSeleccion('lista');
                      setShowListModal(true);
                    }}
                    disabled={!canAddClientes}
                  >
                    Por Lista
                  </button>
                </div>

                {/* Campo por ID solo si está en 'id' */}
                {metodoSeleccion === 'id' && canAddClientes && (
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="ID Cliente"
                      value={clienteIdInput}
                      onChange={e => setClienteIdInput(Number(e.target.value))}
                    />
                    <button type="button" className="btn btn-primary" onClick={handleAddById}>
                      <i className="fas fa-user-plus"></i> Agregar
                    </button>
                  </div>
                )}

                {/* Confirmación de lista seleccionada */}
                {metodoSeleccion === 'lista' && clientesSeleccionados.size > 0 && (
                  <div className="mt-2">
                    <small className="text-success">
                      Clientes agregados: {clientesSeleccionados.size}
                    </small>
                  </div>
                )}
              </div>
            )}

            {/* Modal para listado de clientes */}
            {showListModal && (
              <div className="modal d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title"><i className="fas fa-list"></i> Seleccionar Clientes</h5>
                      <button type="button" className="btn-close" onClick={() => setShowListModal(false)} />
                    </div>
                    <div className="modal-body" style={{ maxHeight: 300, overflowY: 'auto' }}>
                      {clientes.map(c => (
                        <div key={c.id_cliente} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`cli-${c.id_cliente}`}
                            checked={clientesSeleccionados.has(c.id_cliente)}
                            disabled={!clientesSeleccionados.has(c.id_cliente) && (!canAddClientes)}
                            onChange={() => toggleCliente(c.id_cliente)}
                          />
                          <label htmlFor={`cli-${c.id_cliente}`} className="form-check-label">
                            {c.nombres} {c.apellidos} (#{c.id_cliente})
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="modal-footer">
                      <small className="text-muted me-auto">
                        Seleccionados: {clientesSeleccionados.size}/{capacidad}
                      </small>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowListModal(false)}
                      >
                        <i className="fas fa-check"></i> Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fecha y Hora */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label"><i className="fas fa-calendar-day"></i> Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label"><i className="fas fa-hourglass-start"></i> Inicio</label>
                <input
                  type="time"
                  className="form-control"
                  value={horaInicio}
                  onChange={e => setHoraInicio(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label"><i className="fas fa-hourglass-end"></i> Fin</label>
                <input
                  type="time"
                  className="form-control"
                  value={horaFin}
                  onChange={e => setHoraFin(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Botón Registrar */}
            <button type="submit" className="btn btn-success">
              <i className="fas fa-chalkboard-teacher"></i> Registrar Clase
            </button>
          </form>

          {/* Listado de Clases Creadas */}
          {createdClasses.length > 0 && (
            <div className="mt-5">
              <h3><i className="fas fa-list"></i> Clases Creadas</h3>
              <div className="table-responsive">
                <table className="table table-bordered mt-3">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th><th>Servicio</th><th>Modalidad</th><th>Capacidad</th>
                      <th>Fecha</th><th>Hora</th><th>Cupo disp.</th><th>Clientes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdClasses.map(clase => (
                      <tr key={clase.id_clase}>
                        <td>{clase.id_clase}</td>
                        <td>{servicios.find(s => s.id_servicio === clase.id_servicio)?.descripcion}</td>
                        <td>{clase.grupal ? 'Grupal' : 'Individual'}</td>
                        <td>{clase.grupal ? clase.capacidad : '—'}</td>
                        <td>{clase.fecha}</td>
                        <td>{`${clase.hora_inicio} - ${clase.hora_fin}`}</td>
                        <td>{clase.grupal ? clase.cupo_dispo : '—'}</td>
                        <td>
                          {clase.clientes_iniciales
                            .map(id => {
                              const c = clientes.find(x => x.id_cliente === id);
                              return c ? `${c.nombres} ${c.apellidos}` : '';
                            })
                            .join(', ')}
                        </td>
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
