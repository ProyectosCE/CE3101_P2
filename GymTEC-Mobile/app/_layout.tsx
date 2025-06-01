import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen name="home" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="search" options={{ title: 'Buscar Clases' }} />
      <Drawer.Screen name="sync" options={{ title: 'Sincronización' }} />
      <Drawer.Screen name="profile" options={{ title: 'Perfil' }} />
    </Drawer>
  );
}
