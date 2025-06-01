import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';

export default function Header({ onSettingsPress }: { onSettingsPress: () => void }) {
  const [autoSync, setAutoSync] = useState(true);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Hola, José 👋</Text>
        <Text style={styles.subtext}>Bienvenido a tu GymTEC</Text>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.syncToggle}>
          <Text style={styles.syncText}>Sincronizar con WiFi</Text>
          <Switch value={autoSync} onValueChange={setAutoSync} />
        </View>
        <TouchableOpacity onPress={onSettingsPress}>
          <Text style={styles.configText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#fff',
    fontSize: 14,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  syncToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  syncText: {
    color: '#fff',
    marginRight: 8,
  },
  configText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});