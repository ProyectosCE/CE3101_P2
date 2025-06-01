import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Inicio" />
      <Drawer.Screen name="Buscar Clases" />
      <Drawer.Screen name="Sincronización" />
      <Drawer.Screen name="Perfil" />

      {/* Ocultar las pantallas que no deben aparecer en el Drawer */}
      <Drawer.Screen
        name="index"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="login"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="register"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
}
