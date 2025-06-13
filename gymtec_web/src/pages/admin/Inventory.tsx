// src/pages/admin/Inventory.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface EquipmentType {
  id_tipo_equipo: number;
  nombre: string;
  descripcion: string;
  isDefault: boolean;
}

interface Branch {
  id: number;
  nombre: string;
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
  // Se obtienen router y logout desde el contexto
  const { logout } = useAuth();
  const router = useRouter();

  // Carga de tipos de equipo (por defecto + personalizados)
  const defaultTypes: EquipmentType[] = [
    { id_tipo_equipo: 1, nombre: 'Cinta de Correr',            descripcion: '', isDefault: true },
    { id_tipo_equipo: 2, nombre: 'Bicicleta Estacionaria',     descripcion: '', isDefault: true },
    { id_tipo_equipo: 3, nombre: 'Multigimnasio',              descripcion: '', isDefault: true },
    { id_tipo_equipo: 4, nombre: 'Remo',                       descripcion: '', isDefault: true },
    { id_tipo_equipo: 5, nombre: 'Pesas',                      descripcion: '', isDefault: true },
  ];
  const [customTypes, setCustomTypes] = useState<EquipmentType[]>([]);
  const equipmentTypes = [...defaultTypes, ...customTypes];

  // Carga de sucursales desde localStorage
  const [branches, setBranches] = useState<Branch[]>([]);

  // Estado de máquinas e interfaz CRUD
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [viewing, setViewing] = useState<Machine | null>(null);

  // Estado del formulario (sin id_maquina)
  const [form, setForm] = useState<Omit<Machine,'id_maquina'>>({
    id_tipo_equipo: defaultTypes[0].id_tipo_equipo,
    marca: '',
    num_serie: '',
    costo: 0,
    id_sucursal: null,
  });

  // Carga inicial de datos
  useEffect(() => {
    // Tipos personalizados
    const savedTypes = localStorage.getItem('gymtec_equipment_types');
    if (savedTypes) setCustomTypes(JSON.parse(savedTypes));

    // Sucursales
    const savedBranches = localStorage.getItem('gymtec_branches');
    if (savedBranches) {
      const b: any[] = JSON.parse(savedBranches);
      setBranches(b.map(x => ({ id: x.id, nombre: x.nombre || x.nombre_sucursal })));
    }

    // Máquinas guardadas
    const saved = localStorage.getItem('gymtec_machines');
    if (saved) setMachines(JSON.parse(saved));
  }, []);

  // Persiste máquinas en localStorage
  const persist = (list: Machine[]) => {
    localStorage.setItem('gymtec_machines', JSON.stringify(list));
  };

  // Maneja cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [id]:
        type === 'number' ? Number(value) :
        id === 'id_sucursal' && value === '' ? null :
        value,
    }) as any);
  };

  // Abre modal en modo creación
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

  // Abre modal en modo edición
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

  // Abre modal de solo lectura
  const openView = (m: Machine) => {
    setViewing(m);
  };

  // Elimina máquina
  const handleDelete = (id: number) => {
    if (!confirm('¿Confirma eliminación de esta máquina?')) return;
    const updated = machines.filter(m => m.id_maquina !== id);
    setMachines(updated);
    persist(updated);
  };

  // Guarda creación o edición
  const handleSave = () => {
    const { id_tipo_equipo, marca, num_serie, costo } = form;
    if (!marca.trim() || !num_serie.trim() || costo <= 0) {
      alert('Complete marca, número de serie y costo válido.');
      return;
    }
    if (editing) {
      const updated = machines.map(m =>
        m.id_maquina === editing.id_maquina
          ? ({ ...editing, ...form } as Machine)
          : m
      );
      setMachines(updated);
      persist(updated);
    } else {
      const newMachine: Machine = {
        id_maquina: Date.now(),
        ...form,
      };
      const updated = [newMachine, ...machines];
      setMachines(updated);
      persist(updated);
    }
    setShowModal(false);
  };

  // Cierra sesión
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

      {/* Contenido principal */}
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
                  {/* Tipo de equipo */}
                  <div className="mb-2">
                    <label className="form-label">Tipo de Equipo</label>
                    <select
                      id="id_tipo_equipo"
                      className="form-select"
                      value={form.id_tipo_equipo}
                      onChange={handleChange}
                    >
                      {equipmentTypes.map(t => (
                        <option key={t.id_tipo_equipo} value={t.id_tipo_equipo}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Marca */}
                  <div className="mb-2">
                    <label className="form-label">Marca</label>
                    <input
                      id="marca"
                      type="text"
                      className="form-control"
                      value={form.marca}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Número de serie */}
                  <div className="mb-2">
                    <label className="form-label">Número de Serie</label>
                    <input
                      id="num_serie"
                      type="text"
                      className="form-control"
                      value={form.num_serie}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Costo */}
                  <div className="mb-2">
                    <label className="form-label">Costo</label>
                    <input
                      id="costo"
                      type="number"
                      className="form-control"
                      min={0.01}
                      step="0.01"
                      value={form.costo}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Sucursal (puede quedar sin asignar) */}
                  <div className="mb-2">
                    <label className="form-label">Sucursal</label>
                    <select
                      id="id_sucursal"
                      className="form-select"
                      value={form.id_sucursal ?? ''}
                      onChange={handleChange}
                    >
                      <option value="">No asignada</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    <i className="fas fa-times"></i> Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    <i className="fas fa-save"></i> Guardar
                  </button>
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
                  <p><strong>ID Máquina:</strong> {viewing.id_maquina}</p>
                  <p><strong>Tipo:</strong> {
                    equipmentTypes.find(t => t.id_tipo_equipo === viewing.id_tipo_equipo)?.nombre
                  }</p>
                  <p><strong>Marca:</strong> {viewing.marca}</p>
                  <p><strong>Serie:</strong> {viewing.num_serie}</p>
                  <p><strong>Costo:</strong> {viewing.costo}</p>
                  <p><strong>Sucursal:</strong> {
                    viewing.id_sucursal
                      ? branches.find(b => b.id === viewing.id_sucursal)?.nombre
                      : 'No asignada'
                  }</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewing(null)}
                  >
                    <i className="fas fa-times"></i> Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de inventario */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID Máquina</th>
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
                  <td>{
                    m.id_sucursal
                      ? branches.find(b => b.id === m.id_sucursal)?.nombre
                      : '—'
                  }</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => openView(m)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(m)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(m.id_maquina)}
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
 