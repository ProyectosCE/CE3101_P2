import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
  });
}
