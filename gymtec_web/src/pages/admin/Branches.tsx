// src/pages/admin/Branches.tsx

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

export default function Branches() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
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
    telefonos: ['']
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

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : id === 'capacidad_max' ? Number(value) : value
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...form.telefonos];
    updated[index] = value;
    setForm(prev => ({ ...prev, telefonos: updated }));
  };

  const addPhoneField = () => {
    setForm(prev => ({ ...prev, telefonos: [...prev.telefonos, ''] }));
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      nombre_sucursal: '', provincia: '', canton: '', distrito: '', horario_atencion: '',
      fecha_apertura: '', capacidad_max: 0, id_admin: user?.id ?? 0,
      spa_activo: false, tienda_activo: false, telefonos: ['']
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
      telefonos: branch.telefonos.map(t => t.numero)
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Confirma eliminar esta sucursal?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/sucursal/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      fetchBranches();
    } catch (err: any) {
      alert('Error al eliminar sucursal: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!form.nombre_sucursal || !form.provincia || !form.horario_atencion) {
      alert('Complete todos los campos obligatorios.');
      return;
    }

    try {
      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing
          ? `${API_BASE_URL}/api/sucursal/${editingId}`
          : `${API_BASE_URL}/api/sucursal`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_sucursal: form.nombre_sucursal,
          provincia: form.provincia,
          canton: form.canton,
          distrito: form.distrito,
          horario_atencion: form.horario_atencion,
          fecha_apertura: form.fecha_apertura,
          capacidad_max: form.capacidad_max,
          id_admin: form.id_admin,
          spa_activo: form.spa_activo,
          tienda_activo: form.tienda_activo
        })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      if (!isEditing) {
        const idSucursal = json.data.id_sucursal;
        for (const numero of form.telefonos) {
          await fetch(`${API_BASE_URL}/api/telefonossucursal/${idSucursal}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero })
          });
        }
      }

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
                      <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                    </div>
                    <div className="modal-body">
                      {/* Nombre */}
                      <div className="mb-2">
                        <label className="form-label">Nombre</label>
                        <input
                            id="nombre_sucursal"
                            className="form-control"
                            value={form.nombre_sucursal}
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

                      {/* Horario */}
                      <div className="mb-2">
                        <label className="form-label">Horario Atención</label>
                        <input
                            id="horario_atencion"
                            type="text"
                            className="form-control"
                            placeholder="08:00 - 20:00"
                            value={form.horario_atencion}
                            onChange={handleChange}
                        />
                      </div>

                      {/* Capacidad */}
                      <div className="mb-2">
                        <label className="form-label">Capacidad Máx.</label>
                        <input
                            id="capacidad_max"
                            type="number"
                            className="form-control"
                            value={form.capacidad_max}
                            onChange={handleChange}
                            min={0}
                        />
                      </div>

                      {/* Teléfonos */}
                      <div className="mb-2">
                        <label className="form-label">Teléfonos</label>
                        {form.telefonos.map((tel, i) => (
                            <input
                                key={i}
                                className="form-control mb-1"
                                value={tel}
                                placeholder="Ej: 88881234"
                                onChange={(e) => handlePhoneChange(i, e.target.value)}
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
                            id="spa_activo"
                            type="checkbox"
                            className="form-check-input"
                            checked={form.spa_activo}
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Spa Activo</label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                            id="tienda_activo"
                            type="checkbox"
                            className="form-check-input"
                            checked={form.tienda_activo}
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Tienda Activa</label>
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

          {/* Tabla de sucursales con acciones CRUD */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Horario</th>
                <th>Capacidad</th>
                <th>Teléfonos</th>
                <th>Spa</th>
                <th>Tienda</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              {branches.map((b) => (
                  <tr key={b.id_sucursal}>
                    <td>{b.id_sucursal}</td>
                    <td>{b.nombre_sucursal}</td>
                    <td>{`${b.provincia}, ${b.canton}, ${b.distrito}`}</td>
                    <td>{b.horario_atencion}</td>
                    <td>{b.capacidad_max}</td>
                    <td>{b.telefonos.map((t) => t.numero).join(', ')}</td>
                    <td>
                      {b.spa_activo ? (
                          <i className="fas fa-check text-success" />
                      ) : (
                          <i className="fas fa-times text-danger" />
                      )}
                    </td>
                    <td>
                      {b.tienda_activo ? (
                          <i className="fas fa-check text-success" />
                      ) : (
                          <i className="fas fa-times text-danger" />
                      )}
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
                          onClick={() => handleDelete(b.id_sucursal)}
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
