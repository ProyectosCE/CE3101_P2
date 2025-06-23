import axios from 'axios';
import { API_BASE_URL } from '../stores/api';

export interface AuthUser {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
}

export interface AuthResponse {
  success: boolean;
  mensaje?: string;
  cliente?: string;
  empleado?: string;
  id?: string | number;
  rol?: string;
  token?: string;
}

export const loginUser = async (
  correo: string,
  password: string,
  rol: 'cliente' 
): Promise<AuthUser> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/api/Auth/login`,
      {
        correo,
        password,
        rol: rol.toLowerCase(),
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = response.data;

    if (!data.success) {
      throw new Error(data.mensaje || 'Error desconocido');
    }

    // El nombre puede venir en cliente según el rol
    const nombre = data.cliente || 'cliente';
    const id = data.id ? String(data.id) : '';
    return {
      id,
      nombre,
      correo,
      rol: data.rol || rol,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data;
      if (status === 400) throw new Error(data?.mensaje || 'Solicitud incorrecta (400)');
      if (status === 404) throw new Error(data?.mensaje || 'No encontrado (404)');
      if (status === 401) throw new Error(data?.mensaje || 'Credenciales inválidas (401)');
      if (status === 500) throw new Error('Error interno del servidor (500)');
      throw new Error(data?.mensaje || 'Error desconocido');
    }
    throw new Error('Error de red o inesperado');
  }
};