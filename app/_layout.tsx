import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from "expo-router";
import { Image } from 'react-native';
import { COLORS } from './constants/colors';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'CAIXASTD': require('../assets/fonts/CAIXAStd-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerBackground: () => (
            <LinearGradient
              colors={[COLORS.caixaTurquesa, COLORS.caixaAzul]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
          headerRight: () => (
            <Image
              source={require('../assets/images/caixa_x.png')}
              style={{ height: 30 }}
              resizeMode="contain"
            />
          ),
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'CAIXASTD',
          },
        }}
      >
        <Tabs.Screen
          name="produtos"
          options={{
            title: "Produtos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="basket" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="simular"
          options={{
            title: "Simular",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="logo-usd" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
