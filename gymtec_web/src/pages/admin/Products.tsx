// src/pages/admin/Products.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Product {
  codigo_barra: string;   // Código de barras (PK)
  nombre: string;         // Nombre del producto
  descripcion: string;    // Descripción detallada
  costo: number;          // Costo unitario
}

export default function ProductsPage() {
  const { logout } = useAuth();
  const router = useRouter();

  // Estado de lista de productos
  const [products, setProducts] = useState<Product[]>([]);
  // Control de modales
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  // Campos del formulario
  const [codigoInput, setCodigoInput] = useState('');
  const [nombreInput, setNombreInput] = useState('');
  const [descripcionInput, setDescripcionInput] = useState('');
  const [costoInput, setCostoInput] = useState<number | ''>('');

  // Carga inicial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gymtec_products');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  // Persiste lista en localStorage
  const persist = (list: Product[]) => {
    localStorage.setItem('gymtec_products', JSON.stringify(list));
  };

  // Abre modal de creación
  const openCreate = () => {
    setEditing(null);
    setCodigoInput('');
    setNombreInput('');
    setDescripcionInput('');
    setCostoInput('');
    setShowModal(true);
  };

  // Abre modal de edición
  const openEdit = (p: Product) => {
    setEditing(p);
    setCodigoInput(p.codigo_barra);
    setNombreInput(p.nombre);
    setDescripcionInput(p.descripcion);
    setCostoInput(p.costo);
    setShowModal(true);
  };

  // Abre modal de solo lectura
  const openView = (p: Product) => {
    setViewing(p);
  };

  // Elimina producto tras confirmación
  const handleDelete = (codigo: string) => {
    if (!confirm('¿Confirma eliminación de este producto?')) return;
    const updated = products.filter(p => p.codigo_barra !== codigo);
    setProducts(updated);
    persist(updated);
  };

  // Guarda creación o edición
  const handleSave = () => {
    // Validación de campos
    if (!codigoInput.trim() || !nombreInput.trim() || !descripcionInput.trim() || costoInput === '' || costoInput <= 0) {
      alert('Debe completar todos los campos con valores válidos.');
      return;
    }
    // Mapa nuevo o actualizado
    if (editing) {
      const updated = products.map(p =>
        p.codigo_barra === editing.codigo_barra
          ? { codigo_barra: codigoInput, nombre: nombreInput, descripcion: descripcionInput, costo: Number(costoInput) }
          : p
      );
      setProducts(updated);
      persist(updated);
    } else {
      // Evita duplicados de código
      if (products.some(p => p.codigo_barra === codigoInput)) {
        alert('El código de barras ya existe.');
        return;
      }
      const newProd: Product = {
        codigo_barra: codigoInput,
        nombre: nombreInput,
        descripcion: descripcionInput,
        costo: Number(costoInput),
      };
      const updated = [newProd, ...products];
      setProducts(updated);
      persist(updated);
    }
    setShowModal(false);
  };

  // Maneja logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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

      {/* Contenedor principal */}
      <div className={styles.contentCard}>
        <h3><i className="fas fa-box-open"></i> Gestión de Productos</h3>
        <button className="btn btn-primary mb-3" onClick={openCreate}>
          <i className="fas fa-plus"></i> Nuevo Producto
        </button>

        {/* Modal Crear/Editar Producto */}
        {showModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                    {editing ? 'Editar Producto' : 'Nuevo Producto'}
                  </h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {/* Código de barras */}
                  <div className="mb-2">
                    <label className="form-label">Código de Barras</label>
                    <input
                      type="text"
                      className="form-control"
                      value={codigoInput}
                      onChange={e => setCodigoInput(e.target.value)}
                    />
                  </div>
                  {/* Nombre */}
                  <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombreInput}
                      onChange={e => setNombreInput(e.target.value)}
                    />
                  </div>
                  {/* Descripción */}
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={descripcionInput}
                      onChange={e => setDescripcionInput(e.target.value)}
                    />
                  </div>
                  {/* Costo */}
                  <div className="mb-2">
                    <label className="form-label">Costo</label>
                    <input
                      type="number"
                      className="form-control"
                      min={0.01}
                      step="0.01"
                      value={costoInput}
                      onChange={e => setCostoInput(Number(e.target.value))}
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

        {/* Modal Ver Producto */}
        {viewing && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="fas fa-eye"></i> Detalle Producto</h5>
                  <button className="btn-close" onClick={() => setViewing(null)} />
                </div>
                <div className="modal-body">
                  <p><strong>Código de Barras:</strong> {viewing.codigo_barra}</p>
                  <p><strong>Nombre:</strong> {viewing.nombre}</p>
                  <p><strong>Descripción:</strong> {viewing.descripcion}</p>
                  <p><strong>Costo:</strong> {viewing.costo}</p>
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

        {/* Tabla de productos */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.codigo_barra}>
                  <td>{p.codigo_barra}</td>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.costo}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => openView(p)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(p)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.codigo_barra)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
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
