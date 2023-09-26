import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import AlarmPage from './pages/AlarmPage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Jet-Bold': require('./assets/fonts/JetBrainsMono-Bold.ttf'),
    'Jet-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <View>
      <AlarmPage/>
    </View>
  );
}


