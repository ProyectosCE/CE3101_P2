import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_URL } from '@/stores/api';

interface PayrollType {
  id_planilla: number;
  descripcion: string;
  isDefault?: boolean; // <-- Agregar propiedad opcional
}

export default function PayrollTypes() {
  const { logout } = useAuth();
  const router = useRouter();

  const [types, setTypes] = useState<PayrollType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState<PayrollType | null>(null);
  const [formDesc, setFormDesc] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/planilla`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Marcar como default los ids 1, 2 y 3
            setTypes(
              data.data.map((t: any) => ({
                ...t,
                isDefault: [1, 2, 3].includes(t.id_planilla),
              }))
            );
          }
        })
        .catch(err => console.error('Error cargando planillas:', err));
  }, []);

  const openNew = () => {
    setIsEditing(null);
    setFormDesc('');
    setShowModal(true);
  };

  const openEdit = (t: PayrollType) => {
    setIsEditing(t);
    setFormDesc(t.descripcion);
    setShowModal(true);
  };

  const saveType = async () => {
    if (!formDesc.trim()) {
      alert('Debe ingresar una descripción.');
      return;
    }

    try {
      if (isEditing) {
        const res = await fetch(`${API_URL}/api/planilla/${isEditing.id_planilla}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...isEditing, descripcion: formDesc }),
        });
        const data = await res.json();
        if (data.success) {
          setTypes(prev =>
              prev.map(t =>
                t.id_planilla === isEditing.id_planilla
                  ? { ...data.data, isDefault: [1, 2, 3].includes(data.data.id_planilla) }
                  : t
              )
          );
        }
      } else {
        const res = await fetch(`${API_URL}/api/planilla`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcion: formDesc }),
        });
        const data = await res.json();
        if (data.success) {
          setTypes(prev => [
            { ...data.data, isDefault: [1, 2, 3].includes(data.data.id_planilla) },
            ...prev,
          ]);
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar tipo de planilla:', err);
      alert('Hubo un error al guardar.');
    }
  };

  const deleteType = async (id: number) => {
    if (!confirm('¿Confirma eliminar este tipo de planilla?')) return;
    try {
      const res = await fetch(`${API_URL}/api/planilla/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTypes(prev => prev.filter(t => t.id_planilla !== id));
      }
    } catch (err) {
      console.error('Error al eliminar tipo de planilla:', err);
      alert('No se pudo eliminar.');
    }
  };

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

        {/* Botón Inicio */}
        <button className={styles.homeButton} onClick={() => router.push('/admin/Dashboard')}>
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

          {/* Tabla de tipos */}
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
              {types.map(t => (
                  <tr key={t.id_planilla}>
                    <td>{t.descripcion}</td>
                    <td className="text-center">
                      {t.isDefault
                        ? <i className="fas fa-check text-success" />
                        : <i className="fas fa-minus text-muted" />}
                    </td>
                    <td>
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
                              onClick={() => deleteType(t.id_planilla)}
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

          {/* Modal de creación/edición */}
          {showModal && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {isEditing ? 'Editar Tipo de Planilla' : 'Nueva Planilla'}
                      </h5>
                      <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
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
                      <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
