import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'CLIENTE' | 'INSTRUCTOR';
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (correo: string, contrasena: string, rol: 'ADMIN' | 'CLIENTE' | 'INSTRUCTOR') => Promise<void>;
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
      const response = await fetch('http://localhost:5000/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          password: contrasena,
          rol: rol.toLowerCase(), // el backend espera "cliente", "admin", "instructor"
        }),
      });

      const data = await response.json();

      if (response.status === 400) {
        throw new Error(data.mensaje || 'Solicitud incorrecta (400)');
      }

      if (response.status === 404) {
        throw new Error(data.mensaje || 'Usuario no encontrado (404)');
      }

      if (response.status === 401) {
        throw new Error(data.mensaje || 'Credenciales inválidas (401)');
      }

      if (response.status === 500) {
        throw new Error('Error interno del servidor (500)');
      }

      if (!response.ok || !data.succes) {
        throw new Error(data.mensaje || 'Error desconocido');
      }

      const nombre = data.cliente || data.empleado || 'Usuario';
      const nuevoUsuario: User = { nombre, correo, rol };

      setUser(nuevoUsuario);
      localStorage.setItem('gymtec_user', JSON.stringify(nuevoUsuario));

      switch (rol) {
        case 'ADMIN':
          router.replace('/admin');
          break;
        case 'CLIENTE':
          router.replace('/cliente');
          break;
        case 'INSTRUCTOR':
          router.replace('/instructor');
          break;
      }
    } catch (err: any) {
      console.error('Error en login:', err);
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
