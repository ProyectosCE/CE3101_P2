import { View, Text, StyleSheet, Switch } from 'react-native';
import { Colors } from '../constants/colors';

interface SwitchToggleProps {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export default function SwitchToggle({ label, value, onValueChange }: SwitchToggleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{ false: '#ccc', true: Colors.primary }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#ccc"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
});