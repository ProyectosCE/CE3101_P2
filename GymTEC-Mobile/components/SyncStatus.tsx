import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';

export default function SyncStatus() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date().toLocaleString();
      setLastSync(now);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Estado de sincronización: {isSyncing ? 'Sincronizando...' : 'En línea'}</Text>
      {lastSync && <Text style={styles.syncTime}>Última sincronización: {lastSync}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSync} disabled={isSyncing}>
        <Text style={styles.buttonText}>{isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    marginBottom: 4,
  },
  syncTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
