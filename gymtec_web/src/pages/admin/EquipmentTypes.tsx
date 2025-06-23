// src/pages/admin/EquipmentTypes.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_BASE_URL } from '@/stores/api';

interface EquipmentType {
  id_tipo_equipo: number;
  descripcion: string;
  isDefault: boolean;
}

export default function EquipmentTypes() {
  const { logout } = useAuth();
  const router = useRouter();

  const [types, setTypes] = useState<EquipmentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EquipmentType | null>(null);
  const [viewing, setViewing] = useState<EquipmentType | null>(null);
  const [descInput, setDescInput] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tipoequipo`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Marcar como default los ids 1-5
          const loaded = data.data.map((t: any) => ({
            id_tipo_equipo: t.id_tipo_equipo,
            descripcion: t.descripcion,
            isDefault: [1,2,3,4,5].includes(t.id_tipo_equipo),
          }));
          setTypes(loaded);
        } else {
          alert('Error al cargar tipos de equipo');
        }
      })
      .catch(() => alert('Error de servidor al cargar tipos de equipo'));
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const openCreate = () => {
    setEditing(null);
    setDescInput('');
    setShowModal(true);
  };

  const openEdit = (t: EquipmentType) => {
    setEditing(t);
    setDescInput(t.descripcion);
    setShowModal(true);
  };

  const openView = (t: EquipmentType) => setViewing(t);

  const deleteType = async (id: number) => {
    if (!confirm('¿Eliminar este tipo de equipo?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tipoequipo/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.status === 200) {
        setTypes(types.filter(t => t.id_tipo_equipo !== id));
        alert(data.mensaje);
      } else {
        alert(data.error || 'Error al eliminar tipo de equipo');
      }
    } catch {
      alert('Error de servidor');
    }
  };

  const saveType = async () => {
    const name = descInput.trim();
    if (!name) return alert('La descripción es obligatoria.');

    const method = editing ? 'PATCH' : 'POST';
    const url = editing ? `${API_BASE_URL}/api/tipoequipo/${editing.id_tipo_equipo}` : `${API_BASE_URL}/api/tipoequipo`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_tipo_equipo: editing ? editing.id_tipo_equipo : 0,
          descripcion: name,
          isDefault: false,
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        // Refrescar lista desde API y marcar default
        const listRes = await fetch(`${API_BASE_URL}/api/tipoequipo`);
        const listData = await listRes.json();
        if (listData.success) {
          const loaded = listData.data.map((t: any) => ({
            id_tipo_equipo: t.id_tipo_equipo,
            descripcion: t.descripcion,
            isDefault: [1,2,3,4,5].includes(t.id_tipo_equipo),
          }));
          setTypes(loaded);
        }
        setShowModal(false);
      } else {
        alert(data.error || 'Error al guardar tipo de equipo');
      }
    } catch {
      alert('Error de servidor');
    }
  };

  const allTypes = types;

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
          <h3><i className="fas fa-dumbbell"></i> Gestión de Tipos de Equipo</h3>
          <button className="btn btn-primary mb-3" onClick={openCreate}>
            <i className="fas fa-plus"></i> Nuevo Tipo de Equipo
          </button>

          {showModal && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i> {editing ? 'Editar Tipo de Equipo' : 'Nuevo Tipo de Equipo'}
                      </h5>
                      <button className="btn-close" onClick={() => setShowModal(false)} />
                    </div>
                    <div className="modal-body">
                      <label className="form-label">Descripción del Tipo</label>
                      <input type="text" className="form-control" value={descInput} onChange={e => setDescInput(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowModal(false)}><i className="fas fa-times"></i> Cancelar</button>
                      <button className="btn btn-primary" onClick={saveType}><i className="fas fa-save"></i> Guardar</button>
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
                      <h5 className="modal-title"><i className="fas fa-eye"></i> Detalle del Tipo de Equipo</h5>
                      <button className="btn-close" onClick={() => setViewing(null)} />
                    </div>
                    <div className="modal-body">
                      <p><strong>Descripción:</strong> {viewing.descripcion}</p>
                      <p><strong>Por Defecto:</strong> {viewing.isDefault ? 'Sí' : 'No'}</p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setViewing(null)}><i className="fas fa-times"></i> Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered">
              <head className="table-light">
              <tr>
                <th>Descripción</th>
                <th>Por Defecto</th>
                <th>Acciones</th>
              </tr>
              </head>
              <tbody>
              {allTypes.map(t => (
                  <tr key={t.id_tipo_equipo}>
                    <td>{t.descripcion}</td>
                    <td className="text-center">{t.isDefault ? <i className="fas fa-check text-success" /> : <i className="fas fa-minus text-muted" />}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => openView(t)}><i className="fas fa-eye"></i></button>
                      {!t.isDefault && (
                          <>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(t)}><i className="fas fa-edit"></i></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteType(t.id_tipo_equipo)}><i className="fas fa-trash"></i></button>
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
