import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import DailyPlan from '../components/DailyPlan';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleOpenMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      <Header onMenuPress={handleOpenMenu} userName="José" />
      <DailyPlan />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});