import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import AlarmPage from './pages/AlarmPage.js';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import notifee, { EventType } from '@notifee/react-native';
// SplashScreen.preventAutoHideAsync();

export default function App() {

  useEffect(() => {
    async function requestPermission() {
      await notifee.requestPermission()
    }
    requestPermission()
  }, []);

  // Subscribe to events
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

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
      <AlarmPage />
    </View>
  );
}


