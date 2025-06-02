import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SwitchToggle from '../components/SwitchToggle';
import StatusCard from '../components/StatusCard';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';

export default function SyncScreen() {
  const navigation = useNavigation();
  const [isAutoSync, setIsAutoSync] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');

  // Leer estado guardado al iniciar la pantalla
  useEffect(() => {
    async function loadStoredData() {
      const storedAutoSync = await getFromStorage<boolean>(STORAGE_KEYS.AUTO_SYNC);
      const storedLastSync = await getFromStorage<string>(STORAGE_KEYS.LAST_SYNC);
      if (storedAutoSync !== null) setIsAutoSync(storedAutoSync);
      if (storedLastSync) setLastSyncTime(storedLastSync);
    }
    loadStoredData();
  }, []);

  // Guardar cada vez que cambia el switch
  const handleToggleChange = async (value: boolean) => {
    setIsAutoSync(value);
    await saveToStorage(STORAGE_KEYS.AUTO_SYNC, value);
  };

  const handleManualSync = async () => {
    const now = new Date();
    const formattedTime = now.toLocaleString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastSyncTime(formattedTime);
    await saveToStorage(STORAGE_KEYS.LAST_SYNC, formattedTime);
    Alert.alert('Sincronización completada', `Datos sincronizados correctamente el ${formattedTime}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Sincronización Manual" onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <View style={styles.body}>
        <SwitchToggle
          label="Sincronización en tiempo real"
          value={isAutoSync}
          onValueChange={handleToggleChange}
        />

        <StatusCard
          isAutoSyncEnabled={isAutoSync}
          lastSync={lastSyncTime}
        />

        <TouchableOpacity style={styles.button} onPress={handleManualSync}>
          <Text style={styles.buttonText}>Sincronizar ahora</Text>
        </TouchableOpacity>
      </View>
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
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
