export interface Usuario {
  cedula: string;
  nombre: string;
  edad: number;
  fechaNacimiento: string;
  peso: number;
  imc: number;
  direccion: string;
  correo: string;
  password: string; // almacenado encriptado (MD5)
}
