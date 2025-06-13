// src/pages/admin/InventoryAssignment.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Branch {
  id: number;
  nombre: string;
}

interface Machine {
  id_maquina: number;
  tipo: string;
  marca: string;
  num_serie: string;
}

export default function InventoryAssignment() {
  // Obtiene logout y navegación
  const { logout } = useAuth();
  const router = useRouter();

  // Sucursales y máquinas de ejemplo
  const [branches, setBranches] = useState<Branch[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);

  // Mapa de asociaciones { branchId: [machineId,…] }
  const [assocMap, setAssocMap] = useState<Record<number, number[]>>({});

  // UI state
  const [selectedBranchId, setSelectedBranchId] = useState<number | ''>('');
  const [toAdd, setToAdd] = useState<Set<number>>(new Set());
  const [toRemove, setToRemove] = useState<Set<number>>(new Set());

  // Carga inicial (simulación de API)
  useEffect(() => {
    setBranches([
      { id: 1, nombre: 'Central Cartago' },
      { id: 2, nombre: 'San Carlos' },
      { id: 3, nombre: 'Local San José' },
      { id: 4, nombre: 'Alajuela' },
      { id: 5, nombre: 'Limón' },
    ]);

    setMachines([
      { id_maquina: 1, tipo: 'Cinta de correr', marca: 'FitBrand', num_serie: 'A123' },
      { id_maquina: 2, tipo: 'Bicicleta estacionaria', marca: 'CyclePro', num_serie: 'B456' },
      { id_maquina: 3, tipo: 'Multigimnasio', marca: 'PowerMax', num_serie: 'C789' },
      { id_maquina: 4, tipo: 'Remo', marca: 'RowMaster', num_serie: 'D012' },
      { id_maquina: 5, tipo: 'Pesas libres', marca: 'IronFlex', num_serie: 'E345' },
    ]);

    // Sin asociaciones al inicio
    setAssocMap({});
  }, []);

  // Maneja cambio de sucursal
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedBranchId(id || '');
    setToAdd(new Set());
    setToRemove(new Set());
  };

  // Asocia máquinas a la sucursal
  const handleAdd = () => {
    if (selectedBranchId === '') return;
    const current = new Set(assocMap[selectedBranchId] || []);
    toAdd.forEach(id => current.add(id));
    setAssocMap({ ...assocMap, [selectedBranchId]: Array.from(current) });
    setToAdd(new Set());
  };

  // Desasocia máquinas de la sucursal
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

  // Listas derivadas
  const assignedIds = Object.values(assocMap).flat();
  const associated = selectedBranchId === ''
    ? []
    : (assocMap[selectedBranchId] || [])
        .map(id => machines.find(m => m.id_maquina === id)!)
        .filter(Boolean);
  const available = machines
    .filter(m => !assignedIds.includes(m.id_maquina));

  return (
    <div className={styles.pageContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>

      {/* Botón Configuración */}
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
        <i className="fas fa-warehouse"></i> Asociación de Inventario
      </h2>
      <p className={styles.subHeader}>
        Seleccione una sucursal y asigne o desasigne máquinas.
      </p>

      {/* Contenedor de sección */}
      <div className={styles.sectionContainer}>
        {/* Selector de sucursal */}
        <div className="mb-4">
          <label className="form-label"><strong>Sucursal:</strong></label>
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
            {/* Máquinas No Asignadas */}
            <div className="col-md-5">
              <h5>Máquinas No Asignadas</h5>
              <ul
                className="list-group mb-2"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {available.map(m => (
                  <li key={m.id_maquina} className="list-group-item">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={toAdd.has(m.id_maquina)}
                      onChange={() => {
                        const s = new Set(toAdd);
                        s.has(m.id_maquina)
                          ? s.delete(m.id_maquina)
                          : s.add(m.id_maquina);
                        setToAdd(s);
                      }}
                    />
                    {m.tipo} — {m.marca} (S/N: {m.num_serie})
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary"
                disabled={toAdd.size === 0}
                onClick={handleAdd}
              >
                <i className="fas fa-plus"></i> Asignar
              </button>
            </div>

            {/* Máquinas Asignadas */}
            <div className="col-md-5 offset-md-2">
              <h5>Máquinas Asignadas</h5>
              <ul
                className="list-group mb-2"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {associated.map(m => (
                  <li key={m.id_maquina} className="list-group-item">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={toRemove.has(m.id_maquina)}
                      onChange={() => {
                        const s = new Set(toRemove);
                        s.has(m.id_maquina)
                          ? s.delete(m.id_maquina)
                          : s.add(m.id_maquina);
                        setToRemove(s);
                      }}
                    />
                    {m.tipo} — {m.marca} (S/N: {m.num_serie})
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-danger"
                disabled={toRemove.size === 0}
                onClick={handleRemove}
              >
                <i className="fas fa-minus"></i> Desasignar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
