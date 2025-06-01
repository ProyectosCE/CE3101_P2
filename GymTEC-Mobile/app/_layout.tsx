import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false, // Oculta el header por defecto en todas las pantallas
      }}
    >
      <Drawer.Screen name="home" />
      <Drawer.Screen name="search" />
      <Drawer.Screen name="sync" />
      <Drawer.Screen name="profile" />
    </Drawer>
  );
}
