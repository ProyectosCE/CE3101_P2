// src/pages/login.tsx

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../components/Common/Spinner';

export default function LoginPage() {
  // Se obtiene la función de login desde el contexto de autenticación.
  const { login } = useAuth();
  // Se obtiene el router para redirigir a otras páginas.
  const router = useRouter();

  // Se definen estados locales para manejar correo, contraseña, error, loading y visibilidad de contraseña.
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Se maneja el envío del formulario de login.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Se valida que ambos campos no estén vacíos.
    if (!correo || !contrasena) {
      setError('Correo y contraseña son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      // Se intenta autenticar al usuario con las credenciales proporcionadas.
      await login(correo, contrasena);
    } catch {
      // Si falla la autenticación, se muestra mensaje de error.
      setError('Credenciales inválidas.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Se muestra la tarjeta de login centrada en pantalla */}
      <div className={styles.loginCard}>
        {/* Se muestra el logotipo de GymTEC */}
        <img src="/logo.png" alt="Logo GymTEC" className={styles.loginLogo} />

        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit}>
          {/* Campo de correo electrónico con ícono */}
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

          {/* Campo de contraseña con toggle para mostrar/ocultar */}
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

          {/* Se muestra mensaje de error si existe */}
          {error && <div className={`alert alert-danger ${styles.loginError}`}>{error}</div>}

          {/* Botón de envío que muestra Spinner durante la autenticación */}
          <button
            type="submit"
            className={`btn w-100 ${styles.loginBtn}`}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Entrar'}
          </button>
        </form>

        {/* Botón para redirigir a la página de registro de cliente */}
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
