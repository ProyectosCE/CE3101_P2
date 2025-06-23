import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';
import Logo from '../components/Logo';
import { router } from 'expo-router';
import { ROUTES } from '../constants/routes';
import { loginUser } from '../functions/authApi';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Por favor complete ambos campos');
      return;
    }
    setLoading(true);
    try {
      // Solo rol CLIENTE para app móvil
      const rest = await loginUser(correo, password, 'cliente');
      // Solo pasar a home si success = true
      if (rest && rest.id && rest.rol && rest.nombre) {
        router.push(ROUTES.HOME);
      } else {
        Alert.alert('Error', 'No se pudo iniciar sesión');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Iniciar Sesión</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push(ROUTES.REGISTER)}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: Colors.primary,
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
  link: {
    color: Colors.textSecondary,
    marginTop: 10,
  },
});
