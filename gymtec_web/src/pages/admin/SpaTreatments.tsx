// src/pages/admin/SpaTreatments.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_URL } from '@/stores/api';

interface Treatment {
  id_tratamiento: number;
  nombre_tratamiento: string;
  is_default: boolean;
}

export default function SpaTreatments() {
  const { logout } = useAuth();
  const router = useRouter();

  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [nameInput, setNameInput] = useState('');

  const fetchTreatments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tratamiento`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al obtener tratamientos');
      setTreatments(data.data);
    } catch (err: any) {
      console.error(err.message);
      alert('Error al cargar tratamientos: ' + err.message);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este tratamiento?')) return;
    try {
      const res = await fetch(`${API_URL}/api/tratamiento/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al eliminar tratamiento');
      setTreatments(treatments.filter(t => t.id_tratamiento !== id));
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!nameInput.trim()) {
      alert('El nombre es obligatorio.');
      return;
    }
    try {
      if (editing) {
        // Editar
        const res = await fetch(`${API_URL}/api/tratamiento/${editing.id_tratamiento}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editing, nombre_tratamiento: nameInput }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Error al editar');
        setTreatments(prev => prev.map(t =>
            t.id_tratamiento === editing.id_tratamiento ? { ...t, nombre_tratamiento: nameInput } : t
        ));
      } else {
        // Crear
        const res = await fetch(`${API_URL}/api/tratamiento`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre_tratamiento: nameInput }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Error al crear');
        setTreatments(prev => [...prev, data.data]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    }
  };

  return (
      <div className={styles.pageContainer}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>
        <button className={styles.homeButton} onClick={() => router.push('/admin/Dashboard')}>
          <i className="fas fa-home"></i> Inicio
        </button>
        <button className={styles.logoutButton} onClick={() => { logout(); router.push('/login'); }}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>

        <div className={styles.contentCard}>
          <h3><i className="fas fa-spa"></i> Gestión de Tratamientos de Spa</h3>
          <button className="btn btn-primary mb-3" onClick={() => { setEditing(null); setNameInput(''); setShowModal(true); }}>
            <i className="fas fa-plus"></i> Nuevo Tratamiento
          </button>

          {showModal && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>
                        {editing ? ' Editar Tratamiento' : ' Nuevo Tratamiento'}
                      </h5>
                      <button className="btn-close" onClick={() => setShowModal(false)} />
                    </div>
                    <div className="modal-body">
                      <label className="form-label">Nombre</label>
                      <input
                          type="text"
                          className="form-control"
                          value={nameInput}
                          onChange={e => setNameInput(e.target.value)}
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

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Por Defecto</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              {treatments.map(t => (
                  <tr key={t.id_tratamiento}>
                    <td>{t.id_tratamiento}</td>
                    <td>{t.nombre_tratamiento}</td>
                    <td className="text-center">
                      {t.is_default
                          ? <i className="fas fa-check text-success" />
                          : <i className="fas fa-minus text-muted" />}
                    </td>
                    <td className="text-center">
                      {!t.is_default && (
                          <>
                            <button
                                className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => { setEditing(t); setNameInput(t.nombre_tratamiento); setShowModal(true); }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(t.id_tratamiento)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                      )}
                      {t.is_default && (
                          <span className="text-muted">—</span>
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
