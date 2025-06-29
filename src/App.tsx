import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import SettingsScreen from 'screens/SettingsScreen';
import Settings, { AppTheme, SettingsDefaults } from 'classes/Settings';
import AppContext, {AppContextType} from 'AppContext';
import { useOrientation } from 'hooks/useOrientation';
import BeefWeb from 'classes/BeefWeb';
import AboutScreen from 'screens/AboutScreen';

export type RootStackParamList = {
  Home: undefined,
  Settings: undefined,
  About: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [theme, setTheme] = useState<AppTheme>(SettingsDefaults.THEME);
  const orientation = useOrientation();

  // Set the theme from settings once on mount
  useEffect(() => {
    Settings.PROPS.THEME.get().then(setTheme);
  }, []);

  // Optional: Start Beefweb updates if automatic updates enabled
  useEffect(() => {
    Settings.PROPS.AUTOMATIC_UPDATES.get().then(BeefWeb.setState)

    // Cleanup on unmount (including hot reload)
    return () => {
      BeefWeb.setState(false)
    };
  }, []);

  const contextValue = useMemo<AppContextType>(
    () => ({
      BeefWeb: BeefWeb,
      Settings: Settings,
      theme,
      setTheme,
      orientation,
    }),
    [theme, orientation]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name='About' component={AboutScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
