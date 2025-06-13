// src/pages/admin/Positions.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Position {
  id_puesto: number;
  descripcion: string;   // Nombre oficial del puesto
  detalle: string;       // Descripción detallada del rol
  isDefault: boolean;
}

// Datos por defecto
const defaultPositions: Position[] = [
  { id_puesto: 1, descripcion: 'Administrador', detalle: 'Encargado de la gestión global del gimnasio.', isDefault: true },
  { id_puesto: 2, descripcion: 'Instructor', detalle: 'Responsable de impartir clases y entrenamientos.', isDefault: true },
  { id_puesto: 3, descripcion: 'Dependiente Spa', detalle: 'Atiende las operaciones y servicio al cliente en el spa.', isDefault: true },
  { id_puesto: 4, descripcion: 'Dependiente Tienda', detalle: 'Maneja la venta de productos en la tienda de conveniencia.', isDefault: true },
];

export default function Positions() {
  const { logout } = useAuth();
  const router = useRouter();

  // Estados
  const [customPositions, setCustomPositions] = useState<Position[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [descInput, setDescInput] = useState('');
  const [detailInput, setDetailInput] = useState('');
  const [viewing, setViewing] = useState<Position | null>(null);

  // Carga inicial de personalizados
  useEffect(() => {
    const saved = localStorage.getItem('gymtec_positions');
    if (saved) setCustomPositions(JSON.parse(saved));
  }, []);

  // Persiste en localStorage
  const persist = (list: Position[]) => {
    localStorage.setItem('gymtec_positions', JSON.stringify(list));
  };

  // Abrir modal de creación
  const openCreate = () => {
    setEditing(null);
    setDescInput('');
    setDetailInput('');
    setShowModal(true);
  };

  // Abrir modal de edición
  const openEdit = (p: Position) => {
    setEditing(p);
    setDescInput(p.descripcion);
    setDetailInput(p.detalle || '');
    setShowModal(true);
  };

  // Abrir modal de detalle
  const openView = (p: Position) => {
    setViewing(p);
  };

  // Eliminar personalizado
  const handleDelete = (id: number) => {
    if (!confirm('¿Confirma eliminación de este puesto?')) return;
    const updated = customPositions.filter(p => p.id_puesto !== id);
    setCustomPositions(updated);
    persist(updated);
  };

  // Guardar creación o edición
  const handleSave = () => {
    if (!descInput.trim() || !detailInput.trim()) {
      alert('Debe ingresar nombre y descripción del puesto.');
      return;
    }
    if (editing) {
      const updated = customPositions.map(p =>
        p.id_puesto === editing.id_puesto
          ? { ...p, descripcion: descInput, detalle: detailInput }
          : p
      );
      setCustomPositions(updated); persist(updated);
    } else {
      const newPos: Position = {
        id_puesto: Date.now(),
        descripcion: descInput,
        detalle: detailInput,
        isDefault: false,
      };
      const updated = [...customPositions, newPos];
      setCustomPositions(updated); persist(updated);
    }
    setShowModal(false);
  };

  // Cerrar sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Lista completa
  const allPositions = [...defaultPositions, ...customPositions];

  return (
    <div className={styles.pageContainer}>
      {/* Navegación superior */}
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

        {/* Modal crear/editar */}
        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                    {editing ? 'Editar Puesto' : 'Nuevo Puesto'}
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
                  <div className="mb-3">
                    <label className="form-label">Descripción Detallada</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={detailInput}
                      onChange={e => setDetailInput(e.target.value)}
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

        {/* Modal ver detalles */}
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
                  <p><strong>ID:</strong> {viewing.id_puesto}</p>
                  <p><strong>Nombre:</strong> {viewing.descripcion}</p>
                  <p><strong>Descripción:</strong> {viewing.detalle}</p>
                  <p>
                    <strong>Por Defecto:</strong>{' '}
                    {viewing.isDefault ? 'Sí' : 'No'}
                  </p>
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

        {/* Tabla de puestos */}
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
              {allPositions.map(p => (
                <tr key={p.id_puesto}>
                  <td>{p.id_puesto}</td>
                  <td>{p.descripcion}</td>
                  <td className="text-center">
                    {p.isDefault
                      ? <i className="fas fa-check text-success" />
                      : <i className="fas fa-minus text-muted" />}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => openView(p)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {!p.isDefault && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => openEdit(p)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(p.id_puesto)}
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
