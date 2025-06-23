import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/login.module.css';
import { useAuth } from '../../hooks/useAuth';
import { API_URL } from '@/stores/api';


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
            {/* Cédula */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-id-card"></i>
            </span>
              <input
                  type="text"
                  id="cedula"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Cédula"
                  maxLength={9}
                  pattern="\d*"
                  inputMode="numeric"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Nombres */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-user"></i>
            </span>
              <input
                  type="text"
                  id="nombres"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Nombres"
                  pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Apellidos */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-user"></i>
            </span>
              <input
                  type="text"
                  id="apellidos"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Apellidos"
                  pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Edad */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-birthday-cake"></i>
            </span>
              <input
                  type="number"
                  id="edad"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Edad"
                  min={1}
                  max={100}
                  value={formData.edad}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-calendar-alt"></i>
            </span>
              <input
                  type="date"
                  id="fechaNacimiento"
                  className={`form-control ${styles.formControl}`}
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Peso */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-weight"></i>
            </span>
              <input
                  type="number"
                  id="peso"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Peso (kg)"
                  min={1}
                  step="0.1"
                  value={formData.peso}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* IMC */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-calculator"></i>
            </span>
              <input
                  type="number"
                  id="imc"
                  className={`form-control ${styles.formControl}`}
                  placeholder="IMC"
                  min={0}
                  step="0.1"
                  value={formData.imc}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Provincia, Cantón, Distrito */}
            <div className="row g-3">
              <div className="col-md-4">
                <div className={`${styles.inputGroup} input-group`}>
                <span className={styles.inputGroupText}>
                  <i className="fas fa-map-marked-alt"></i>
                </span>
                  <input
                      type="text"
                      id="provincia"
                      className={`form-control ${styles.formControl}`}
                      placeholder="Provincia"
                      pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+"
                      value={formData.provincia}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className={`${styles.inputGroup} input-group`}>
                <span className={styles.inputGroupText}>
                  <i className="fas fa-map-pin"></i>
                </span>
                  <input
                      type="text"
                      id="canton"
                      className={`form-control ${styles.formControl}`}
                      placeholder="Cantón"
                      pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+"
                      value={formData.canton}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className={`${styles.inputGroup} input-group`}>
                <span className={styles.inputGroupText}>
                  <i className="fas fa-map"></i>
                </span>
                  <input
                      type="text"
                      id="distrito"
                      className={`form-control ${styles.formControl}`}
                      placeholder="Distrito"
                      pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]+"
                      value={formData.distrito}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>
            </div>

            {/* Correo electrónico */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-envelope"></i>
            </span>
              <input
                  type="email"
                  id="correo"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Correo electrónico"
                  value={formData.correo}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Contraseña */}
            <div className={`${styles.inputGroup} input-group`}>
            <span className={styles.inputGroupText}>
              <i className="fas fa-lock"></i>
            </span>
              <input
                  type="password"
                  id="password"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
              />
            </div>

            {/* Botón de registro */}
            <button
                type="submit"
                className={`btn btn-success w-100 ${styles.loginBtn}`}
            >
              <i className="fas fa-user-plus"></i> Registrar
            </button>
          </form>
        </div>
      </div>
  );
}