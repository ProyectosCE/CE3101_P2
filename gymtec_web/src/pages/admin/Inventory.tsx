import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_URL } from '@/stores/api';

interface EquipmentType {
  id_tipo_equipo: number;
  nombre: string;
  descripcion: string;
}

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

export default function Inventory() {
  const { logout } = useAuth();
  const router = useRouter();

  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [viewing, setViewing] = useState<Machine | null>(null);
  const [form, setForm] = useState<Omit<Machine, 'id_maquina'>>({
    id_tipo_equipo: 0,
    marca: '',
    num_serie: '',
    costo: 0,
    id_sucursal: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeRes, branchRes, machineRes] = await Promise.all([
          fetch(`${API_URL}/api/tipoequipo`),
          fetch(`${API_URL}/api/sucursal`),
          fetch(`${API_URL}/api/maquina`),
        ]);

        if (!typeRes.ok) throw new Error(`Error ${typeRes.status}`);
        if (!branchRes.ok) throw new Error(`Error ${branchRes.status}`);
        if (!machineRes.ok) throw new Error(`Error ${machineRes.status}`);

        const typeData = await typeRes.json();
        const branchData = await branchRes.json();
        const machineData = await machineRes.json();

        if (typeData.success) setEquipmentTypes(typeData.data);
        if (branchData.success) setBranches(branchData.data);
        if (machineData.success) setMachines(machineData.data);
      } catch (error: any) {
        console.error('Error al cargar datos:', error.message);
        alert(`Error al cargar datos: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : (id === 'id_sucursal' && value === '' ? null : value),
    }) as any);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      id_tipo_equipo: equipmentTypes[0]?.id_tipo_equipo || 0,
      marca: '',
      num_serie: '',
      costo: 0,
      id_sucursal: null,
    });
    setShowModal(true);
  };

  const openEdit = (m: Machine) => {
    setEditing(m);
    setForm({
      id_tipo_equipo: m.id_tipo_equipo,
      marca: m.marca,
      num_serie: m.num_serie,
      costo: m.costo,
      id_sucursal: m.id_sucursal,
    });
    setShowModal(true);
  };

  const openView = (m: Machine) => {
    setViewing(m);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Confirma eliminación de esta máquina?')) return;
    try {
      const res = await fetch(`${API_URL}/api/maquina/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al eliminar');

      setMachines(machines.filter(m => m.id_maquina !== id));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSave = async () => {
    const { id_tipo_equipo, marca, num_serie, costo, id_sucursal } = form;
    if (!marca.trim() || !num_serie.trim() || costo <= 0) {
      alert('Complete marca, número de serie y costo válido.');
      return;
    }

    try {
      const endpoint = editing
          ? `${API_URL}/api/maquina/${editing.id_maquina}`
          : `${API_URL}/api/maquina`;
      const method = editing ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al guardar');

      if (editing) {
        setMachines(machines.map(m => (m.id_maquina === editing.id_maquina ? { ...m, ...form } : m)));
      } else {
        setMachines([data.data, ...machines]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
      <div className={styles.pageContainer}>
        {/* Logo y navegación */}
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
        </div>
        <button className={styles.homeButton} onClick={() => router.push('/admin/Dashboard')}>
          <i className="fas fa-home"></i> Inicio
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>

        {/* Contenido */}
        <div className={styles.contentCard}>
          <h3><i className="fas fa-boxes"></i> Gestión de Inventario</h3>
          <button className="btn btn-primary mb-3" onClick={openCreate}>
            <i className="fas fa-plus"></i> Nueva Máquina
          </button>

          {/* Modal Crear/Editar */}
          {showModal && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <i className={editing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                        {editing ? 'Editar Máquina' : 'Nueva Máquina'}
                      </h5>
                      <button className="btn-close" onClick={() => setShowModal(false)} />
                    </div>
                    <div className="modal-body">
                      <div className="mb-2">
                        <label className="form-label">Tipo de Equipo</label>
                        <select id="id_tipo_equipo" className="form-select" value={form.id_tipo_equipo} onChange={handleChange}>
                          {equipmentTypes.map(t => (
                              <option key={t.id_tipo_equipo} value={t.id_tipo_equipo}>{t.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Marca</label>
                        <input id="marca" type="text" className="form-control" value={form.marca} onChange={handleChange} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Número de Serie</label>
                        <input id="num_serie" type="text" className="form-control" value={form.num_serie} onChange={handleChange} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Costo</label>
                        <input id="costo" type="number" className="form-control" min={0.01} step="0.01" value={form.costo} onChange={handleChange} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Sucursal</label>
                        <select id="id_sucursal" className="form-select" value={form.id_sucursal ?? ''} onChange={handleChange}>
                          <option value="">No asignada</option>
                          {branches.map(b => (
                              <option key={b.id_sucursal} value={b.id_sucursal}>{b.nombre_sucursal}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowModal(false)}><i className="fas fa-times"></i> Cancelar</button>
                      <button className="btn btn-primary" onClick={handleSave}><i className="fas fa-save"></i> Guardar</button>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Modal Ver */}
          {viewing && (
              <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title"><i className="fas fa-eye"></i> Detalle Máquina</h5>
                      <button className="btn-close" onClick={() => setViewing(null)} />
                    </div>
                    <div className="modal-body">
                      <p><strong>ID:</strong> {viewing.id_maquina}</p>
                      <p><strong>Tipo:</strong> {equipmentTypes.find(t => t.id_tipo_equipo === viewing.id_tipo_equipo)?.nombre}</p>
                      <p><strong>Marca:</strong> {viewing.marca}</p>
                      <p><strong>Serie:</strong> {viewing.num_serie}</p>
                      <p><strong>Costo:</strong> {viewing.costo}</p>
                      <p><strong>Sucursal:</strong> {viewing.id_sucursal
                          ? branches.find(b => b.id_sucursal === viewing.id_sucursal)?.nombre_sucursal
                          : 'No asignada'}</p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setViewing(null)}><i className="fas fa-times"></i> Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Tabla de máquinas */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Serie</th>
                <th>Costo</th>
                <th>Sucursal</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              {machines.map(m => (
                  <tr key={m.id_maquina}>
                    <td>{m.id_maquina}</td>
                    <td>{equipmentTypes.find(t => t.id_tipo_equipo === m.id_tipo_equipo)?.nombre}</td>
                    <td>{m.marca}</td>
                    <td>{m.num_serie}</td>
                    <td>{m.costo}</td>
                    <td>{m.id_sucursal
                        ? branches.find(b => b.id_sucursal === m.id_sucursal)?.nombre_sucursal
                        : '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => openView(m)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(m)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id_maquina)}>
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
