// src/pages/_app.tsx

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import Header from '../components/Layout/Header';
import Spinner from '../components/Common/Spinner';

function AppWrapper({ Component, pageProps }: AppProps) {
  // Se obtiene el router de Next.js
  const router = useRouter();
  // Se extraen estado y datos de autenticación
  const { user, isAuthenticated } = useAuth();
  // Se determina la ruta actual
  const ruta = router.pathname;

  useEffect(() => {
    // Se definen rutas siempre públicas (login y registro cliente)
    const alwaysPublic = [
      '/login',
      '/cliente/Register',
    ];

    // Se permite acceso a cualquier ruta bajo /instructor, /cliente o /admin
    const isInstructorRoute = ruta.startsWith('/instructor');
    const isClienteRoute    = ruta.startsWith('/cliente');
    const isAdminRoute      = ruta.startsWith('/admin');

    // Si no está autenticado y la ruta NO es pública, redirige a /login
    if (!isAuthenticated && !alwaysPublic.includes(ruta)) {
      router.replace('/login');
      return;
    }

    // Si está autenticado y está en una ruta base, login o home, redirige al dashboard según rol
    if (isAuthenticated && (ruta === '/login' || ruta === '/admin' || ruta === '/cliente' || 
        ruta === '/instructor' || ruta === '/')) {
      switch (user?.rol) {
        case 'ADMIN':
          router.replace('/admin/Dashboard');
          break;
        case 'CLIENTE':
          router.replace('/cliente/Dashboard');
          break;
        case 'INSTRUCTOR':
          router.replace('/instructor/Dashboard');
          break;
        default:
          router.replace('/login');
      }
    }

    // Verificar que el usuario tenga acceso a la ruta según su rol
    if (isAuthenticated && user) {
      if ((isAdminRoute && user.rol !== 'ADMIN') ||
          (isClienteRoute && user.rol !== 'CLIENTE') ||
          (isInstructorRoute && user.rol !== 'INSTRUCTOR')) {
        router.replace(`/${user.rol.toLowerCase()}/Dashboard`);
      }
    }
  }, [isAuthenticated, ruta, router, user]);

  // Mientras verifica autenticación en rutas privadas, muestra spinner
  if (
    !isAuthenticated &&
    ruta !== '/login' &&
    ruta !== '/cliente/Register' &&
    !ruta.startsWith('/instructor') &&
    !ruta.startsWith('/cliente') &&
    !ruta.startsWith('/admin')
  ) {
    return <Spinner />;
  }

  return (
    <>
      {/* Se muestra Header únicamente si el usuario está autenticado */}
      {isAuthenticated && <Header />}
      <Component {...pageProps} />
    </>
  );
}

export default function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <AppWrapper {...props} />
    </AuthProvider>
  );
}
