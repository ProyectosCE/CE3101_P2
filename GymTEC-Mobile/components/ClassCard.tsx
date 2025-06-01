import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

interface ClassCardProps {
  clase: {
    tipo: string;
    sucursal: string;
    fechaInicio: string;
    fechaFin: string;
    instructor: string;
    cupos: number;
  };
  onRegister: () => void;
}

export default function ClassCard({ clase, onRegister }: ClassCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{clase.tipo}</Text>
      <Text>Sucursal: {clase.sucursal}</Text>
      <Text>Instructor: {clase.instructor}</Text>
      <Text>Desde: {clase.fechaInicio}</Text>
      <Text>Hasta: {clase.fechaFin}</Text>
      <Text>Cupos disponibles: {clase.cupos}</Text>

      {clase.cupos > 0 ? (
        <TouchableOpacity style={styles.button} onPress={onRegister}>
          <Text style={styles.buttonText}>Registrarme</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.fullText}>Clase llena</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fullText: {
    marginTop: 10,
    color: '#999',
    fontStyle: 'italic',
  },
});
