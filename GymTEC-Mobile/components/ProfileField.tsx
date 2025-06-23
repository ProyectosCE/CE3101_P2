import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface ProfileFieldProps {
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}

export default function ProfileField({ label, value, editable = false, onChangeText }: ProfileFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          editable={true}
        />
      ) : (
        <Text style={styles.text}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 8,
  },
});