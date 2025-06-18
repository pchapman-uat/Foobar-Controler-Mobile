import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import SettingsScreen from 'screens/SettingsScreen';
import Settings, { AppTheme, SettingsDefaults } from 'classes/Settings';
import AppContext, {AppContextType} from 'AppContext';
import Beefweb from 'classes/BeefWeb';
import { useOrientation } from 'hooks/useOrientation';

export type RootStackParamList = {
  Home: undefined,
  Settings: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [theme, setTheme] = useState<AppTheme>(SettingsDefaults.THEME);

  const beefWeb = useMemo(() => new Beefweb(), []);
  const settings = useMemo(() => new Settings(), []);
  const orientation = useOrientation();

  const contextValue = useMemo<AppContextType>(
    () => ({
      BeefWeb: beefWeb,
      Settings: settings,
      theme,
      setTheme,
      orientation,
    }),
    [theme, orientation]
  );

  useEffect(() => {
    settings.PROPS.THEME.get().then(setTheme);
  }, [settings]);

  return (
    <AppContext.Provider value={contextValue}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Settings' component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
