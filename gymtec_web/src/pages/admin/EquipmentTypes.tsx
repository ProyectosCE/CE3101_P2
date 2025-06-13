// src/pages/admin/EquipmentTypes.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface EquipmentType {
  id_tipo_equipo: number;
  descripcion: string;   // Descripción del tipo de equipo
  isDefault: boolean;
}

// Valores por defecto (no modificables)
const defaultTypes: EquipmentType[] = [
  { id_tipo_equipo: 1, descripcion: 'Cintas de correr',            isDefault: true },
  { id_tipo_equipo: 2, descripcion: 'Bicicletas estacionarias',    isDefault: true },
  { id_tipo_equipo: 3, descripcion: 'Multigimnasios',              isDefault: true },
  { id_tipo_equipo: 4, descripcion: 'Remos',                       isDefault: true },
  { id_tipo_equipo: 5, descripcion: 'Pesas',                       isDefault: true },
];

export default function EquipmentTypes() {
  // Se obtienen logout y router
  const { logout } = useAuth();
  const router = useRouter();

  // Estado para tipos personalizados
  const [customTypes, setCustomTypes] = useState<EquipmentType[]>([]);
  // Modal (crear/editar/ver)
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EquipmentType | null>(null);
  const [viewing, setViewing] = useState<EquipmentType | null>(null);
  // Campo de descripción
  const [descInput, setDescInput] = useState('');

  // Carga inicial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gymtec_equipment_types');
    if (saved) setCustomTypes(JSON.parse(saved));
  }, []);

  // Persiste lista en localStorage
  const persist = (list: EquipmentType[]) => {
    localStorage.setItem('gymtec_equipment_types', JSON.stringify(list));
  };

  // Abre modal para creación
  const openCreate = () => {
    setEditing(null);
    setDescInput('');
    setShowModal(true);
  };

  // Abre modal para edición
  const openEdit = (t: EquipmentType) => {
    setEditing(t);
    setDescInput(t.descripcion);
    setShowModal(true);
  };

  // Abre modal para ver detalle
  const openView = (t: EquipmentType) => {
    setViewing(t);
  };

  // Elimina un tipo personalizado
  const handleDelete = (id: number) => {
    if (!confirm('¿Confirma eliminación de este tipo de equipo?')) return;
    const updated = customTypes.filter(t => t.id_tipo_equipo !== id);
    setCustomTypes(updated);
    persist(updated);
  };

  // Guarda creación o edición
  const handleSave = () => {
    const name = descInput.trim();
    if (!name) {
      alert('La descripción es obligatoria.');
      return;
    }
    if (editing) {
      const updated = customTypes.map(t =>
        t.id_tipo_equipo === editing.id_tipo_equipo
          ? { ...t, descripcion: name }
          : t
      );
      setCustomTypes(updated);
      persist(updated);
    } else {
      const newType: EquipmentType = {
        id_tipo_equipo: Date.now(),
        descripcion: name,
        isDefault: false,
      };
      const updated = [...customTypes, newType];
      setCustomTypes(updated);
      persist(updated);
    }
    setShowModal(false);
  };

  // Maneja cierre de sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Lista unificada
  const allTypes = [...defaultTypes, ...customTypes];

  return (
    <div className={styles.pageContainer}>
      {/* Navigación superior */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>
      <button
        className={styles.homeButton}
        onClick={() => router.push('/admin/Dashboard')}
      >
        <i className="fas fa-home"></i> Inicio
      </button>
      <button
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      <div className={styles.contentCard}>
        <h3><i className="fas fa-dumbbell"></i> Gestión de Tipos de Equipo</h3>
        <button
          className="btn btn-primary mb-3"
          onClick={openCreate}
        >
          <i className="fas fa-plus"></i> Nuevo Tipo de Equipo
        </button>

        {/* Modal crear/editar */}
        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                    {editing ? 'Editar Tipo de Equipo' : 'Nuevo Tipo de Equipo'}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <label className="form-label">Descripción del Tipo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={descInput}
                    onChange={e => setDescInput(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    <i className="fas fa-times"></i> Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    <i className="fas fa-save"></i> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal ver detalle */}
        {viewing && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-eye"></i> Detalle del Tipo de Equipo
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setViewing(null)}
                  />
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewing.id_tipo_equipo}</p>
                  <p><strong>Descripción:</strong> {viewing.descripcion}</p>
                  <p><strong>Por Defecto:</strong> {viewing.isDefault ? 'Sí' : 'No'}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewing(null)}
                  >
                    <i className="fas fa-times"></i> Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de tipos de equipo */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Por Defecto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allTypes.map(t => (
                <tr key={t.id_tipo_equipo}>
                  <td>{t.id_tipo_equipo}</td>
                  <td>{t.descripcion}</td>
                  <td className="text-center">
                    {t.isDefault
                      ? <i className="fas fa-check text-success" />
                      : <i className="fas fa-minus text-muted" />}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => openView(t)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {!t.isDefault && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => openEdit(t)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(t.id_tipo_equipo)}
                        >
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
