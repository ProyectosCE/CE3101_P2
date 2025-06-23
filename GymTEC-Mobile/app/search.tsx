import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import ClassSearchForm from '../components/ClassSearchForm';
import ClassCard from '../components/ClassCard';
import { useState } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const clasesDisponibles = [
  {
    tipo: 'Yoga',
    sucursal: 'San José',
    fechaInicio: '2025-06-10',
    fechaFin: '2025-06-10',
    instructor: 'Ana María',
    cupos: 5,
  },
  {
    tipo: 'Zumba',
    sucursal: 'Cartago',
    fechaInicio: '2025-06-12',
    fechaFin: '2025-06-12',
    instructor: 'Carlos Pérez',
    cupos: 0,
  },
  {
    tipo: 'Natación',
    sucursal: 'Heredia',
    fechaInicio: '2025-06-15',
    fechaFin: '2025-06-15',
    instructor: 'Laura Sánchez',
    cupos: 3,
  },
];

export default function SearchScreen() {
  const navigation = useNavigation();
  const [resultados, setResultados] = useState<typeof clasesDisponibles>([]);

  const handleSearch = (filters: {
    sucursal: string;
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
  }) => {
    const filtradas = clasesDisponibles.filter((clase) => {
      return (
        (!filters.sucursal || clase.sucursal.toLowerCase().includes(filters.sucursal.toLowerCase())) &&
        (!filters.tipo || clase.tipo === filters.tipo) &&
        (!filters.fechaInicio || clase.fechaInicio >= filters.fechaInicio) &&
        (!filters.fechaFin || clase.fechaFin <= filters.fechaFin)
      );
    });
    setResultados(filtradas);
  };

  const handleRegister = (tipo: string) => {
    Alert.alert('Registro exitoso', `Te has inscrito en la clase de ${tipo}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Búsqueda de Clases" onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <ClassSearchForm onSearch={handleSearch} />
      <View style={styles.resultsContainer}>
        {resultados.map((clase, index) => (
          <ClassCard key={index} clase={clase} onRegister={() => handleRegister(clase.tipo)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});