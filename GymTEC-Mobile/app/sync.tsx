import { View, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import Header from '../components/Header';
import SwitchToggle from '../components/SwitchToggle';
import StatusCard from '../components/StatusCard';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import { Colors } from '../constants/colors';

export default function SyncScreen() {
  const navigation = useNavigation();
  const [isAutoSync, setIsAutoSync] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');

  const handleManualSync = () => {
    const now = new Date();
    const formattedTime = now.toLocaleString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastSyncTime(formattedTime);
    Alert.alert('Sincronización completada', `Datos sincronizados correctamente el ${formattedTime}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Sincronización Manual" onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <View style={styles.body}>
        <SwitchToggle
          label="Sincronización en tiempo real"
          value={isAutoSync}
          onValueChange={setIsAutoSync}
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
