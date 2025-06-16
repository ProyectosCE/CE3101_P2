// src/pages/admin/CopyGym.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Branch {
  id: number;
  nombre: string;
}

interface Treatment {
  id: number;
  nombre: string;
}

interface Product {
  codigo: string;
  nombre: string;
}

interface Clase {
  id: number;
  servicio: string;
  modalidad: 'Individual' | 'Grupal';
  fecha: string;
}

export default function CopyGymPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [sourceId, setSourceId] = useState<number | ''>('');
  const [destId, setDestId] = useState<number | ''>('');
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [classes, setClasses] = useState<Clase[]>([]);

  // Cargar sucursales (simulado)
  useEffect(() => {
    setBranches([
      { id: 1, nombre: 'Central Cartago' },
      { id: 2, nombre: 'San Carlos' },
      { id: 3, nombre: 'San José' },
      { id: 4, nombre: 'Alajuela' },
      { id: 5, nombre: 'Limón' },
    ]);
  }, []);

  // Al cambiar el source, recargar datos
  useEffect(() => {
    if (!sourceId) return;
    // Simulación de fetch de datos de la sucursal origen
    setTreatments([
      { id: 1, nombre: 'Masaje relajante' },
      { id: 2, nombre: 'Sauna' },
    ]);
    setProducts([
      { codigo: 'P001', nombre: 'Barra energética' },
      { codigo: 'P002', nombre: 'Agua isotónica' },
    ]);
    setClasses([
      { id: 101, servicio: 'Yoga', modalidad: 'Grupal', fecha: '2025-06-10' },
      { id: 102, servicio: 'Pilates', modalidad: 'Individual', fecha: '2025-06-11' },
    ]);
    // Limpiar selección de destino si coincide
    if (destId === sourceId) {
      setDestId('');
    }
  }, [sourceId]);

  const handleCopy = () => {
    if (!sourceId || !destId) return;
    const src = branches.find(b => b.id === sourceId)?.nombre;
    const dst = branches.find(b => b.id === destId)?.nombre;
    if (
      window.confirm(
        `¿Confirma copiar la sucursal "${src}" al destino "${dst}"?`
      )
    ) {
      // aquí iría la llamada real al API
      alert(`Datos copiados de "${src}" hacia "${dst}" con éxito.`);
      router.push('/admin/Dashboard');
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

      {/* Botones */}
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

      {/* Encabezado */}
      <h2 className={styles.mainHeader}>
        <i className="fas fa-clone"></i> Copiar Gimnasio
      </h2>
      <p className={styles.subHeader}>
        Seleccione origen y destino para copiar todos los datos.
      </p>

      {/* Selector de origen */}
      <div className="mb-3">
        <label className="form-label"><strong>Sucursal Origen:</strong></label>
        <select
          className="form-select"
          value={sourceId}
          onChange={e => setSourceId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">-- Elija origen --</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>
      </div>

      {/* Selector de destino */}
      {sourceId && (
        <div className="mb-4">
          <label className="form-label"><strong>Sucursal Destino:</strong></label>
          <select
            className="form-select"
            value={destId}
            onChange={e => setDestId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">-- Elija destino --</option>
            {branches
              .filter(b => b.id !== sourceId)
              .map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
          </select>
        </div>
      )}

      {/* Detalles de la sucursal origen */}
      {sourceId && destId && (
        <div className={styles.sectionContainer}>
          {/* Tratamientos */}
          <h5><i className="fas fa-spa"></i> Tratamientos de Spa</h5>
          <ul className="list-group mb-3">
            {treatments.map(t => (
              <li key={t.id} className="list-group-item">{t.nombre}</li>
            ))}
          </ul>

          {/* Productos */}
          <h5><i className="fas fa-store"></i> Productos de Tienda</h5>
          <ul className="list-group mb-3">
            {products.map(p => (
              <li key={p.codigo} className="list-group-item">
                {p.nombre} ({p.codigo})
              </li>
            ))}
          </ul>

          {/* Clases */}
          <h5><i className="fas fa-chalkboard-teacher"></i> Clases Programadas</h5>
          <ul className="list-group mb-4">
            {classes.map(c => (
              <li key={c.id} className="list-group-item">
                {c.servicio} – {c.modalidad} – {c.fecha}
              </li>
            ))}
          </ul>

          {/* Botón Copiar */}
          <button
            className="btn btn-primary"
            onClick={handleCopy}
          >
            <i className="fas fa-copy"></i> Copiar Gimnasio
          </button>
        </div>
      )}
    </div>
  );
}
