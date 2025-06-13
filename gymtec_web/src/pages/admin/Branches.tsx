// src/pages/admin/Branches.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Branch {
  id: number;
  nombre: string;
  provincia: string;
  canton: string;
  distrito: string;
  fechaApertura: string;
  horarioAtencion: string;
  idAdmin: number;
  capacidadMax: number;
  telefonos: string[];
  spaActivo: boolean;
  tiendaActivo: boolean;
}

export default function Branches() {
  // Se obtienen datos de usuario y router
  const { user, logout } = useAuth();
  const router = useRouter();

  // Estado para listado de sucursales y modal
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  // Indica si se está editando (true) o creando (false)
  const [isEditing, setIsEditing] = useState(false);
  // ID de la sucursal en edición
  const [editingId, setEditingId] = useState<number | null>(null);

  // Formulario para crear/editar
  const [form, setForm] = useState<Omit<Branch,'id'>>({
    nombre: '',
    provincia: '',
    canton: '',
    distrito: '',
    fechaApertura: '',
    horarioAtencion: '',
    idAdmin: user?.id_empleado ?? 0,
    capacidadMax: 0,
    telefonos: [''],
    spaActivo: false,
    tiendaActivo: false,
  });

  // Carga inicial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gymtec_branches');
    if (saved) setBranches(JSON.parse(saved));
  }, []);

  // Actualiza campo del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [id]:
        type === 'checkbox'
          ? checked
          : id === 'capacidadMax'
          ? Number(value)
          : value,
    }) as any);
  };

  // Maneja cambio en un teléfono
  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...form.telefonos];
    newPhones[index] = value;
    setForm(prev => ({ ...prev, telefonos: newPhones }));
  };

  // Añade un nuevo campo de teléfono
  const addPhoneField = () => {
    setForm(prev => ({ ...prev, telefonos: [...prev.telefonos, ''] }));
  };

  // Abre modal en modo creación
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      nombre: '',
      provincia: '',
      canton: '',
      distrito: '',
      fechaApertura: '',
      horarioAtencion: '',
      idAdmin: user?.id_empleado ?? 0,
      capacidadMax: 0,
      telefonos: [''],
      spaActivo: false,
      tiendaActivo: false,
    });
    setShowModal(true);
  };

  // Abre modal en modo edición con datos precargados
  const openEditModal = (branch: Branch) => {
    setIsEditing(true);
    setEditingId(branch.id);
    setForm({
      nombre: branch.nombre,
      provincia: branch.provincia,
      canton: branch.canton,
      distrito: branch.distrito,
      fechaApertura: branch.fechaApertura,
      horarioAtencion: branch.horarioAtencion,
      idAdmin: branch.idAdmin,
      capacidadMax: branch.capacidadMax,
      telefonos: branch.telefonos,
      spaActivo: branch.spaActivo,
      tiendaActivo: branch.tiendaActivo,
    });
    setShowModal(true);
  };

  // Elimina una sucursal tras confirmar
  const handleDelete = (id: number) => {
    if (!confirm('¿Confirma eliminar esta sucursal?')) return;
    const updated = branches.filter(b => b.id !== id);
    setBranches(updated);
    localStorage.setItem('gymtec_branches', JSON.stringify(updated));
  };

  // Guarda nueva sucursal o actualiza existente
  const handleSave = () => {
    // Validación rápida
    if (!form.nombre || !form.provincia || !form.fechaApertura) {
      alert('Complete nombre, provincia y fecha de apertura.');
      return;
    }

    if (isEditing && editingId !== null) {
      // Actualizar
      const updated = branches.map(b =>
        b.id === editingId ? { id: b.id, ...form } : b
      );
      setBranches(updated);
      localStorage.setItem('gymtec_branches', JSON.stringify(updated));
    } else {
      // Crear
      const id = Date.now();
      const nueva: Branch = { id, ...form };
      const updated = [nueva, ...branches];
      setBranches(updated);
      localStorage.setItem('gymtec_branches', JSON.stringify(updated));
    }

    // Cierra modal y resetea
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
  };

  // Navegación superior
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo y botones */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>
      <button className={styles.homeButton} onClick={() => router.push('/admin/Dashboard')}>
        <i className="fas fa-home" /> Inicio
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt" /> Cerrar Sesión
      </button>

      {/* Contenido principal */}
      <div className={styles.contentCard}>
        <h3><i className="fas fa-building"></i> Gestión de Sucursales</h3>
        <button className="btn btn-primary mb-3" onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Nueva Sucursal
        </button>

        {/* Modal de creación/edición */}
        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={isEditing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                    {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {/* Nombre */}
                  <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input
                      id="nombre"
                      className="form-control"
                      value={form.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Dirección */}
                  <div className="row g-2 mb-2">
                    <div className="col">
                      <input
                        id="provincia"
                        className="form-control"
                        placeholder="Provincia"
                        value={form.provincia}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        id="canton"
                        className="form-control"
                        placeholder="Cantón"
                        value={form.canton}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        id="distrito"
                        className="form-control"
                        placeholder="Distrito"
                        value={form.distrito}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Fecha y horario */}
                  <div className="mb-2">
                    <label className="form-label">Fecha Apertura</label>
                    <input
                      id="fechaApertura"
                      type="date"
                      className="form-control"
                      value={form.fechaApertura}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Horario Atención</label>
                    <input
                      id="horarioAtencion"
                      type="text"
                      className="form-control"
                      placeholder="08:00 - 20:00"
                      value={form.horarioAtencion}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Capacidad */}
                  <div className="mb-2">
                    <label className="form-label">Capacidad Máx.</label>
                    <input
                      id="capacidadMax"
                      type="number"
                      className="form-control"
                      value={form.capacidadMax}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  {/* Teléfonos */}
                  <div className="mb-2">
                    <label className="form-label">Teléfonos</label>
                    {form.telefonos.map((tel,i)=>(
                      <input
                        key={i}
                        className="form-control mb-1"
                        value={tel}
                        placeholder="Ej: 88881234"
                        onChange={e=>handlePhoneChange(i,e.target.value)}
                      />
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={addPhoneField}
                    >
                      <i className="fas fa-phone-plus"></i> Agregar teléfono
                    </button>
                  </div>
                  {/* Spa/Tienda */}
                  <div className="form-check form-switch mb-2">
                    <input
                      id="spaActivo"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.spaActivo}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Spa Activo</label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      id="tiendaActivo"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.tiendaActivo}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Tienda Activa</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    <i className="fas fa-times"></i> Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fas fa-save"></i> {isEditing ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de sucursales con acciones CRUD */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Apertura</th>
                <th>Horario</th>
                <th>Capacidad</th>
                <th>Teléfonos</th>
                <th>Spa</th>
                <th>Tienda</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.nombre}</td>
                  <td>{`${b.provincia}, ${b.canton}, ${b.distrito}`}</td>
                  <td>{b.fechaApertura}</td>
                  <td>{b.horarioAtencion}</td>
                  <td>{b.capacidadMax}</td>
                  <td>{b.telefonos.join(', ')}</td>
                  <td>
                    {b.spaActivo
                      ? <i className="fas fa-check text-success" />
                      : <i className="fas fa-times text-danger" />}
                  </td>
                  <td>
                    {b.tiendaActivo
                      ? <i className="fas fa-check text-success" />
                      : <i className="fas fa-times text-danger" />}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEditModal(b)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(b.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
