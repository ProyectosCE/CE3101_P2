import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import DailyPlan from '../components/DailyPlan';
import ClassSearchForm from '../components/ClassSearchForm';
import ClassCard from '../components/ClassCard';
import SyncStatus from '../components/SyncStatus';
import { useState } from 'react';

const clasesFicticias = [
  {
    tipo: 'Yoga',
    sucursal: 'San José',
    fechaInicio: '2025-06-05',
    fechaFin: '2025-06-05',
    instructor: 'Ana María',
    cupos: 5,
  },
  {
    tipo: 'Zumba',
    sucursal: 'Cartago',
    fechaInicio: '2025-06-06',
    fechaFin: '2025-06-06',
    instructor: 'Carlos Pérez',
    cupos: 0,
  },
];

export default function HomeScreen() {
  const [resultados, setResultados] = useState<typeof clasesFicticias>([]);

  const handleSearch = (filters: {
    sucursal: string;
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
  }) => {
    const filtradas = clasesFicticias.filter((clase) => {
      return (
        (!filters.sucursal || clase.sucursal.toLowerCase().includes(filters.sucursal.toLowerCase())) &&
        (!filters.tipo || clase.tipo === filters.tipo) &&
        (!filters.fechaInicio || clase.fechaInicio >= filters.fechaInicio) &&
        (!filters.fechaFin || clase.fechaFin <= filters.fechaFin)
      );
    });
    setResultados(filtradas);
  };

  const handleRegister = (claseTipo: string) => {
    Alert.alert('Registro exitoso', `Te has inscrito en la clase de ${claseTipo}`);
  };

  const handleSettingsPress = () => {
    Alert.alert('Perfil', 'Aquí podrías ir a la pantalla de perfil o cerrar sesión.');
  };

  return (
    <ScrollView style={styles.container}>
      <Header onSettingsPress={handleSettingsPress} />
      <SyncStatus />
      <DailyPlan />
      <ClassSearchForm onSearch={handleSearch} />
      <View style={styles.cardList}>
        {resultados.map((clase, index) => (
          <ClassCard key={index} clase={clase} onRegister={() => handleRegister(clase.tipo)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
