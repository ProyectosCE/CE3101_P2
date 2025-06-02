import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Header from '../components/Header';
import ProfileField from '../components/ProfileField';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

export default function ProfileScreen() {
  const navigation = useNavigation();

  // Datos fijos (no editables)
  const [cedula] = useState('123456789');
  const [nombre] = useState('José Barquero');
  const [fechaNacimiento] = useState('2000-01-01');
  const [password] = useState('********'); // solo a modo informativo

  // Datos editables
  const [edad, setEdad] = useState('25');
  const [peso, setPeso] = useState('72');
  const [imc, setImc] = useState('22.5');
  const [direccion, setDireccion] = useState('San José, Costa Rica');
  const [correo, setCorreo] = useState('jose@gymtec.com');

  const handleSaveChanges = () => {
    Alert.alert('Cambios guardados', 'Los datos han sido actualizados correctamente.');
    // A futuro: aquí se guardaría en SQLite o se enviaría al servidor
  };

  return (
    <View style={styles.container}>
      <Header title="Mi Perfil" onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <ScrollView contentContainerStyle={styles.body}>

        <Text style={styles.sectionTitle}>Información Personal</Text>
        <ProfileField label="Cédula" value={cedula} />
        <ProfileField label="Nombre y Apellidos" value={nombre} />
        <ProfileField label="Fecha de Nacimiento" value={fechaNacimiento} />
        <ProfileField label="Contraseña" value={password} />

        <Text style={styles.sectionTitle}>Datos Editables</Text>
        <ProfileField label="Edad" value={edad} editable onChangeText={setEdad} />
        <ProfileField label="Peso (kg)" value={peso} editable onChangeText={setPeso} />
        <ProfileField label="IMC" value={imc} editable onChangeText={setImc} />
        <ProfileField label="Dirección" value={direccion} editable onChangeText={setDireccion} />
        <ProfileField label="Correo Electrónico" value={correo} editable onChangeText={setCorreo} />

        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
