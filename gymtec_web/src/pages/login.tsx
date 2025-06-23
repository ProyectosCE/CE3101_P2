import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../components/Common/Spinner';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState<'ADMIN' | 'CLIENTE' | 'INSTRUCTOR'>('CLIENTE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!correo || !contrasena || !rol) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await login(correo, contrasena, rol);
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
      setLoading(false);
    }
  };

  return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.loginLogo} />

          <form onSubmit={handleSubmit}>
            {/* Correo */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
              <input
                  type="email"
                  className={`form-control ${styles.formControl}`}
                  placeholder="usuario@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
              />
            </div>

            {/* Contraseña */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <FontAwesomeIcon icon={faLock} />
            </span>
              <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${styles.formControl}`}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
              />
              <span
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((prev) => !prev)}
              >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            </div>

            {/* Rol */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <FontAwesomeIcon icon={faUser} />
            </span>
              <select
                  className={`form-control ${styles.formControl}`}
                  value={rol}
                  onChange={(e) => setRol(e.target.value as 'ADMIN' | 'CLIENTE' | 'INSTRUCTOR')}
                  required
              >
                <option value="CLIENTE">Cliente</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            {error && <div className={`alert alert-danger ${styles.loginError}`}>{error}</div>}

            <button
                type="submit"
                className={`btn w-100 ${styles.loginBtn}`}
                disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
                className="btn btn-outline-secondary w-100"
                onClick={() => router.push('/cliente/Register')}
            >
              Registrarse como nuevo cliente
            </button>
          </div>
        </div>
      </div>
  );
}
