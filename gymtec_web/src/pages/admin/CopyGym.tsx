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
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [classes, setClasses] = useState<Clase[]>([]);

  // Carga inicial de sucursales (simulado)
  useEffect(() => {
    setBranches([
      { id: 1, nombre: 'Central Cartago' },
      { id: 2, nombre: 'San Carlos' },
      { id: 3, nombre: 'San José' },
      { id: 4, nombre: 'Alajuela' },
      { id: 5, nombre: 'Limón' },
    ]);
  }, []);

  // Al cambiar de sucursal, carga sus detalles (simulado)
  useEffect(() => {
    if (selectedId === '') return;

    // Aquí vendrán llamadas a la API para cada entidad...
    // Simulación:
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
  }, [selectedId]);

  const handleCopy = () => {
    if (!selectedId) return;
    if (
      window.confirm(
        '¿Seguro que desea copiar el gimnasio "' +
          branches.find(b => b.id === selectedId)?.nombre +
          '"?'
      )
    ) {
      // Aquí se invocaría a la API que copia todo en backend...
      alert('Gimnasio copiado con éxito.');
      router.push('/admin/Dashboard');
    }
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
      <button className={styles.logoutButton} onClick={() => { logout(); router.push('/login'); }}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      {/* Encabezado */}
      <h2 className={styles.mainHeader}>
        <i className="fas fa-clone"></i> Copiar Gimnasio
      </h2>
      <p className={styles.subHeader}>
        Seleccione una sucursal origen para copiar todos sus datos.
      </p>

      {/* Selector de Sucursal */}
      <div className="mb-4">
        <label className="form-label"><strong>Sucursal origen</strong></label>
        <select
          className="form-select"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">-- Elija una sucursal --</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Detalles */}
      {selectedId !== '' && (
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
