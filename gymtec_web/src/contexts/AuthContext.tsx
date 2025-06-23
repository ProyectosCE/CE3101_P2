import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '@/stores/api';

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'CLIENTE' | 'INSTRUCTOR';
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (
      correo: string,
      contrasena: string,
      rol: 'ADMIN' | 'CLIENTE' | 'INSTRUCTOR'
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('gymtec_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsAuthenticating(false);
  }, []);

  const login = async (
      correo: string,
      contrasena: string,
      rol: 'ADMIN' | 'CLIENTE' | 'INSTRUCTOR'
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo,
          password: contrasena,
          rol: rol.toLowerCase(),
        }),
      });

      const data = await res.json();
      console.log('[AuthContext] login response:', data);

      // Chequeo de errores HTTP básicos
      if (!res.ok) {
        let msg = data.mensaje || `Error ${res.status}`;
        throw new Error(msg);
      }

      // logn fue exitoso
      const nombre = data.cliente || data.empleado || 'Usuario';
      const id = data.id;

      const nuevoUsuario: User = { id, nombre, correo, rol };
      setUser(nuevoUsuario);
      localStorage.setItem('gymtec_user', JSON.stringify(nuevoUsuario));

      // Redirije
      const rutas: Record<User['rol'], string> = {
        ADMIN: '/admin',
        CLIENTE: '/cliente',
        INSTRUCTOR: '/instructor',
      };
      router.replace(rutas[rol]);
    } catch (err: any) {
      console.error('[AuthContext] login error:', err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gymtec_user');
    router.replace('/login');
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            isAuthenticated: Boolean(user),
            login,
            logout,
          }}
      >
        {!isAuthenticating && children}
      </AuthContext.Provider>
  );
};
