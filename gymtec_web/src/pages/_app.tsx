// src/pages/_app.tsx

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/SideBar';
import Spinner from '../components/Common/Spinner';

function AppWrapper({ Component, pageProps }: AppProps) {
  // Se obtiene el router de Next.js
  const router = useRouter();
  // Se extraen estado y datos de autenticación
  const { user, isAuthenticated } = useAuth();
  // Se determina la ruta actual
  const ruta = router.pathname;

  useEffect(() => {
    // Se definen rutas siempre públicas (login, registro cliente y dashboards de instructor/cliente/admin)
    const alwaysPublic = [
      '/login',
      '/cliente/Register',
      '/instructor/Dashboard',
      '/cliente/Dashboard',
      '/admin/Dashboard'
    ];
    // Se permite acceso a cualquier ruta bajo /instructor, /cliente o /admin
    const isInstructorRoute = ruta.startsWith('/instructor');
    const isClienteRoute    = ruta.startsWith('/cliente');
    const isAdminRoute      = ruta.startsWith('/admin');

    // Si no está autenticado y la ruta NO es pública ni de instructor/cliente/admin, redirige a /login
    if (
      !isAuthenticated &&
      !alwaysPublic.includes(ruta) &&
      !isInstructorRoute &&
      !isClienteRoute &&
      !isAdminRoute
    ) {
      router.replace('/login');
    }

    // Si está autenticado y está en /login, redirige al dashboard según rol
    if (isAuthenticated && ruta === '/login') {
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
          router.replace('/');
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
      {/* Se muestra Header y Sidebar únicamente si el usuario está autenticado */}
      {isAuthenticated && <Header />}
      {isAuthenticated && <Sidebar />}
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
