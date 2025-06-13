// src/pages/admin/Employees.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Position {
  id_puesto: number;
  descripcion: string;
  isDefault: boolean;
}
interface Branch {
  id: number;
  nombre: string;
}
interface Payroll {
  id_planilla: number;
  descripcion: string;
}
interface Employee {
  id_empleado: number;
  cedula: string;
  nombre_completo: string;
  provincia: string;
  canton: string;
  distrito: string;
  id_puesto: number;
  id_sucursal: number;
  id_planilla: number;
  salario: number;
  correo: string;
  password: string;
  clases_horas: number;
}

export default function Employees() {
  // Se obtienen logout y router
  const { logout } = useAuth();
  const router = useRouter();

  // Listas de referencia
  const [customPositions, setCustomPositions] = useState<Position[]>([]);
  const defaultPositions: Position[] = [
    { id_puesto: 1, descripcion: 'Administrador',    isDefault: true },
    { id_puesto: 2, descripcion: 'Instructor',      isDefault: true },
    { id_puesto: 3, descripcion: 'Dependiente Spa', isDefault: true },
    { id_puesto: 4, descripcion: 'Dependiente Tienda', isDefault: true },
  ];
  const positions = [...defaultPositions, ...customPositions];

  const [branches, setBranches] = useState<Branch[]>([]);
  const payrolls: Payroll[] = [
    { id_planilla: 1, descripcion: 'Pago Mensual'     },
    { id_planilla: 2, descripcion: 'Pago por Horas'   },
    { id_planilla: 3, descripcion: 'Pago por Clase'   },
  ];

  // Estado de empleados
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);

  // Formulario
  const [form, setForm] = useState<Omit<Employee,'id_empleado'>>({
    cedula: '',
    nombre_completo: '',
    provincia: '',
    canton: '',
    distrito: '',
    id_puesto: defaultPositions[0].id_puesto,
    id_sucursal: 0,
    id_planilla: payrolls[0].id_planilla,
    salario: 0,
    correo: '',
    password: '',
    clases_horas: 0,
  });

  // Carga inicial de sucursales, puestos y empleados
  useEffect(() => {
    const savedBranches = localStorage.getItem('gymtec_branches');
    if (savedBranches) {
      const b: Branch[] = JSON.parse(savedBranches).map((x: any) => ({
        id: x.id,
        nombre: x.nombre_sucursal || x.nombre,
      }));
      setBranches(b);
      setForm(prev => ({ ...prev, id_sucursal: b[0]?.id || 0 }));
    }
    const savedPos = localStorage.getItem('gymtec_positions');
    if (savedPos) setCustomPositions(JSON.parse(savedPos));
    const savedEmp = localStorage.getItem('gymtec_empleados');
    if (savedEmp) setEmployees(JSON.parse(savedEmp));
  }, []);

  // Maneja cambio de input/select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value,
    }) as any);
  };

  // Abre modal crear
  const openCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm(prev => ({
      ...prev,
      id_puesto: positions[0].id_puesto,
      id_sucursal: branches[0]?.id || 0,
      id_planilla: payrolls[0].id_planilla,
      salario: 0,
      clases_horas: 0,
      cedula: '',
      nombre_completo: '',
      provincia: '', canton: '', distrito: '',
      correo: '', password: ''
    }));
    setShowModal(true);
  };

  // Abre modal editar
  const openEdit = (emp: Employee) => {
    setIsEditing(true);
    setEditingId(emp.id_empleado);
    setForm({ ...emp });
    setShowModal(true);
  };

  // Abre modal ver
  const openView = (emp: Employee) => {
    setViewing(emp);
  };

  // Elimina empleado
  const handleDelete = (id: number) => {
    if (!confirm('¿Eliminar este empleado?')) return;
    const updated = employees.filter(e => e.id_empleado !== id);
    setEmployees(updated);
    localStorage.setItem('gymtec_empleados', JSON.stringify(updated));
  };

  // Guarda nuevo o actualizado
  const handleSave = () => {
    const { cedula, nombre_completo, provincia } = form;
    if (!cedula || !nombre_completo || !provincia) {
      alert('Complete cédula, nombre y provincia.');
      return;
    }
    if (isEditing && editingId != null) {
      const updated = employees.map(e =>
        e.id_empleado === editingId ? ({ id_empleado: editingId, ...form }) as Employee : e
      );
      setEmployees(updated);
      localStorage.setItem('gymtec_empleados', JSON.stringify(updated));
    } else {
      const newId = Date.now();
      const emp = { id_empleado: newId, ...form } as Employee;
      const updated = [emp, ...employees];
      setEmployees(updated);
      localStorage.setItem('gymtec_empleados', JSON.stringify(updated));
    }
    setShowModal(false);
  };

  // Cerrar sesión
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

      <div className={styles.contentCard}>
        <h3><i className="fas fa-user-tie"></i> Gestión de Empleados</h3>
        <button className="btn btn-primary mb-3" onClick={openCreate}>
          <i className="fas fa-plus"></i> Nuevo Empleado
        </button>

        {/* Modal crear/editar */}
        {showModal && (
          <div className="modal d-block" style={{ background:'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={isEditing ? 'fas fa-edit' : 'fas fa-plus'}></i>{' '}
                    {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
                  </h5>
                  <button className="btn-close" onClick={()=>setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {/* Cédula */}
                  <div className="mb-2">
                    <label className="form-label">Cédula</label>
                    <input
                      id="cedula"
                      type="text"
                      className="form-control"
                      value={form.cedula}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Nombre completo */}
                  <div className="mb-2">
                    <label className="form-label">Nombre Completo</label>
                    <input
                      id="nombre_completo"
                      type="text"
                      className="form-control"
                      value={form.nombre_completo}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Dirección */}
                  <div className="row g-2 mb-2">
                    <div className="col">
                      <input
                        id="provincia"
                        className="form-control"
                        placeholder="Provincia"
                        value={form.provincia}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        id="canton"
                        className="form-control"
                        placeholder="Cantón"
                        value={form.canton}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        id="distrito"
                        className="form-control"
                        placeholder="Distrito"
                        value={form.distrito}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Puesto */}
                  <div className="mb-2">
                    <label className="form-label">Puesto</label>
                    <select
                      id="id_puesto"
                      className="form-select"
                      value={form.id_puesto}
                      onChange={handleChange}
                    >
                      {positions.map(p => (
                        <option key={p.id_puesto} value={p.id_puesto}>
                          {p.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Sucursal */}
                  <div className="mb-2">
                    <label className="form-label">Sucursal</label>
                    <select
                      id="id_sucursal"
                      className="form-select"
                      value={form.id_sucursal}
                      onChange={handleChange}
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Planilla */}
                  <div className="mb-2">
                    <label className="form-label">Tipo Planilla</label>
                    <select
                      id="id_planilla"
                      className="form-select"
                      value={form.id_planilla}
                      onChange={handleChange}
                    >
                      {payrolls.map(pl => (
                        <option key={pl.id_planilla} value={pl.id_planilla}>
                          {pl.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Salario */}
                  <div className="mb-2">
                    <label className="form-label">Salario</label>
                    <input
                      id="salario"
                      type="number"
                      className="form-control"
                      value={form.salario}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Correo */}
                  <div className="mb-2">
                    <label className="form-label">Correo</label>
                    <input
                      id="correo"
                      type="email"
                      className="form-control"
                      value={form.correo}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Contraseña */}
                  <div className="mb-2">
                    <label className="form-label">Contraseña</label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Clases/Horas */}
                  <div className="mb-2">
                    <label className="form-label">Clases/Horas</label>
                    <input
                      id="clases_horas"
                      type="number"
                      className="form-control"
                      value={form.clases_horas}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>
                    <i className="fas fa-times"></i> Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fas fa-save"></i> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal ver empleado */}
        {viewing && (
          <div className="modal d-block" style={{ background:'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="fas fa-eye"></i> Detalle Empleado</h5>
                  <button className="btn-close" onClick={()=>setViewing(null)} />
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewing.id_empleado}</p>
                  <p><strong>Cédula:</strong> {viewing.cedula}</p>
                  <p><strong>Nombre:</strong> {viewing.nombre_completo}</p>
                  <p><strong>Dirección:</strong> {`${viewing.provincia}, ${viewing.canton}, ${viewing.distrito}`}</p>
                  <p><strong>Puesto:</strong> {positions.find(p=>p.id_puesto===viewing.id_puesto)?.descripcion}</p>
                  <p><strong>Sucursal:</strong> {branches.find(b=>b.id===viewing.id_sucursal)?.nombre}</p>
                  <p><strong>Planilla:</strong> {payrolls.find(pl=>pl.id_planilla===viewing.id_planilla)?.descripcion}</p>
                  <p><strong>Salario:</strong> {viewing.salario}</p>
                  <p><strong>Clases/Horas:</strong> {viewing.clases_horas}</p>
                  <p><strong>Correo:</strong> {viewing.correo}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={()=>setViewing(null)}>
                    <i className="fas fa-times"></i> Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de empleados */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th><th>Cédula</th><th>Nombre</th><th>Puesto</th>
                <th>Sucursal</th><th>Planilla</th><th>Salario</th><th>Clases/Horas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp=>(
                <tr key={emp.id_empleado}>
                  <td>{emp.id_empleado}</td>
                  <td>{emp.cedula}</td>
                  <td>{emp.nombre_completo}</td>
                  <td>{positions.find(p=>p.id_puesto===emp.id_puesto)?.descripcion}</td>
                  <td>{branches.find(b=>b.id===emp.id_sucursal)?.nombre}</td>
                  <td>{payrolls.find(pl=>pl.id_planilla===emp.id_planilla)?.descripcion}</td>
                  <td>{emp.salario}</td>
                  <td>{emp.clases_horas}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-info me-2" onClick={()=>openView(emp)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>openEdit(emp)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(emp.id_empleado)}>
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
