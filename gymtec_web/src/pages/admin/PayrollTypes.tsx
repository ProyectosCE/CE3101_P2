// src/pages/admin/PayrollTypes.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface PayrollType {
  id_planilla: number;
  descripcion: string;
}

export default function PayrollTypes() {
  const { logout } = useAuth();
  const router = useRouter();

  // Estado de tipos de planilla (inicial con los 3 por defecto)
  const [types, setTypes] = useState<PayrollType[]>([
    { id_planilla: 1, descripcion: 'Pago Mensual' },
    { id_planilla: 2, descripcion: 'Pago por Horas' },
    { id_planilla: 3, descripcion: 'Pago por Clase' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState<PayrollType | null>(null);
  const [formDesc, setFormDesc] = useState('');

  // Abrir modal para nuevo
  const openNew = () => {
    setIsEditing(null);
    setFormDesc('');
    setShowModal(true);
  };

  // Abrir modal para editar
  const openEdit = (t: PayrollType) => {
    setIsEditing(t);
    setFormDesc(t.descripcion);
    setShowModal(true);
  };

  // Guardar nuevo o editado
  const saveType = () => {
    if (!formDesc.trim()) {
      alert('Debe ingresar una descripción.');
      return;
    }
    if (isEditing) {
      setTypes(prev =>
        prev.map(t =>
          t.id_planilla === isEditing.id_planilla
            ? { ...t, descripcion: formDesc }
            : t
        )
      );
    } else {
      const newType: PayrollType = {
        id_planilla: Date.now(),
        descripcion: formDesc.trim(),
      };
      setTypes(prev => [newType, ...prev]);
    }
    setShowModal(false);
  };

  // Eliminar un tipo
  const deleteType = (id: number) => {
    if (!confirm('¿Confirma eliminar este tipo de planilla?')) return;
    setTypes(prev => prev.filter(t => t.id_planilla !== id));
  };

  // Cerrar sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón “Inicio” */}
      <button
        className={styles.homeButton}
        onClick={() => router.push('/admin/Dashboard')}
      >
        <i className="fas fa-home"></i> Inicio
      </button>

      {/* Botón Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      {/* Encabezado */}
      <h2 className={styles.mainHeader}>
        <i className="fas fa-file-invoice-dollar"></i> Gestión de Tipos de Planilla
      </h2>
      <p className={styles.subHeader}>
        Desde aquí se pueden insertar, editar, eliminar y consultar los tipos de planilla.
      </p>

      <div className={styles.sectionContainer}>
        {/* Botón Nuevo */}
        <button className="btn btn-primary mb-3" onClick={openNew}>
          <i className="fas fa-plus"></i> Nueva Planilla
        </button>

        {/* Lista / Tabla */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {types.map(t => (
                <tr key={t.id_planilla}>
                  <td>{t.id_planilla}</td>
                  <td>{t.descripcion}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(t)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteType(t.id_planilla)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Insertar/Editar */}
        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? (
                      <>Editar Tipo de Planilla</>
                    ) : (
                      <>Nueva Planilla</>
                    )}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={saveType}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
