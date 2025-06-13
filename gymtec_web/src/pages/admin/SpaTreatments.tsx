// src/pages/admin/SpaTreatments.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Treatment {
  id: number;
  nombre: string;
  isDefault: boolean;
}

export default function SpaTreatments() {
  const { logout } = useAuth();
  const router = useRouter();

  // Definición de tratamientos por defecto (no modificables)
  const defaultTreatments: Treatment[] = [
    { id: 1, nombre: 'Masaje relajante', isDefault: true },
    { id: 2, nombre: 'Masaje descarga muscular', isDefault: true },
    { id: 3, nombre: 'Sauna', isDefault: true },
    { id: 4, nombre: 'Baños a vapor', isDefault: true },
  ];

  // Estado para tratamientos personalizados
  const [customTreatments, setCustomTreatments] = useState<Treatment[]>([]);
  // Modal de creación/edición
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Treatment | null>(null);
  // Formulario
  const [nameInput, setNameInput] = useState('');

  // Se carga lista desde localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('gymtec_spa_treatments');
    if (saved) setCustomTreatments(JSON.parse(saved));
  }, []);

  // Guarda en localStorage
  const persist = (list: Treatment[]) => {
    localStorage.setItem('gymtec_spa_treatments', JSON.stringify(list));
  };

  // Abre modal para nuevo tratamiento
  const openCreate = () => {
    setEditing(null);
    setNameInput('');
    setShowModal(true);
  };

  // Abre modal para editar un personalizado
  const openEdit = (t: Treatment) => {
    setEditing(t);
    setNameInput(t.nombre);
    setShowModal(true);
  };

  // Elimina un personalizado
  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este tratamiento?')) {
      const updated = customTreatments.filter(t => t.id !== id);
      setCustomTreatments(updated);
      persist(updated);
    }
  };

  // Guarda nuevo o editado
  const handleSave = () => {
    if (!nameInput.trim()) {
      alert('El nombre es obligatorio.');
      return;
    }
    if (editing) {
      // Editar
      const updated = customTreatments.map(t =>
        t.id === editing.id ? { ...t, nombre: nameInput } : t
      );
      setCustomTreatments(updated);
      persist(updated);
    } else {
      // Crear
      const newItem: Treatment = {
        id: Date.now(),
        nombre: nameInput,
        isDefault: false,
      };
      const updated = [...customTreatments, newItem];
      setCustomTreatments(updated);
      persist(updated);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo y navegación */}
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
        <button className="btn btn-primary mb-3" onClick={openCreate}>
          <i className="fas fa-plus"></i> Nuevo Tratamiento
        </button>

        {/* Modal crear/editar */}
        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                    {editing ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
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

        {/* Tabla de tratamientos */}
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
              {defaultTreatments.concat(customTreatments).map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.nombre}</td>
                  <td className="text-center">
                    {t.isDefault
                      ? <i className="fas fa-check text-success" />
                      : <i className="fas fa-minus text-muted" />}
                  </td>
                  <td className="text-center">
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
                          onClick={() => handleDelete(t.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </>
                    )}
                    {t.isDefault && (
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
