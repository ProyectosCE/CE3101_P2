import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Colors } from '../constants/colors';

interface ClassSearchFormProps {
  onSearch: (filters: {
    sucursal: string;
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
  }) => void;
}

export default function ClassSearchForm({ onSearch }: ClassSearchFormProps) {
  const [sucursal, setSucursal] = useState('');
  const [tipo, setTipo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Buscar Clases</Text>

      <Text style={styles.label}>Sucursal</Text>
      <TextInput
        style={styles.input}
        placeholder="Sucursal"
        value={sucursal}
        onChangeText={setSucursal}
      />

      <Text style={styles.label}>Tipo de Clase</Text>
      {Platform.OS === 'android' ? (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}>
            <Picker.Item label="Seleccione tipo de clase" value="" />
            <Picker.Item label="Indoor Cycling" value="Indoor Cycling" />
            <Picker.Item label="Pilates" value="Pilates" />
            <Picker.Item label="Yoga" value="Yoga" />
            <Picker.Item label="Zumba" value="Zumba" />
            <Picker.Item label="Natación" value="Natación" />
          </Picker>
        </View>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Tipo de clase"
          value={tipo}
          onChangeText={setTipo}
        />
      )}

      <Text style={styles.label}>Periodo de Búsqueda</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha Inicio (YYYY-MM-DD)"
        value={fechaInicio}
        onChangeText={setFechaInicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha Fin (YYYY-MM-DD)"
        value={fechaFin}
        onChangeText={setFechaFin}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onSearch({ sucursal, tipo, fechaInicio, fechaFin })}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.primary,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerWrapper: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
