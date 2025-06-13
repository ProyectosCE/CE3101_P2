// src/pages/admin/Services.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Service {
  id_servicio: number;
  descripcion: string;
  isDefault: boolean;
}

// Servicios por defecto (no modificables)
const defaultServices: Service[] = [
  { id_servicio: 1, descripcion: 'Indoor Cycling', isDefault: true },
  { id_servicio: 2, descripcion: 'Pilates',         isDefault: true },
  { id_servicio: 3, descripcion: 'Yoga',            isDefault: true },
  { id_servicio: 4, descripcion: 'Zumba',           isDefault: true },
  { id_servicio: 5, descripcion: 'Natación',        isDefault: true },
];

export default function ServicesPage() {
  // Se obtienen logout y router
  const { logout } = useAuth();
  const router = useRouter();

  // Estado para servicios personalizados
  const [customServices, setCustomServices] = useState<Service[]>([]);
  // Modal de crear/editar/visualizar
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [viewing, setViewing] = useState<Service | null>(null);
  // Campo de formulario
  const [descInput, setDescInput] = useState('');

  // Carga inicial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gymtec_services');
    if (saved) setCustomServices(JSON.parse(saved));
  }, []);

  // Persiste lista en localStorage
  const persist = (list: Service[]) => {
    localStorage.setItem('gymtec_services', JSON.stringify(list));
  };

  // Abre modal para crear nuevo servicio
  const openCreate = () => {
    setEditing(null);
    setDescInput('');
    setShowModal(true);
  };

  // Abre modal para editar servicio existente
  const openEdit = (s: Service) => {
    setEditing(s);
    setDescInput(s.descripcion);
    setShowModal(true);
  };

  // Abre modal de solo lectura
  const openView = (s: Service) => {
    setViewing(s);
  };

  // Elimina servicio personalizado
  const handleDelete = (id: number) => {
    if (!confirm('¿Confirma eliminación del servicio?')) return;
    const updated = customServices.filter(s => s.id_servicio !== id);
    setCustomServices(updated);
    persist(updated);
  };

  // Guarda nuevo o editado
  const handleSave = () => {
    const name = descInput.trim();
    if (!name) {
      alert('La descripción es obligatoria.');
      return;
    }

    if (editing) {
      // Editar
      const updated = customServices.map(s =>
        s.id_servicio === editing.id_servicio
          ? { ...s, descripcion: name }
          : s
      );
      setCustomServices(updated);
      persist(updated);
    } else {
      // Crear
      const newService: Service = {
        id_servicio: Date.now(),
        descripcion: name,
        isDefault: false,
      };
      const updated = [...customServices, newService];
      setCustomServices(updated);
      persist(updated);
    }
    setShowModal(false);
  };

  // Maneja cierre de sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Lista completa de servicios
  const allServices = [...defaultServices, ...customServices];

  return (
    <div className={styles.pageContainer}>
      {/* Navegación superior */}
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
        <h3><i className="fas fa-dumbbell"></i> Gestión de Servicios</h3>
        <button
          className="btn btn-primary mb-3"
          onClick={openCreate}
        >
          <i className="fas fa-plus"></i> Nuevo Servicio
        </button>

        {/* Modal Crear/Editar Servicio */}
        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                    {editing ? 'Editar Servicio' : 'Nuevo Servicio'}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
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

        {/* Modal Ver Servicio */}
        {viewing && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-eye"></i> Detalle de Servicio
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setViewing(null)}
                  />
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewing.id_servicio}</p>
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

        {/* Tabla de servicios */}
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
              {allServices.map(s => (
                <tr key={s.id_servicio}>
                  <td>{s.id_servicio}</td>
                  <td>{s.descripcion}</td>
                  <td className="text-center">
                    {s.isDefault
                      ? <i className="fas fa-check text-success" />
                      : <i className="fas fa-minus text-muted" />}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => openView(s)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {!s.isDefault && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => openEdit(s)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(s.id_servicio)}
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
