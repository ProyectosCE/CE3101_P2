import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_URL } from '@/stores/api';

interface Branch {
  id_sucursal: number;
  nombre_sucursal: string;
}

interface PayRecord {
  cedula: string;
  nombre_empleado: string;
  tipo_planilla: string;
  unidades_trabajadas: number | null;
  monto_pagar: number;
  nombre_sucursal: string;
}

export default function PayrollGeneration() {
  const { logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | ''>('');
  const [records, setRecords] = useState<PayRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar sucursales desde backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sucursal`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Error cargando sucursales');
        setBranches(json.data);
      } catch (err: any) {
        console.error(err);
        alert(`Error al cargar sucursales: ${err.message}`);
      }
    };

    fetchBranches();
  }, []);

  const handleGenerate = async () => {
    if (selectedBranch === '') return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generar_planilla/${selectedBranch}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error al generar planilla');
      setRecords(json.data);
    } catch (err: any) {
      console.error(err);
      alert(`Error al generar planilla: ${err.message}`);
    } finally {
      setLoading(false);
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

        <button className={styles.homeButton} onClick={() => router.push('/admin/Dashboard')}>
          <i className="fas fa-home"></i> Inicio
        </button>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>

        <h2 className={styles.mainHeader}>
          <i className="fas fa-file-alt"></i> Generación de Planilla
        </h2>
        <p className={styles.subHeader}>
          Seleccione una sucursal para calcular el pago a sus empleados.
        </p>

        <div className={styles.contentCard}>
          <div className="mb-4">
            <label className="form-label"><strong>Sucursal:</strong></label>
            <select
                className="form-select"
                value={selectedBranch}
                onChange={e => setSelectedBranch(Number(e.target.value))}
            >
              <option value="">-- Elija una sucursal --</option>
              {branches.map(b => (
                  <option key={b.id_sucursal} value={b.id_sucursal}>
                    {b.nombre_sucursal}
                  </option>
              ))}
            </select>
          </div>

          <button
              className="btn btn-primary mb-4"
              disabled={selectedBranch === '' || loading}
              onClick={handleGenerate}
          >
            <i className="fas fa-calculator"></i> {loading ? 'Generando...' : 'Generar Planilla'}
          </button>

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
                        <td>{r.nombre_empleado}</td>
                        <td>{r.tipo_planilla}</td>
                        <td>{r.unidades_trabajadas ?? '-'}</td>
                        <td>₡ {r.monto_pagar.toLocaleString()}</td>
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
