import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_BASE_URL } from '@/stores/api';

interface Branch {
  id_sucursal: number;
  nombre_sucursal: string;
  provincia: string;
  canton: string;
  distrito: string;
  horario_atencion: string;
  fecha_apertura: string;
  capacidad_max: number;
  id_admin: number;
  spa_activo: boolean;
  tienda_activo: boolean;
  telefonos: { id_telefono_sucursal: number; numero: string }[];
}

interface Admin {
  id_empleado: number;
  nombres: string;
  apellidos: string;
}

export default function Branches() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre_sucursal: '',
    provincia: '',
    canton: '',
    distrito: '',
    horario_atencion: '',
    fecha_apertura: '',
    capacidad_max: 0,
    id_admin: user?.id ?? 0,
    spa_activo: false,
    tienda_activo: false,
  });

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sucursal`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setBranches(json.data);
    } catch (err: any) {
      alert('Error al obtener sucursales: ' + err.message);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/empleado`);
      const json = await res.json();
      if (json.success) {
        const filtered = json.data.filter((e: any) => e.id_puesto === 1);
        setAdmins(filtered);
      }
    } catch (err) {
      console.error('Error al obtener admins:', err);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchAdmins();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox') {
      checked = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : id === 'capacidad_max' ? Number(value) : value,
    }));
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      nombre_sucursal: '',
      provincia: '',
      canton: '',
      distrito: '',
      horario_atencion: '',
      fecha_apertura: '',
      capacidad_max: 0,
      id_admin: user?.id ?? 0,
      spa_activo: false,
      tienda_activo: false,
    });
    setShowModal(true);
  };

  const openEditModal = (branch: Branch) => {
    setIsEditing(true);
    setEditingId(branch.id_sucursal);
    setForm({
      nombre_sucursal: branch.nombre_sucursal,
      provincia: branch.provincia,
      canton: branch.canton,
      distrito: branch.distrito,
      horario_atencion: branch.horario_atencion,
      fecha_apertura: branch.fecha_apertura,
      capacidad_max: branch.capacidad_max,
      id_admin: branch.id_admin,
      spa_activo: branch.spa_activo,
      tienda_activo: branch.tienda_activo,
    });
    setShowModal(true);
  };

  const toggleSpa = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/sucursal/spa_toggle/${id}`, { method: 'PATCH' });
    fetchBranches();
  };

  const toggleTienda = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/sucursal/tienda_toggle/${id}`, { method: 'PATCH' });
    fetchBranches();
  };

  const handleSave = async () => {
    const requiredFields = {
      nombre_sucursal: form.nombre_sucursal.trim(),
      provincia: form.provincia.trim(),
      canton: form.canton.trim(),
      distrito: form.distrito.trim(),
      horario_atencion: form.horario_atencion.trim(),
      fecha_apertura: form.fecha_apertura,
      capacidad_max: form.capacidad_max,
      id_admin: form.id_admin,
      spa_activo: form.spa_activo,
      tienda_activo: form.tienda_activo
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => {
        if (typeof value === 'string') return !value;
        if (typeof value === 'number') return value <= 0;
        return false;
      })
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      alert(`Por favor complete los siguientes campos: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing ? `${API_BASE_URL}/api/sucursal/${editingId}` : `${API_BASE_URL}/api/sucursal`;

      const bodyPayload = isEditing 
        ? { ...requiredFields, id_sucursal: editingId }
        : requiredFields;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData.errors || errorData.error || 'Error desconocido'));
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setShowModal(false);
      fetchBranches();
    } catch (err: any) {
      alert('Error al guardar sucursal: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro que desea eliminar esta sucursal?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/sucursal/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al eliminar la sucursal');
      }
      
      fetchBranches();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Helper function to check if branch is default
  const isDefaultBranch = (id: number) => id <= 3;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>
      <button className={styles.homeButton} onClick={() => router.push('/admin/Dashboard')}>
        <i className="fas fa-home" /> Inicio
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt" /> Cerrar Sesión
      </button>

      <div className={styles.contentCard}>
        <h3>
          <i className="fas fa-building"></i> Gestión de Sucursales
        </h3>
        <button className="btn btn-primary mb-3" onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Nueva Sucursal
        </button>

        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nombre_sucursal" className="form-label">
                      Nombre de la Sucursal
                    </label>
                    <input
                      id="nombre_sucursal"
                      className="form-control"
                      value={form.nombre_sucursal}
                      onChange={handleChange}
                      placeholder="Nombre de la sucursal"
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col">
                      <label htmlFor="provincia" className="form-label">
                        Provincia
                      </label>
                      <input
                        id="provincia"
                        className="form-control"
                        value={form.provincia}
                        onChange={handleChange}
                        placeholder="Provincia"
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="canton" className="form-label">
                        Cantón
                      </label>
                      <input
                        id="canton"
                        className="form-control"
                        value={form.canton}
                        onChange={handleChange}
                        placeholder="Cantón"
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="distrito" className="form-label">
                        Distrito
                      </label>
                      <input
                        id="distrito"
                        className="form-control"
                        value={form.distrito}
                        onChange={handleChange}
                        placeholder="Distrito"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="horario_atencion" className="form-label">
                      Horario de Atención
                    </label>
                    <input
                      id="horario_atencion"
                      className="form-control"
                      value={form.horario_atencion}
                      onChange={handleChange}
                      placeholder="Ej: 08:00 - 17:00"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fecha_apertura" className="form-label">
                      Fecha de Apertura
                    </label>
                    <input
                      id="fecha_apertura"
                      type="date"
                      className="form-control"
                      value={form.fecha_apertura}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="capacidad_max" className="form-label">
                      Capacidad Máxima
                    </label>
                    <input
                      id="capacidad_max"
                      type="number"
                      className="form-control"
                      value={form.capacidad_max}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="id_admin" className="form-label">
                      Administrador
                    </label>
                    <select id="id_admin" className="form-select" value={form.id_admin} onChange={handleChange}>
                      {admins.map(a => (
                        <option key={a.id_empleado} value={a.id_empleado}>
                          {a.nombres} {a.apellidos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Horario</th>
                <th>Capacidad</th>
                <th>Spa</th>
                <th>Tienda</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(b => (
                <tr key={b.id_sucursal}>
                  <td>{b.id_sucursal}</td>
                  <td>{b.nombre_sucursal}</td>
                  <td>{`${b.provincia}, ${b.canton}, ${b.distrito}`}</td>
                  <td>{b.horario_atencion}</td>
                  <td>{b.capacidad_max}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => toggleSpa(b.id_sucursal)}
                    >
                      {b.spa_activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => toggleTienda(b.id_sucursal)}
                    >
                      {b.tienda_activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => openEditModal(b)}
                      disabled={isDefaultBranch(b.id_sucursal)}
                      title={isDefaultBranch(b.id_sucursal) ? 'No se puede editar una sucursal por defecto' : ''}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(b.id_sucursal)}
                      disabled={isDefaultBranch(b.id_sucursal)}
                      title={isDefaultBranch(b.id_sucursal) ? 'No se puede eliminar una sucursal por defecto' : ''}
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
