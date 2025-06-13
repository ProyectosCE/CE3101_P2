// src/pages/admin/PayrollGeneration.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';

interface Branch {
  id: number;
  nombre: string;
}

interface Employee {
  id_empleado: number;
  cedula: string;
  nombre_completo: string;
  tipo_planilla: 'Pago Mensual' | 'Pago por Horas' | 'Pago por Clase';
  salario: number;
}

interface PayRecord {
  cedula: string;
  nombre: string;
  tipo: string;
  cantidad: number | '-';
  monto: number;
}

export default function PayrollGeneration() {
  const { logout } = useAuth();
  const router = useRouter();

  // Datos de ejemplo (luego vendrán del API)
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | ''>('');
  const [records, setRecords] = useState<PayRecord[]>([]);

  useEffect(() => {
    setBranches([
      { id: 1, nombre: 'Central Cartago' },
      { id: 2, nombre: 'San Carlos' },
      { id: 3, nombre: 'Local San José' },
      { id: 4, nombre: 'Alajuela' },
      { id: 5, nombre: 'Limón' },
    ]);
    setEmployees([
      { id_empleado: 101, cedula: '101010101', nombre_completo: 'Ana Gómez', tipo_planilla: 'Pago Mensual', salario: 800000 },
      { id_empleado: 102, cedula: '202020202', nombre_completo: 'Luis Rodríguez', tipo_planilla: 'Pago por Horas', salario: 4000 },
      { id_empleado: 103, cedula: '303030303', nombre_completo: 'María Pérez', tipo_planilla: 'Pago por Clase', salario: 5000 },
      // … más empleados …
    ]);
  }, []);

  const handleGenerate = () => {
    if (selectedBranch === '') return;
    // Simular cálculo:
    const recs: PayRecord[] = employees.map(emp => {
      let cantidad: number | '-' = '-';
      let monto = 0;
      switch (emp.tipo_planilla) {
        case 'Pago Mensual':
          monto = emp.salario;
          break;
        case 'Pago por Horas':
          cantidad = 160; // horas trabajadas ejemplo
          monto = cantidad * emp.salario;
          break;
        case 'Pago por Clase':
          cantidad = 20; // clases impartidas ejemplo
          monto = cantidad * emp.salario;
          break;
      }
      return {
        cedula: emp.cedula,
        nombre: emp.nombre_completo,
        tipo: emp.tipo_planilla,
        cantidad,
        monto,
      };
    });
    setRecords(recs);
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

      {/* Botón “Inicio” */}
      <button
        className={styles.homeButton}
        onClick={() => router.push('/admin/Dashboard')}
      >
        <i className="fas fa-home"></i> Inicio
      </button>

      {/* Botón Cerrar Sesión */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      {/* Encabezado */}
      <h2 className={styles.mainHeader}>
        <i className="fas fa-file-alt"></i> Generación de Planilla
      </h2>
      <p className={styles.subHeader}>
        Seleccione una sucursal para calcular el pago a sus empleados.
      </p>

      {/* Contenedor de formulario y resultados */}
      <div className={styles.contentCard}>
        {/* Selección de sucursal */}
        <div className="mb-4">
          <label className="form-label"><strong>Sucursal:</strong></label>
          <select
            className="form-select"
            value={selectedBranch}
            onChange={e => setSelectedBranch(Number(e.target.value))}
          >
            <option value="">-- Elija una sucursal --</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Generar */}
        <button
          className="btn btn-primary mb-4"
          disabled={selectedBranch === ''}
          onClick={handleGenerate}
        >
          <i className="fas fa-calculator"></i> Generar Planilla
        </button>

        {/* Tabla de resultados */}
        {records.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Cédula</th>
                  <th>Nombre</th>
                  <th>Tipo Planilla</th>
                  <th>Cantidad</th>
                  <th>Monto a Pagar</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i}>
                    <td>{r.cedula}</td>
                    <td>{r.nombre}</td>
                    <td>{r.tipo}</td>
                    <td>{r.cantidad}</td>
                    <td>₡ {r.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
