import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/login.module.css';
import { useAuth } from '../../hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ClienteForm {
  cedula: string;
  nombres: string;
  apellidos: string;
  edad: number | '';
  fechaNacimiento: string;
  peso: number | '';
  imc: number | '';
  provincia: string;
  canton: string;
  distrito: string;
  correo: string;
  password: string;
}

export default function ClienteRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ClienteForm>({
    cedula: '',
    nombres: '',
    apellidos: '',
    edad: '',
    fechaNacimiento: '',
    peso: '',
    imc: '',
    provincia: '',
    canton: '',
    distrito: '',
    correo: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]:
          id === 'edad' || id === 'peso' || id === 'imc'
              ? value === '' ? '' : Number(value)
              : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      cedula,
      nombres,
      apellidos,
      edad,
      fechaNacimiento,
      peso,
      imc,
      provincia,
      canton,
      distrito,
      correo,
      password,
    } = formData;

    if (
        !cedula || !nombres || !apellidos || edad === '' || !fechaNacimiento ||
        peso === '' || imc === '' || !provincia || !canton || !distrito || !correo || !password
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (!/^\d{1,9}$/.test(cedula)) {
      alert('La cédula debe contener solo números y hasta 9 dígitos.');
      return;
    }

    const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!onlyLetters.test(nombres) || !onlyLetters.test(apellidos) || !onlyLetters.test(provincia) || !onlyLetters.test(canton) || !onlyLetters.test(distrito)) {
      alert('Nombres, apellidos, provincia, cantón y distrito solo pueden contener letras.');
      return;
    }

    if (typeof edad === 'number' && (edad < 1 || edad > 100)) {
      alert('La edad debe ser entre 1 y 100.');
      return;
    }

    if (typeof peso === 'number' && peso <= 0) {
      alert('El peso debe ser mayor a 0.');
      return;
    }

    if (typeof imc === 'number' && imc < 0) {
      alert('El IMC debe ser positivo.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error || 'Error desconocido al registrar.'}`);
        return;
      }

      alert('Registro exitoso. Ahora puede iniciar sesión.');
      router.push('/login');

    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Error de red al registrar. Intente de nuevo.');
    }
  };

  return (
      <div className={styles.loginPage}>
        <div className={styles.registerCard}>
          <img src="/logo.png" alt="Logo GymTEC" className={styles.loginLogo} />
          <h3>Registro de Cliente</h3>
          <form onSubmit={handleSubmit}>
            {/* Resto del formulario permanece igual */}
            {/* ... */}
          </form>
        </div>
      </div>
  );
}
