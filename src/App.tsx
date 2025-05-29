import React, { useContext, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import SettingsScreen from 'screens/SettingsScreen';
import Settings, { AppTheme, defaults } from 'classes/Settings';
import AppContext, {AppContextType} from 'AppContext';
import Beefweb from 'classes/BeefWeb';

export type RootStackParamList = {
  Home: undefined,
  Settings: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const ctx = useContext(AppContext);
  
  const [theme, setTheme] = useState<AppTheme>(defaults.THEME);

  ctx.Settings.PROPS.THEME.get().then(setTheme)
  
  const beefWeb = useMemo(() => new Beefweb(), []);
  const settings = useMemo(() => new Settings(), []);
  const themeContextValue = useMemo<AppContextType>(
  () => ({
    BeefWeb: beefWeb,
    Settings: settings,
    theme,
    setTheme
  }),
  [beefWeb, settings, theme, setTheme]
);
  return (
    <AppContext.Provider value={themeContextValue}>
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{headerShown: false}}>
          <Stack.Screen 
          name='Home'
          component={Home}/>
            <Stack.Screen 
          name='Settings'
          component={SettingsScreen}
          options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
   
  );
}


