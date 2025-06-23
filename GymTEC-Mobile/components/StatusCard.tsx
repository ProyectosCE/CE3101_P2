import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface StatusCardProps {
  isAutoSyncEnabled: boolean;
  lastSync: string; // Puede venir en formato: "01/06/2025 - 11:45 a.m."
}

export default function StatusCard({ isAutoSyncEnabled, lastSync }: StatusCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sincronización automática:</Text>
      <Text style={styles.value}>{isAutoSyncEnabled ? 'Activada ✅' : 'Desactivada ❌'}</Text>

      <Text style={[styles.label, { marginTop: 12 }]}>Última sincronización manual:</Text>
      <Text style={styles.value}>{lastSync || 'No se ha sincronizado aún'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: 'bold',
  },
});