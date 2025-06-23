import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/ClientPage.module.css';
import { API_URL } from '@/stores/api';

interface DetallePlan {
  id_detalle_plan: number;
  fecha: string;
  actividad: string;
}

interface PlanTrabajo {
  id_plan_trabajo: number;
  nombre_cliente: string;
  nombre_instructor: string;
  start_date: string;
  end_date: string;
  descripcion: string;
  detalles: DetallePlan[];
}

export default function MyPlan() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [planesTrabajo, setPlanesTrabajo] = useState<PlanTrabajo[]>([]);
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_URL}/api/plantrabajo/${user.id}`);
        const data = await res.json();
        if (data.success) setPlanesTrabajo(data.data);
      } catch (err) {
        console.error('Error al obtener plan:', err);
      }
    };
    fetchPlan();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleExpand = (id: number) => {
    setExpandedPlanId(prev => (prev === id ? null : id));
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo GymTEC" className={styles.logoImage} />
      </div>
      <button className={styles.homeButton} onClick={() => router.push('/cliente/Dashboard')}>
        <i className="fas fa-home" /> Inicio
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt" /> Cerrar Sesión
      </button>

      <div className={styles.contentCard}>
        <h3><i className="fas fa-calendar-alt" /> Mi Plan de Trabajo</h3>

        {planesTrabajo.length > 0 ? (
          <div className="accordion mt-3">
            {planesTrabajo.map(plan => (
              <div key={plan.id_plan_trabajo} className="accordion-item mb-2">
                <h5 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    onClick={() => toggleExpand(plan.id_plan_trabajo)}
                    aria-expanded={expandedPlanId === plan.id_plan_trabajo}
                  >
                    {plan.descripcion} ({plan.start_date} - {plan.end_date})
                  </button>
                </h5>
                {expandedPlanId === plan.id_plan_trabajo && (
                  <div className="accordion-body">
                    <p><strong>Instructor:</strong> {plan.nombre_instructor}</p>
                    <p><strong>Cliente:</strong> {plan.nombre_cliente}</p>
                    <hr />
                    <ul className="list-group">
                      {plan.detalles.map((detalle, index) => (
                        <li key={index} className="list-group-item">
                          <i className="fas fa-calendar-day me-2" />
                          <strong>{detalle.fecha}</strong>: {detalle.actividad}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>
            <i className="fas fa-info-circle me-2" /> No tienes planes asignados.
          </div>
        )}
      </div>
    </div>
  );
}
