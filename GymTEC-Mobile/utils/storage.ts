import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  AUTO_SYNC: 'auto_sync',
  LAST_SYNC: 'last_sync',
  // Se pueden añadir más claves reutilizables aquí
};

export async function saveToStorage(key: string, value: any): Promise<void> {
  try {
    const stringified = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringified);
  } catch (error) {
    console.error(`Error guardando en AsyncStorage [${key}]`, error);
  }
}

export async function getFromStorage<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error leyendo de AsyncStorage [${key}]`, error);
    return null;
  }
}

export async function removeFromStorage(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error eliminando clave de AsyncStorage [${key}]`, error);
  }
}