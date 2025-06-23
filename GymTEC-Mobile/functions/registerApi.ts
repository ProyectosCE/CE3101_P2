import axios from 'axios';
import { API_BASE_URL } from '../stores/api';

export interface RegisterClientePayload {
  cedula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  fecha_nacimiento: string; // formato: "mm-dd-yyyy" (ej. "06-24-2025")
  peso: string;
  imc: string;
  provincia: string;
  canton: string;
  distrito: string;
}

export interface RegisterResponse {
  success: boolean;
  mensaje?: string;
  data?: any;
}

// Utilidad para transformar mm-dd-yyyy → yyyy-mm-dd
function formatToISODate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export const registerCliente = async (payload: RegisterClientePayload): Promise<string> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/api/Cliente`,
      {
        cliente: {
          cedula: payload.cedula,
          nombres: payload.nombres,
          apellidos: payload.apellidos,
          correo: payload.correo,
          password: payload.password,
          fecha_nacimiento: formatToISODate(payload.fecha_nacimiento), 
          peso: parseFloat(payload.peso),
          imc: parseFloat(payload.imc),
          provincia: payload.provincia,
          canton: payload.canton,
          distrito: payload.distrito,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = response.data;
    if (!data.success) {
      throw new Error(data.mensaje || 'No se pudo registrar el usuario');
    }
    return data.mensaje || 'Registro exitoso';
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Reenviar errores de validación del backend si existen
      if (data?.errors) {
        const messages = Object.values(data.errors).flat().join('\n');
        throw new Error(messages);
      }

      if (status === 400) throw new Error('Solicitud incorrecta (400)');
      if (status === 409) throw new Error('El usuario ya existe (409)');
      if (status === 500) throw new Error('Error interno del servidor (500)');
      throw new Error(data?.mensaje || 'Error desconocido');
    }

    throw new Error('Error de red o inesperado');
  }
};
