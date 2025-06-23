// src/components/Layout/Header.tsx
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">GymTEC</span>
        <div className="d-flex align-items-center">
          {user && (
            <>
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <span className="text-white me-4">{user.nombre}</span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={logout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
