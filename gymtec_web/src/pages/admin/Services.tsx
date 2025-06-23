// src/pages/admin/Services.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_BASE_URL } from '@/stores/api';

interface Service {
  id_servicio: number;
  descripcion: string;
  is_default: boolean;
}

export default function ServicesPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [viewing, setViewing] = useState<Service | null>(null);
  const [descInput, setDescInput] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/servicio`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setServices(data.data);
          else console.error(data.error);
        })
        .catch(err => console.error(err));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDescInput('');
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setDescInput(s.descripcion);
    setShowModal(true);
  };

  const openView = (s: Service) => setViewing(s);

  const handleDelete = (id: number) => {
    if (!confirm('¿Confirma eliminación del servicio?')) return;
    fetch(`${API_BASE_URL}/api/servicio/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) setServices(prev => prev.filter(s => s.id_servicio !== id));
          else alert(data.error);
        })
        .catch(err => alert('Error inesperado: ' + err));
  };

  const handleSave = () => {
    const desc = descInput.trim();
    if (!desc) return alert('La descripción es obligatoria.');

    const method = editing ? 'PATCH' : 'POST';
    const url = editing ? `${API_BASE_URL}/api/servicio/${editing.id_servicio}` : `${API_BASE_URL}/api/servicio`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_servicio: editing?.id_servicio,
        descripcion: desc
      })
    })
        .then(res => res.json())
        .then(data => {
          if (!data.success) return alert(data.error);
          if (editing) {
            setServices(prev => prev.map(s =>
                s.id_servicio === editing.id_servicio ? { ...s, descripcion: desc } : s
            ));
          } else {
            setServices(prev => [...prev, data.data]);
          }
          setShowModal(false);
        })
        .catch(err => alert('Error inesperado: ' + err));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
      <div className={styles.pageContainer}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>
        <button className={styles.homeButton} onClick={() => router.push('/admin/Dashboard')}>
          <i className="fas fa-home"></i> Inicio
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>

        <div className={styles.contentCard}>
          <h3><i className="fas fa-dumbbell"></i> Gestión de Servicios</h3>
          <button className="btn btn-primary mb-3" onClick={openCreate}>
            <i className="fas fa-plus"></i> Nuevo Servicio
          </button>

          {showModal && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                        {editing ? 'Editar Servicio' : 'Nuevo Servicio'}
                      </h5>
                      <button className="btn-close" onClick={() => setShowModal(false)} />
                    </div>
                    <div className="modal-body">
                      <label className="form-label">Descripción</label>
                      <input
                          type="text"
                          className="form-control"
                          value={descInput}
                          onChange={e => setDescInput(e.target.value)}
                      />
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        <i className="fas fa-times"></i> Cancelar
                      </button>
                      <button className="btn btn-primary" onClick={handleSave}>
                        <i className="fas fa-save"></i> Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {viewing && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <i className="fas fa-eye"></i> Detalle de Servicio
                      </h5>
                      <button className="btn-close" onClick={() => setViewing(null)} />
                    </div>
                    <div className="modal-body">
                      <p><strong>Descripción:</strong> {viewing.descripcion}</p>
                      <p><strong>Por Defecto:</strong> {viewing.is_default ? 'Sí' : 'No'}</p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setViewing(null)}>
                        <i className="fas fa-times"></i> Cerrar
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
                <th>Descripción</th>
                <th>Por Defecto</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              {services.map(s => (
                  <tr key={s.id_servicio}>
                    <td>{s.descripcion}</td>
                    <td className="text-center">
                      {s.is_default
                          ? <i className="fas fa-check text-success" />
                          : <i className="fas fa-minus text-muted" />}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => openView(s)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      {!s.is_default && (
                          <>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(s)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id_servicio)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                      )}
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
