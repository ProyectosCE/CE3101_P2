// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'CLIENTE' | 'INSTRUCTOR' | null;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
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
    // Intentar restaurar sesión desde localStorage
    const stored = localStorage.getItem('gymtec_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsAuthenticating(false);
  }, []);

  const login = async (correo: string, contrasena: string) => {
    // Simular verificación de credenciales (no hay API real)
    // Asignamos rol según el dominio de correo:
    // - si termina en @admin.com → ADMIN
    // - si termina en @instructor.com → INSTRUCTOR
    // - en cualquier otro caso → CLIENTE
    let rol: User['rol'] = 'CLIENTE';
    if (correo.endsWith('@admin.com')) rol = 'ADMIN';
    else if (correo.endsWith('@instructor.com')) rol = 'INSTRUCTOR';

    // Para simular retraso de verificación
    await new Promise((res) => setTimeout(res, 500));

    const nombre = correo.split('@')[0];
    const nuevoUsuario: User = { nombre, correo, rol };
    setUser(nuevoUsuario);
    localStorage.setItem('gymtec_user', JSON.stringify(nuevoUsuario));

    // Redirigir según rol
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
      default:
        router.replace('/');
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
