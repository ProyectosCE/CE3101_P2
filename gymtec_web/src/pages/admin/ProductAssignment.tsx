// src/pages/admin/ProductAssignment.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Branch {
  id: number;
  nombre: string;
  tiendaActivo: boolean;
}

interface Product {
  id_producto: number;
  nombre: string;
}

export default function ProductAssignment() {
  // Obtiene logout y navegación
  const { logout } = useAuth();
  const router = useRouter();

  // Estado de sucursales con tienda activa
  const [branches, setBranches] = useState<Branch[]>([]);
  // Estado de productos disponibles
  const [products, setProducts] = useState<Product[]>([]);
  // Mapa de asociaciones { branchId: [productId, …] }
  const [assocMap, setAssocMap] = useState<Record<number, number[]>>({});

  // UI state
  const [selectedBranchId, setSelectedBranchId] = useState<number | ''>('');
  const [toAdd, setToAdd] = useState<Set<number>>(new Set());
  const [toRemove, setToRemove] = useState<Set<number>>(new Set());

  // Carga de datos de ejemplo (reemplazar por API)
  useEffect(() => {
    // Sucursales de ejemplo
    const ejemplo: Branch[] = [
      { id: 1, nombre: 'Central Cartago', tiendaActivo: true },
      { id: 2, nombre: 'San Carlos', tiendaActivo: true },
      { id: 3, nombre: 'San José', tiendaActivo: false },
      { id: 4, nombre: 'Alajuela', tiendaActivo: true },
      { id: 5, nombre: 'Limón', tiendaActivo: true },
    ];
    setBranches(ejemplo.filter(b => b.tiendaActivo));

    // Productos de ejemplo
    setProducts([
      { id_producto: 1, nombre: 'Proteína Whey' },
      { id_producto: 2, nombre: 'Barra Energética' },
      { id_producto: 3, nombre: 'Bebida Isotónica' },
      { id_producto: 4, nombre: 'Guantes de Boxeo' },
    ]);

    // Sin asociaciones inicialmente
    setAssocMap({});
  }, []);

  // Maneja cambio de sucursal
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedBranchId(id || '');
    setToAdd(new Set());
    setToRemove(new Set());
  };

  // Asocia productos
  const handleAdd = () => {
    if (selectedBranchId === '') return;
    const current = new Set(assocMap[selectedBranchId] || []);
    toAdd.forEach(id => current.add(id));
    setAssocMap({ ...assocMap, [selectedBranchId]: Array.from(current) });
    setToAdd(new Set());
  };

  // Desasocia productos
  const handleRemove = () => {
    if (selectedBranchId === '') return;
    const current = new Set(assocMap[selectedBranchId] || []);
    toRemove.forEach(id => current.delete(id));
    setAssocMap({ ...assocMap, [selectedBranchId]: Array.from(current) });
    setToRemove(new Set());
  };

  // Cierra sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Calcula asociados y disponibles
  const associated = selectedBranchId === ''
    ? []
    : (assocMap[selectedBranchId] || [])
        .map(id => products.find(p => p.id_producto === id)!)
        .filter(Boolean);
  const available = selectedBranchId === ''
    ? []
    : products.filter(p => !associated.some(a => a.id_producto === p.id_producto));

  return (
    <div className={styles.pageContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón Inicio */}
      <button
        className={styles.homeButton}
        onClick={() => router.push('/admin/GymConfiguration')}
      >
        <i className="fas fa-sliders-h"></i> Configuración
      </button>

      {/* Botón Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      {/* Encabezado */}
      <h2 className={styles.mainHeader}>
        <i className="fas fa-store"></i> Asociación de Productos a Tienda
      </h2>
      <p className={styles.subHeader}>
        Seleccione una sucursal con tienda y administre sus productos.
      </p>

      {/* Contenedor de sección */}
      <div className={styles.sectionContainer}>
        {/* Selector de sucursal */}
        <div className="mb-4">
          <label className="form-label"><strong>Sucursal con Tienda:</strong></label>
          <select
            className="form-select"
            value={selectedBranchId}
            onChange={handleBranchChange}
          >
            <option value="">-- Seleccione una sucursal --</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>

        {selectedBranchId !== '' && (
          <div className="row">
            {/* Productos No Asociados */}
            <div className="col-md-5">
              <h5>Productos No Asociados</h5>
              <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {available.map(p => (
                  <li key={p.id_producto} className="list-group-item">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={toAdd.has(p.id_producto)}
                      onChange={() => {
                        const s = new Set(toAdd);
                        s.has(p.id_producto)
                          ? s.delete(p.id_producto)
                          : s.add(p.id_producto);
                        setToAdd(s);
                      }}
                    />
                    {p.nombre}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary"
                disabled={toAdd.size === 0}
                onClick={handleAdd}
              >
                <i className="fas fa-plus"></i> Asociar
              </button>
            </div>

            {/* Productos Asociados */}
            <div className="col-md-5 offset-md-2">
              <h5>Productos Asociados</h5>
              <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {associated.map(p => (
                  <li key={p.id_producto} className="list-group-item">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={toRemove.has(p.id_producto)}
                      onChange={() => {
                        const s = new Set(toRemove);
                        s.has(p.id_producto)
                          ? s.delete(p.id_producto)
                          : s.add(p.id_producto);
                        setToRemove(s);
                      }}
                    />
                    {p.nombre}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-danger"
                disabled={toRemove.size === 0}
                onClick={handleRemove}
              >
                <i className="fas fa-minus"></i> Desasociar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
