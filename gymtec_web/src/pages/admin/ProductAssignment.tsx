// src/pages/admin/ProductAssignment.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Branch {
  id_sucursal: number;
  nombre_sucursal: string;
  tienda_activo: boolean;
}

interface Product {
  codigo_barra: string;
  nombre: string;
}

export default function ProductAssignment() {
  const { logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [associatedProducts, setAssociatedProducts] = useState<string[]>([]);

  const [selectedBranchId, setSelectedBranchId] = useState<number | ''>('');
  const [toAdd, setToAdd] = useState<Set<string>>(new Set());
  const [toRemove, setToRemove] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBranches();
    fetchProducts();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/sucursal');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setBranches(json.data.filter((b: Branch) => b.tienda_activo));
    } catch (err: any) {
      alert('Error al obtener sucursales: ' + err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/producto');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setProducts(json.data);
    } catch (err: any) {
      alert('Error al obtener productos: ' + err.message);
    }
  };

  const fetchAssociatedProducts = async (id: number) => {
    try {
      const res = await fetch(`/api/sucursalxproducto/${id}`);
      const json = await res.json();
      if (json.success) {
        setAssociatedProducts(json.data.map((p: any) => p.codigo_barra));
      } else {
        setAssociatedProducts([]);
      }
    } catch (err: any) {
      alert('Error al cargar productos asociados: ' + err.message);
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedBranchId(id || '');
    setToAdd(new Set());
    setToRemove(new Set());
    if (id) fetchAssociatedProducts(id);
  };

  const handleAdd = async () => {
    if (selectedBranchId === '') return;
    for (const codigo of toAdd) {
      await fetch(`/api/sucursalxproducto/${selectedBranchId}/${codigo}`, {
        method: 'POST'
      });
    }
    fetchAssociatedProducts(selectedBranchId);
    setToAdd(new Set());
  };

  const handleRemove = async () => {
    if (selectedBranchId === '') return;
    for (const codigo of toRemove) {
      await fetch(`/api/sucursalxproducto/${selectedBranchId}/${codigo}`, {
        method: 'DELETE'
      });
    }
    fetchAssociatedProducts(selectedBranchId);
    setToRemove(new Set());
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const associated = products.filter(p => associatedProducts.includes(p.codigo_barra));
  const available = products.filter(p => !associatedProducts.includes(p.codigo_barra));

  return (
      <div className={styles.pageContainer}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>

        <button className={styles.homeButton} onClick={() => router.push('/admin/GymConfiguration')}>
          <i className="fas fa-sliders-h"></i> Configuración
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>

        <h2 className={styles.mainHeader}>
          <i className="fas fa-store"></i> Asociación de Productos a Tienda
        </h2>
        <p className={styles.subHeader}>
          Seleccione una sucursal con tienda y administre sus productos.
        </p>

        <div className={styles.sectionContainer}>
          <div className="mb-4">
            <label className="form-label"><strong>Sucursal con Tienda:</strong></label>
            <select className="form-select" value={selectedBranchId} onChange={handleBranchChange}>
              <option value="">-- Seleccione una sucursal --</option>
              {branches.map(b => (
                  <option key={b.id_sucursal} value={b.id_sucursal}>{b.nombre_sucursal}</option>
              ))}
            </select>
          </div>

          {selectedBranchId !== '' && (
              <div className="row">
                <div className="col-md-5">
                  <h5>Productos No Asociados</h5>
                  <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {available.map(p => (
                        <li key={p.codigo_barra} className="list-group-item">
                          <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={toAdd.has(p.codigo_barra)}
                              onChange={() => {
                                const s = new Set(toAdd);
                                s.has(p.codigo_barra) ? s.delete(p.codigo_barra) : s.add(p.codigo_barra);
                                setToAdd(s);
                              }}
                          />
                          {p.nombre}
                        </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" disabled={toAdd.size === 0} onClick={handleAdd}>
                    <i className="fas fa-plus"></i> Asociar
                  </button>
                </div>

                <div className="col-md-5 offset-md-2">
                  <h5>Productos Asociados</h5>
                  <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {associated.map(p => (
                        <li key={p.codigo_barra} className="list-group-item">
                          <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={toRemove.has(p.codigo_barra)}
                              onChange={() => {
                                const s = new Set(toRemove);
                                s.has(p.codigo_barra) ? s.delete(p.codigo_barra) : s.add(p.codigo_barra);
                                setToRemove(s);
                              }}
                          />
                          {p.nombre}
                        </li>
                    ))}
                  </ul>
                  <button className="btn btn-danger" disabled={toRemove.size === 0} onClick={handleRemove}>
                    <i className="fas fa-minus"></i> Desasociar
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
