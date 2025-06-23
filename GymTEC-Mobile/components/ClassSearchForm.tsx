import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';

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
  const [error, setError] = useState(false);

  const handleSearch = () => {
    if (!sucursal && !tipo && !fechaInicio && !fechaFin) {
      setError(true);
      return;
    }
    setError(false);
    onSearch({ sucursal, tipo, fechaInicio, fechaFin });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Filtros de Búsqueda</Text>

      <Text style={styles.label}>Sucursal</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la sucursal (ej: San José)"
        value={sucursal}
        onChangeText={setSucursal}
      />

      <Text style={styles.label}>Tipo de Clase</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.pickerText}>
          <Picker.Item label="Seleccione una clase" value="" color="#999" />
          <Picker.Item label="Indoor Cycling" value="Indoor Cycling" color="#000" />
          <Picker.Item label="Pilates" value="Pilates" color="#000" />
          <Picker.Item label="Yoga" value="Yoga" color="#000" />
          <Picker.Item label="Zumba" value="Zumba" color="#000" />
          <Picker.Item label="Natación" value="Natación" color="#000" />
          <Picker.Item label="Crossfit" value="Crossfit" color="#000" />
          <Picker.Item label="HIIT" value="HIIT" color="#000" />
          <Picker.Item label="Funcional" value="Funcional" color="#000" />
          <Picker.Item label="TRX" value="TRX" color="#000" />
          <Picker.Item label="Step" value="Step" color="#000" />
        </Picker>
      </View>

      <Text style={styles.label}>Fecha de Inicio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 2025-06-01"
        value={fechaInicio}
        onChangeText={setFechaInicio}
      />

      <Text style={styles.label}>Fecha de Fin</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 2025-06-30"
        value={fechaFin}
        onChangeText={setFechaFin}
      />

      {error && (
        <Text style={styles.errorText}>Ingrese al menos un campo para realizar la búsqueda.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar Clases</Text>
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
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerText: {
    color: '#333',
    fontSize: 16,
    paddingHorizontal: Platform.OS === 'android' ? 10 : 0,
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
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});
