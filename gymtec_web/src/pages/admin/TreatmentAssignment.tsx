// src/pages/admin/TreatmentAssignment.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Branch {
  id: number;
  nombre: string;
  spaActivo: boolean;
}

interface Treatment {
  id_tratamiento: number;
  nombre: string;
}

export default function TreatmentAssignment() {
  // Se obtienen los métodos de autenticación y navegación
  const { logout } = useAuth();
  const router = useRouter();

  // Estado para sucursales con Spa activo
  const [spas, setSpas] = useState<Branch[]>([]);
  // Estado para tratamientos disponibles
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  // Mapa de asociaciones { spaId: [tratamientoId, …] }
  const [assocMap, setAssocMap] = useState<Record<number, number[]>>({});

  // Estado de UI
  const [selectedSpaId, setSelectedSpaId] = useState<number | ''>('');
  const [toAdd, setToAdd] = useState<Set<number>>(new Set());
  const [toRemove, setToRemove] = useState<Set<number>>(new Set());

  // Carga inicial de datos (placeholder, luego vendrá API)
  useEffect(() => {
    const ejemploSpas: Branch[] = [
      { id: 1, nombre: 'Central Cartago', spaActivo: true },
      { id: 2, nombre: 'San Carlos', spaActivo: true },
      { id: 3, nombre: 'San José', spaActivo: false },
      { id: 4, nombre: 'Alajuela', spaActivo: true },
    ];
    setSpas(ejemploSpas.filter(s => s.spaActivo));

    setTreatments([
      { id_tratamiento: 1, nombre: 'Masaje relajante' },
      { id_tratamiento: 2, nombre: 'Masaje descarga muscular' },
      { id_tratamiento: 3, nombre: 'Sauna' },
      { id_tratamiento: 4, nombre: 'Baños a vapor' },
    ]);

    setAssocMap({});
  }, []);

  const handleSpaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedSpaId(id || '');
    setToAdd(new Set());
    setToRemove(new Set());
  };

  const handleAdd = () => {
    if (selectedSpaId === '') return;
    const current = new Set(assocMap[selectedSpaId] || []);
    toAdd.forEach(id => current.add(id));
    setAssocMap({ ...assocMap, [selectedSpaId]: Array.from(current) });
    setToAdd(new Set());
  };

  const handleRemove = () => {
    if (selectedSpaId === '') return;
    const current = new Set(assocMap[selectedSpaId] || []);
    toRemove.forEach(id => current.delete(id));
    setAssocMap({ ...assocMap, [selectedSpaId]: Array.from(current) });
    setToRemove(new Set());
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const associated = selectedSpaId === ''
    ? []
    : (assocMap[selectedSpaId] || [])
        .map(id => treatments.find(t => t.id_tratamiento === id)!)
        .filter(Boolean);
  const available = selectedSpaId === ''
    ? []
    : treatments.filter(t => !associated.some(a => a.id_tratamiento === t.id_tratamiento));

  return (
    <div className={styles.pageContainer}>
      {/* Logo centrado */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón Configuración en lugar de Inicio */}
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
        <i className="fas fa-spa"></i> Asociación de Tratamientos al Spa
      </h2>
      <p className={styles.subHeader}>
        Seleccione una sucursal con Spa y administre sus tratamientos.
      </p>

      {/* Contenedor de sección */}
      <div className={styles.sectionContainer}>
        {/* Selector de Spa */}
        <div className="mb-4">
          <label className="form-label"><strong>Sucursal con Spa:</strong></label>
          <select
            className="form-select"
            value={selectedSpaId}
            onChange={handleSpaChange}
          >
            <option value="">-- Seleccione una sucursal --</option>
            {spas.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        {selectedSpaId !== '' && (
          <div className="row">
            {/* Tratamientos No Asociados */}
            <div className="col-md-5">
              <h5>Tratamientos No Asociados</h5>
              <ul
                className="list-group mb-2"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {available.map(t => (
                  <li key={t.id_tratamiento} className="list-group-item">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={toAdd.has(t.id_tratamiento)}
                      onChange={() => {
                        const s = new Set(toAdd);
                        s.has(t.id_tratamiento)
                          ? s.delete(t.id_tratamiento)
                          : s.add(t.id_tratamiento);
                        setToAdd(s);
                      }}
                    />
                    {t.nombre}
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

            {/* Tratamientos Asociados */}
            <div className="col-md-5 offset-md-2">
              <h5>Tratamientos Asociados</h5>
              <ul
                className="list-group mb-2"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {associated.map(t => (
                  <li key={t.id_tratamiento} className="list-group-item">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={toRemove.has(t.id_tratamiento)}
                      onChange={() => {
                        const s = new Set(toRemove);
                        s.has(t.id_tratamiento)
                          ? s.delete(t.id_tratamiento)
                          : s.add(t.id_tratamiento);
                        setToRemove(s);
                      }}
                    />
                    {t.nombre}
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
