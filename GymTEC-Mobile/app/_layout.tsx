import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="home" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="search" options={{ title: 'Buscar Clases' }} />
      <Drawer.Screen name="sync" options={{ title: 'Sincronizar' }} />
      <Drawer.Screen name="profile" options={{ title: 'Perfil' }} />

      {/* Rutas protegidas: ocultas y con swipe desactivado */}
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="register"
        options={{
          drawerItemStyle: { display: 'none' },
          swipeEnabled: false,
        }}
      />
    </Drawer>
  );
}
