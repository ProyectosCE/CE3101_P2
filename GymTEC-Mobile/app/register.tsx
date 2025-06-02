import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';
import Logo from '../components/Logo';
import { router } from 'expo-router';
import { ROUTES } from '../constants/routes';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    cedula: '',
    nombre: '',
    edad: '',
    fechaNacimiento: '',
    peso: '',
    imc: '',
    direccion: '',
    correo: '',
    password: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = () => {
    if (Object.values(form).some(v => v === '')) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    const clienteRegistrado = { ...form };
    console.log('Cliente registrado:', clienteRegistrado);

    Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
    router.push(ROUTES.LOGIN);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push(ROUTES.LOGIN)}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      <Logo />
      <Text style={styles.title}>Registro de Cliente</Text>
      {[
        { key: 'cedula', label: 'Cédula' },
        { key: 'nombre', label: 'Nombre completo' },
        { key: 'edad', label: 'Edad' },
        { key: 'fechaNacimiento', label: 'Fecha de nacimiento (YYYY-MM-DD)' },
        { key: 'peso', label: 'Peso (kg)' },
        { key: 'imc', label: 'IMC' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'correo', label: 'Correo electrónico' },
        { key: 'password', label: 'Contraseña', secure: true },
      ].map(({ key, label, secure }) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder={label}
            onChangeText={text => handleChange(key, text)}
            secureTextEntry={secure}
            keyboardType={key === 'edad' || key === 'peso' || key === 'imc' ? 'numeric' : 'default'}
            autoCapitalize="none"
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
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
