// src/pages/cliente/MyPlan.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/ClientPage.module.css';

export default function MyPlan() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [planTrabajo, setPlanTrabajo] = useState<any[]>([]);

    useEffect(() => {
        const fetchPlan = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`/api/plantrabajo/${user.id}`);
                const data = await res.json();
                if (data.success) setPlanTrabajo(data.data);
            } catch (err) {
                console.error('Error al obtener plan:', err);
            }
        };
        fetchPlan();
    }, [user]);

    const parseLocalDate = (iso: string) => {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    const localDate = selectedDate ? parseLocalDate(selectedDate) : null;

    const formatDate = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const filteredPlan = planTrabajo.filter(p => p.fecha === selectedDate);

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
                <p>Seleccione una fecha para ver su plan asignado:</p>
                <div className="input-group mx-auto" style={{ maxWidth: 200 }}>
          <span className="input-group-text">
            <i className="fas fa-calendar-day" />
          </span>
                    <input type="date" className="form-control" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                </div>
                {localDate ? (
                    filteredPlan.length > 0 ? (
                        <div style={{ marginTop: 20 }}>
                            <h4>Plan para {formatDate(localDate)}</h4>
                            <ul className="list-unstyled">
                                {filteredPlan.map((p, i) => (
                                    <li key={i}><i className="fas fa-dumbbell me-2" />{p.descripcion}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>
                            <i className="fas fa-info-circle me-2" />No hay plan para esta fecha.
                        </div>
                    )
                ) : (
                    <div style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>
                        <i className="fas fa-info-circle me-2" />No hay fecha seleccionada.
                    </div>
                )}
            </div>
        </div>
    );
}
