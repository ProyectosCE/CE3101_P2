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
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const ruta = router.pathname;

  useEffect(() => {
    // Rutas siempre públicas
    const alwaysPublic = ['/login', '/cliente/Register'];
    // Permitir también todas las rutas de instructor y cliente sin iniciar sesión
    const isInstructorRoute = ruta.startsWith('/instructor');
    const isClienteRoute = ruta.startsWith('/cliente');

    // Si NO está autenticado y la ruta NO es pública, de instructor o de cliente, va a login
    if (
      !isAuthenticated &&
      !alwaysPublic.includes(ruta) &&
      !isInstructorRoute &&
      !isClienteRoute
    ) {
      router.replace('/login');
    }

    // Si ya inició sesión y está en /login, redirige según rol
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

  // Mostrar spinner mientras verifica autenticación en rutas que no sean instructor/cliente o login/register
  if (
    !isAuthenticated &&
    ruta !== '/login' &&
    ruta !== '/cliente/Register' &&
    !ruta.startsWith('/instructor') &&
    !ruta.startsWith('/cliente')
  ) {
    return <Spinner />;
  }

  return (
    <>
      {/* Mostrar Header/Sidebar solo tras autenticar */}
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
