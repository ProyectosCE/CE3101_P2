import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_URL } from '@/stores/api';

interface Branch {
  id_sucursal: number;
  nombre_sucursal: string;
}

interface Machine {
  id_maquina: number;
  id_tipo_equipo: number;
  marca: string;
  num_serie: string;
  costo: number;
  id_sucursal: number | null;
}

export default function InventoryAssignment() {
  const { logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | ''>('');
  const [toAdd, setToAdd] = useState<Set<number>>(new Set());
  const [toRemove, setToRemove] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bRes, mRes] = await Promise.all([
          fetch(`${API_URL}/api/sucursal`),
          fetch(`${API_URL}/api/maquina`)
        ]);

        if (!bRes.ok) throw new Error(`Error ${bRes.status} al cargar sucursales`);
        if (!mRes.ok) throw new Error(`Error ${mRes.status} al cargar máquinas`);

        const bJson = await bRes.json();
        const mJson = await mRes.json();

        if (bJson.success) setBranches(bJson.data);
        if (mJson.success) setMachines(mJson.data);
      } catch (err: any) {
        console.error(err);
        alert(err.message);
      }
    };

    fetchAll();
  }, []);

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranchId(e.target.value ? Number(e.target.value) : '');
    setToAdd(new Set());
    setToRemove(new Set());
  };

  const assignedIds = machines
      .filter(m => typeof selectedBranchId === 'number' && m.id_sucursal === selectedBranchId)
      .map(m => m.id_maquina);

  const available = machines.filter(m => !assignedIds.includes(m.id_maquina));

  const handleAssign = async () => {
    if (selectedBranchId === '') return;
    await updateMany(Array.from(toAdd), selectedBranchId);
    setToAdd(new Set());
  };

  const handleUnassign = async () => {
    if (selectedBranchId === '') return;
    await updateMany(Array.from(toRemove), null);
    setToRemove(new Set());
  };

  const updateMany = async (ids: number[], branchId: number | null) => {
    try {
      const updated = await Promise.all(ids.map(async id => {
        const res = await fetch(`${API_URL}/api/maquina/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_sucursal: branchId }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || `Error ${res.status}`);
        return id;
      }));

      setMachines(prev => prev.map(m =>
          updated.includes(m.id_maquina) ? { ...m, id_sucursal: branchId } : m
      ));
    } catch (err: any) {
      console.error(err);
      alert(`Error al actualizar: ${err.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
          <i className="fas fa-warehouse"></i> Asociación de Inventario
        </h2>
        <p className={styles.subHeader}>
          Seleccione una sucursal y asigne o desasigne máquinas.
        </p>

        <div className={styles.sectionContainer}>
          <div className="mb-4">
            <label className="form-label"><strong>Sucursal:</strong></label>
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
                  <h5>Máquinas No Asignadas</h5>
                  <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {available.map(m => (
                        <li key={m.id_maquina} className="list-group-item">
                          <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={toAdd.has(m.id_maquina)}
                              onChange={() => {
                                const s = new Set(toAdd);
                                s.has(m.id_maquina) ? s.delete(m.id_maquina) : s.add(m.id_maquina);
                                setToAdd(s);
                              }}
                          />
                          {m.marca} — S/N: {m.num_serie}
                        </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" disabled={toAdd.size === 0} onClick={handleAssign}>
                    <i className="fas fa-plus"></i> Asignar
                  </button>
                </div>

                <div className="col-md-5 offset-md-2">
                  <h5>Máquinas Asignadas</h5>
                  <ul className="list-group mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {machines
                        .filter(m => m.id_sucursal === selectedBranchId)
                        .map(m => (
                            <li key={m.id_maquina} className="list-group-item">
                              <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  checked={toRemove.has(m.id_maquina)}
                                  onChange={() => {
                                    const s = new Set(toRemove);
                                    s.has(m.id_maquina) ? s.delete(m.id_maquina) : s.add(m.id_maquina);
                                    setToRemove(s);
                                  }}
                              />
                              {m.marca} — S/N: {m.num_serie}
                            </li>
                        ))}
                  </ul>
                  <button className="btn btn-danger" disabled={toRemove.size === 0} onClick={handleUnassign}>
                    <i className="fas fa-minus"></i> Desasignar
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
