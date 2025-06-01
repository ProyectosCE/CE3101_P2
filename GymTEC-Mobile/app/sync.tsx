import { View, Text, StyleSheet } from 'react-native';

export default function SyncScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Sincronización Manual (Próximamente)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});