import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardTypeOptions } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';
import Logo from '../components/Logo';
import { router } from 'expo-router';
import { ROUTES } from '../constants/routes';
import { registerCliente } from '../functions/registerApi';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    correo: '',
    password: '',
    fecha_nacimiento: '',
    peso: '',
    imc: '',
    provincia: '',
    canton: '',
    distrito: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (Object.values(form).some(v => v === '')) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    setLoading(true);
    try {
      // Adaptar el payload para el backend
      const res = await registerCliente({
        cedula: form.cedula,
        nombre: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        password: form.password,
        fechaNacimiento: form.fecha_nacimiento,
        peso: form.peso,
        imc: form.imc,
        provincia: form.provincia,
        canton: form.canton,
        direccion: form.distrito,
      } as any);
      if (res && typeof res === 'string') {
        Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
        router.push(ROUTES.LOGIN);
      } else {
        Alert.alert('Error', 'No se pudo registrar el usuario');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  // Define los campos y tipos de teclado explícitamente
  const fields: {
    key: keyof typeof form;
    label: string;
    placeholder: string;
    secure?: boolean;
    keyboardType?: KeyboardTypeOptions;
  }[] = [
    { key: 'cedula', label: 'Cédula', placeholder: 'Ej: 1238' },
    { key: 'nombres', label: 'Nombre', placeholder: 'Ej: Alexander' },
    { key: 'apellidos', label: 'Apellidos', placeholder: 'Ej: Vargas' },
    { key: 'correo', label: 'Correo electrónico', placeholder: 'Ej: alex@gym.tem', keyboardType: 'email-address' },
    { key: 'password', label: 'Contraseña', placeholder: 'Ej: pass123', secure: true },
    { key: 'fecha_nacimiento', label: 'Fecha de nacimiento', placeholder: 'Ej: 25-28-2005' },
    { key: 'peso', label: 'Peso (kg)', placeholder: 'Ej: 56', keyboardType: 'numeric' },
    { key: 'imc', label: 'IMC', placeholder: 'Ej: 16', keyboardType: 'numeric' },
    { key: 'provincia', label: 'Provincia', placeholder: 'Ej: Cartago' },
    { key: 'canton', label: 'Cantón', placeholder: 'Ej: Cartago' },
    { key: 'distrito', label: 'Distrito o Dirección completa', placeholder: 'Ej: Cartago, Cartago, Cartago' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push(ROUTES.LOGIN)}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      <Logo />
      <Text style={styles.title}>Registro de Cliente</Text>
      {fields.map(({ key, label, placeholder, secure, keyboardType }) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onChangeText={text => handleChange(key, text)}
            secureTextEntry={secure}
            keyboardType={keyboardType}
            autoCapitalize="none"
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginVertical: 12,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 4,
    fontSize: 14,
    color: Colors.text,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
