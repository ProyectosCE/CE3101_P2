import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_URL } from '@/stores/api';
interface Branch {
  id: number;
  nombre: string;
}

interface Treatment {
  id: number;
  nombre: string;
}

interface Product {
  codigo: string;
  nombre: string;
}

interface Clase {
  id: number;
  servicio: string;
  modalidad: 'Individual' | 'Grupal';
  fecha: string;
}

export default function CopyGymPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [sourceId, setSourceId] = useState<number | ''>('');
  const [destId, setDestId] = useState<number | ''>('');
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [classes, setClasses] = useState<Clase[]>([]);


  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sucursal`);
        const data = await response.json();
        if (data.success) {
          setBranches(
              data.data.map((s: any) => ({ id: s.id_sucursal, nombre: s.nombre_sucursal }))
          );
        }
      } catch (err) {
        console.error('Error al cargar sucursales:', err);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!sourceId) return;
      try {
        const [tratamientosRes, productosRes] = await Promise.all([
          fetch(`${API_URL}/api/sucursalxtratamiento/${sourceId}`),
          fetch(`${API_URL}/api/sucursalxproducto/${sourceId}`)
        ]);

        const tratamientosData = await tratamientosRes.json();
        const productosData = await productosRes.json();

        if (tratamientosData.success) {
          setTreatments(tratamientosData.data.map((t: any) => ({
            id: t.id_tratamiento,
            nombre: t.nombre_tratamiento
          })));
        }

        if (productosData.success) {
          setProducts(productosData.data.map((p: any) => ({
            codigo: p.codigo_barra,
            nombre: p.nombre_producto
          })));
        }
      } catch (err) {
        console.error('Error al cargar detalles de sucursal:', err);
      }

      if (destId === sourceId) {
        setDestId('');
      }
    };

    fetchDetails();
  }, [sourceId]);

  const handleCopy = async () => {
    if (!sourceId || !destId) return;
    const src = branches.find(b => b.id === sourceId)?.nombre;
    const dst = branches.find(b => b.id === destId)?.nombre;

    if (window.confirm(`¿Confirma copiar la sucursal "${src}" al destino "${dst}"?`)) {
      try {
        const response = await fetch(`${API_URL}/api/sucursal/copiar_sucursal/${sourceId}`, {
          method: 'POST',
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Error al copiar la sucursal');
        }

        alert(`Sucursal copiada exitosamente. Nuevo ID: ${data.nuevo_id_sucursal}`);
        router.push('/admin/Dashboard');
      } catch (err: any) {
        alert(`Error: ${err.message}`);
        console.error(err);
      }
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
          <i className="fas fa-clone"></i> Copiar Gimnasio
        </h2>
        <p className={styles.subHeader}>
          Seleccione origen y destino para copiar todos los datos.
        </p>
        <div className="mb-3">
          <label className="form-label"><strong>Sucursal Origen:</strong></label>
          <select className="form-select" value={sourceId} onChange={e => setSourceId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">-- Elija origen --</option>
            {branches.map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>
        {sourceId && (
            <div className="mb-4">
              <label className="form-label"><strong>Sucursal Destino:</strong></label>
              <select className="form-select" value={destId} onChange={e => setDestId(e.target.value ? Number(e.target.value) : '')}>
                <option value="">-- Elija destino --</option>
                {branches.filter(b => b.id !== sourceId).map(b => (
                    <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>
        )}
        {sourceId && destId && (
            <div className={styles.sectionContainer}>
              <h5><i className="fas fa-spa"></i> Tratamientos de Spa</h5>
              <ul className="list-group mb-3">
                {treatments.map(t => (
                    <li key={t.id} className="list-group-item">{t.nombre}</li>
                ))}
              </ul>
              <h5><i className="fas fa-store"></i> Productos de Tienda</h5>
              <ul className="list-group mb-3">
                {products.map(p => (
                    <li key={p.codigo} className="list-group-item">{p.nombre} ({p.codigo})</li>
                ))}
              </ul>
              <button className="btn btn-primary" onClick={handleCopy}>
                <i className="fas fa-copy"></i> Copiar Gimnasio
              </button>
            </div>
        )}
      </div>
  );
}