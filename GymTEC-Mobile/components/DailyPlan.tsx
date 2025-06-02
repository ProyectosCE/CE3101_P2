import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../constants/colors';

const entrenamientosFicticios: Record<string, { tipo: string; duracion: string; observaciones: string }> = {
  '2025-06-01': { tipo: 'Cardio', duracion: '45 minutos', observaciones: 'Cinta + bicicleta' },
  '2025-06-02': { tipo: 'Fuerza', duracion: '1 hora', observaciones: 'Pecho y espalda' },
  '2025-06-03': { tipo: 'Yoga', duracion: '1 hora', observaciones: 'En sala 2, llevar mat' },
};

export default function DailyPlan() {
  const [selectedDate, setSelectedDate] = useState('2025-06-01');

  const entrenamiento = entrenamientosFicticios[selectedDate];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mi Plan de Entrenamiento</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: Colors.primary },
        }}
        style={styles.calendar}
      />

      {entrenamiento ? (
        <View style={styles.detailBox}>
          <Text style={styles.detailTitle}>Entrenamiento para {selectedDate}</Text>
          <Text>Tipo: {entrenamiento.tipo}</Text>
          <Text>Duración: {entrenamiento.duracion}</Text>
          <Text>Observaciones: {entrenamiento.observaciones}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>No hay entrenamiento asignado para este día.</Text>
      )}
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
  calendar: {
    borderRadius: 8,
    marginBottom: 12,
  },
  detailBox: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  detailTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  noData: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#888',
  },
});