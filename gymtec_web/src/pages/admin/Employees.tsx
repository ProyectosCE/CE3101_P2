// src/pages/admin/Employees.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_BASE_URL } from '@/stores/api';

interface Position { id_puesto: number; descripcion: string; isDefault: boolean; }
interface Branch { id: number; nombre: string; }
interface Payroll { id_planilla: number; descripcion: string; }
interface Employee {
  id_empleado: number;
  cedula: string;
  nombres: string;
  apellidos: string
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
  const { logout } = useAuth();
  const router = useRouter();

  const [positions, setPositions] = useState<Position[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);

  const [form, setForm] = useState<Omit<Employee, 'id_empleado'>>({
    cedula: '', nombres: '', apellidos:'', provincia: '', canton: '', distrito: '',
    id_puesto: 0,
    id_sucursal: 0, id_planilla: 0,
    salario: 0, correo: '', password: '', clases_horas: 0
  });

  useEffect(() => {
    // cargar sucursales
    fetch(`${API_BASE_URL}/api/sucursal`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const b: Branch[] = data.data.map((s: any) => ({
            id: s.id_sucursal, nombre: s.nombre_sucursal
          }));
          setBranches(b);
          setForm(prev => ({ ...prev, id_sucursal: b[0]?.id || 0 }));
        } else alert('Error al cargar sucursales');
      }).catch(() => alert('Error servidor sucursales'));

