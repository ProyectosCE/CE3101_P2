// src/pages/admin/TreatmentAssignment.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_BASE_URL } from '@/stores/api';

interface Branch {
  id_sucursal: number;
  nombre_sucursal: string;
  spa_activo: boolean;
}

interface Treatment {
  id_tratamiento: number;
  nombre_tratamiento: string;
}

export default function TreatmentAssignment() {
  const { logout } = useAuth();
  const router = useRouter();

  const [spas, setSpas] = useState<Branch[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [assocMap, setAssocMap] = useState<Record<number, number[]>>({});

  const [selectedSpaId, setSelectedSpaId] = useState<number | ''>('');
  const [toAdd, setToAdd] = useState<Set<number>>(new Set());
  const [toRemove, setToRemove] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('${API_BASE_URL}/api/sucursal')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSpas(data.data.filter((s: Branch) => s.spa_activo));
          } else {
            alert('Error al cargar sucursales');
          }
        })
        .catch(() => alert('Error de conexión al cargar sucursales'));

    fetch(`${API_BASE_URL}/api/tratamiento`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTreatments(data.data);
          } else {
            alert('Error al cargar tratamientos');
          }
        })
        .catch(() => alert('Error de conexión al cargar tratamientos'));
  }, []);

  const handleSpaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedSpaId(id || '');
    setToAdd(new Set());
    setToRemove(new Set());

    if (id) {
      fetch(`\`\`/api/sucursalxtratamiento/${id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              const associatedIds = data.data.map((t: any) => t.id_tratamiento);
              setAssocMap(prev => ({ ...prev, [id]: associatedIds }));
            } else {
              setAssocMap(prev => ({ ...prev, [id]: [] }));
            }
          })
          .catch(() => alert('Error al cargar tratamientos asociados'));
    }
  };

  const handleAdd = async () => {
    if (selectedSpaId === '') return;
    const newAssoc = [...toAdd];

    for (const idTratamiento of newAssoc) {
      try {
        const res = await fetch(`/api/sucursalxtratamiento/${selectedSpaId}/${idTratamiento}`, {
          method: 'POST'
        });
        const data = await res.json();
        if (!data.success) alert(`Error al asociar: ${data.error}`);
      } catch {
        alert('Error de conexión al asociar tratamiento');
      }
    }

    handleSpaChange({ target: { value: selectedSpaId.toString() } } as any);
  };

  const handleRemove = async () => {
    if (selectedSpaId === '') return;
    const toRemoveList = [...toRemove];

    for (const idTratamiento of toRemoveList) {
      try {
        const res = await fetch(`/api/sucursalxtratamiento/${selectedSpaId}/${idTratamiento}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (!data.success) alert(`Error al desasociar: ${data.error}`);
      } catch {
        alert('Error de conexión al desasociar tratamiento');
      }
    }

    handleSpaChange({ target: { value: selectedSpaId.toString() } } as any);
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
          <i className="fas fa-spa"></i> Asociación de Tratamientos al Spa
        </h2>
        <p className={styles.subHeader}>
          Seleccione una sucursal con Spa y administre sus tratamientos.
        </p>
        <div className={styles.sectionContainer}>
          <div className="mb-4">
            <label className="form-label"><strong>Sucursal con Spa:</strong></label>
            <select
                className="form-select"
                value={selectedSpaId}
                onChange={handleSpaChange}
            >
              <option value="">-- Seleccione una sucursal --</option>
              {spas.map(s => (
                  <option key={s.id_sucursal} value={s.id_sucursal}>{s.nombre_sucursal}</option>
              ))}
            </select>
          </div>

          {selectedSpaId !== '' && (
              <div className="row">
                <div className="col-md-5">
                  <h5>Tratamientos No Asociados</h5>
                  <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {available.map(t => (
                        <li key={t.id_tratamiento} className="list-group-item">
                          <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={toAdd.has(t.id_tratamiento)}
                              onChange={() => {
                                const s = new Set(toAdd);
                                s.has(t.id_tratamiento) ? s.delete(t.id_tratamiento) : s.add(t.id_tratamiento);
                                setToAdd(s);
                              }}
                          />
                          {t.nombre_tratamiento}
                        </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" disabled={toAdd.size === 0} onClick={handleAdd}>
                    <i className="fas fa-plus"></i> Asociar
                  </button>
                </div>

                <div className="col-md-5 offset-md-2">
                  <h5>Tratamientos Asociados</h5>
                  <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {associated.map(t => (
                        <li key={t.id_tratamiento} className="list-group-item">
                          <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={toRemove.has(t.id_tratamiento)}
                              onChange={() => {
                                const s = new Set(toRemove);
                                s.has(t.id_tratamiento) ? s.delete(t.id_tratamiento) : s.add(t.id_tratamiento);
                                setToRemove(s);
                              }}
                          />
                          {t.nombre_tratamiento}
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
