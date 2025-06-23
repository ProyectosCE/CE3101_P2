// src/pages/admin/Positions.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_BASE_URL } from '@/stores/api';

interface Position {
  id_puesto: number;
  descripcion: string;
  detalle: string;
  is_default: boolean;
}

export default function Positions() {
  const { logout } = useAuth();
  const router = useRouter();

  const [positions, setPositions] = useState<Position[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [descInput, setDescInput] = useState('');
  const [detailInput, setDetailInput] = useState('');
  const [viewing, setViewing] = useState<Position | null>(null);

  const fetchPositions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/puesto`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setPositions(json.data);
    } catch (err: any) {
      alert('Error al obtener puestos: ' + err.message);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDescInput('');
    setDetailInput('');
    setShowModal(true);
  };

  const openEdit = (p: Position) => {
    setEditing(p);
    setDescInput(p.descripcion);
    setDetailInput(p.detalle);
    setShowModal(true);
  };

  const openView = (p: Position) => {
    setViewing(p);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Confirma eliminación de este puesto?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/puesto/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      fetchPositions();
    } catch (err: any) {
      alert('Error al eliminar puesto: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!descInput.trim()) {
      alert('Debe ingresar nombre del puesto.');
      return;
    }
    const body = {
      id_puesto: editing?.id_puesto,
      descripcion: descInput,
      is_default: false
    };
    try {
      const res = await fetch(editing ? `${API_BASE_URL}/api/puesto/${editing.id_puesto}` : `${API_BASE_URL}/api/puesto`, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setShowModal(false);
      fetchPositions();
    } catch (err: any) {
      alert('Error al guardar puesto: ' + err.message);
    }
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
          <h3><i className="fas fa-briefcase"></i> Gestión de Puestos</h3>
          <button className="btn btn-primary mb-3" onClick={openCreate}>
            <i className="fas fa-plus"></i> Nuevo Puesto
          </button>

          {showModal && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i> {editing ? 'Editar Puesto' : 'Nuevo Puesto'}
                      </h5>
                      <button className="btn-close" onClick={() => setShowModal(false)} />
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Nombre del Puesto</label>
                        <input
                            type="text"
                            className="form-control"
                            value={descInput}
                            onChange={e => setDescInput(e.target.value)}
                        />
                      </div>
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
                        <i className="fas fa-eye"></i> Detalle del Puesto
                      </h5>
                      <button className="btn-close" onClick={() => setViewing(null)} />
                    </div>
                    <div className="modal-body">
                      <p><strong>Nombre:</strong> {viewing.descripcion}</p>
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

                <th>Nombre</th>
                <th>Por Defecto</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              {positions.map(p => (
                  <tr key={p.id_puesto}>
                    <td>{p.descripcion}</td>
                    <td className="text-center">
                      {p.is_default
                          ? <i className="fas fa-check text-success" />
                          : <i className="fas fa-minus text-muted" />}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => openView(p)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      {!p.is_default && (
                          <>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(p)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id_puesto)}>
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