    // cargar puestos
    fetch(`${API_BASE_URL}/api/puesto`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPositions(data.data);
          setForm(prev => ({ ...prev, id_puesto: data.data[0]?.id_puesto || 0 }));
        } else alert('Error al cargar puestos');
      }).catch(() => alert('Error servidor puestos'));

    // cargar planillas
    fetch(`${API_BASE_URL}/api/planilla`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPayrolls(data.data);
          setForm(prev => ({ ...prev, id_planilla: data.data[0]?.id_planilla || 0 }));
        } else alert('Error al cargar planillas');
      }).catch(() => alert('Error servidor planillas'));

    // cargar empleados
    fetch(`${API_BASE_URL}/api/empleado`)
      .then(res => {
        if (res.status === 401) throw new Error('No autorizado');
        return res.json();
      })
      .then(data => {
        if (data.success) setEmployees(data.data);
        else alert('Error lista empleados');
      })
      .catch(err => {
        if (err.message === 'No autorizado') {
          alert('No autorizado');
          logout(); router.push('/login');
        } else alert('Error servidor empleados');
      });
  }, []);

  const handleLogout = () => { logout(); router.push('/login'); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value
    }) as any);
  };

  const openCreate = () => {
    setIsEditing(false); setEditingId(null);
    setForm({
      cedula: '', nombres: '', apellidos:'', provincia: '', canton: '', distrito: '',
      id_puesto: positions[0]?.id_puesto || 0,
      id_sucursal: branches[0]?.id || 0,
      id_planilla: payrolls[0]?.id_planilla || 0,
      salario: 0, correo: '', password: '', clases_horas: 0
    });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setIsEditing(true);
    setEditingId(emp.id_empleado);
    setForm({ ...emp });
    setShowModal(true);
  };

  const openView = (emp: Employee) => setViewing(emp);

  const deleteEmployee = async (id: number) => {
    if (!confirm('¿Eliminar este empleado?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/empleado/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.status === 200) {
        setEmployees(employees.filter(e => e.id_empleado !== id));
        alert('Empleado eliminado');
      } else if (res.status === 404) alert(data.error || 'Empleado no existe');
      else if (res.status === 500) alert('Error en servidor');
    } catch {
      alert('Error servidor');
    }
  };

  const saveEmployee = async () => {
    const mandatory = form.cedula && form.nombres && form.apellidos && form.provincia;
    if (!mandatory) return alert('Cédula, nombre y provincia son requeridos');
    try {
      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing
          ? `${API_BASE_URL}/api/empleado/${editingId}`
          : `${API_BASE_URL}/api/empleado`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.status === 200) {
        alert(data.mensaje || 'Operación exitosa');
        // refrescar lista
        const listRes = await fetch('/api/empleado');
        const listData = await listRes.json();
        if (listRes.ok && listData.success) setEmployees(listData.data);
        setShowModal(false);
      } else if (res.status === 400) alert(data.error || 'Solicitud inválida');
      else if (res.status === 404) alert(data.error || 'No encontrado');
      else if (res.status === 500) alert('Error servidor');
    } catch {
      alert('Error conexión servidor');
    }
  };

  return (
      <div className={styles.pageContainer}>
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

          {showModal &&
            <div
              className="modal fade show"
              tabIndex={-1}
              style={{
                display: 'block',
                background: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 1050
              }}
              aria-modal="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">{isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}</h4>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
                  </div>
                  <form onSubmit={e => { e.preventDefault(); saveEmployee(); }}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Cédula</label>
                          <input id="cedula" className="form-control" value={form.cedula} onChange={handleChange} required />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Nombres</label>
                          <input id="nombres" className="form-control" value={form.nombres} onChange={handleChange} required />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Apellidos</label>
                          <input id="apellidos" className="form-control" value={form.apellidos} onChange={handleChange} required />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Provincia</label>
                          <input id="provincia" className="form-control" value={form.provincia} onChange={handleChange} required />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Cantón</label>
                          <input id="canton" className="form-control" value={form.canton} onChange={handleChange} />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Distrito</label>
                          <input id="distrito" className="form-control" value={form.distrito} onChange={handleChange} />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Puesto</label>
                          <select id="id_puesto" className="form-select" value={form.id_puesto} onChange={handleChange}>
                            {positions.map(p => (
                              <option key={p.id_puesto} value={p.id_puesto}>{p.descripcion}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Sucursal</label>
                          <select id="id_sucursal" className="form-select" value={form.id_sucursal} onChange={handleChange}>
                            {branches.map(b => (
                              <option key={b.id} value={b.id}>{b.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Planilla</label>
                          <select id="id_planilla" className="form-select" value={form.id_planilla} onChange={handleChange}>
                            {payrolls.map(pl => (
                              <option key={pl.id_planilla} value={pl.id_planilla}>{pl.descripcion}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Salario</label>
                          <input id="salario" type="number" className="form-control" value={form.salario} onChange={handleChange} />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Correo</label>
                          <input id="correo" className="form-control" value={form.correo} onChange={handleChange} />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Contraseña</label>
                          <input id="password" type="password" className="form-control" value={form.password} onChange={handleChange} />
                        </div>
                        <div className="mb-2 col-12 col-md-6">
                          <label className="form-label">Clases/Horas</label>
                          <input id="clases_horas" type="number" className="form-control" value={form.clases_horas} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                      <button type="submit" className="btn btn-primary">{isEditing ? 'Guardar Cambios' : 'Crear'}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          }

          {viewing &&
              /* Modal Vista similar al original, omitiendo por brevedad */
              /* ... */
              null
          }

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
              <tr>
               <th>Cédula</th>
               <th>Nombres</th>
               <th>Apellidos</th>
               <th>Puesto</th>
               <th>Sucursal</th>
               <th>Planilla</th>
               <th>Salario</th>
               <th>Clases/Horas</th>
               <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              {employees.map(emp => (
                  <tr key={emp.id_empleado}>
                    <td>{emp.cedula}</td>
                    <td>{emp.nombres}</td>
                    <td>{emp.apellidos}</td>
                    <td>{positions.find(p => p.id_puesto === emp.id_puesto)?.descripcion}</td>
                    <td>{branches.find(b => b.id === emp.id_sucursal)?.nombre}</td>
                    <td>{payrolls.find(pl => pl.id_planilla === emp.id_planilla)?.descripcion}</td>
                    <td>{emp.salario}</td>
                    <td>{emp.clases_horas}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => openView(emp)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(emp)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteEmployee(emp.id_empleado)}>
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
