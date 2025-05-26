import React, { useContext, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import SettingsScreen from 'screens/SettingsScreen';
import { AppTheme, defaults } from 'classes/Settings';
import ThemeContext from 'ThemeContext';
import { AppContext } from 'AppContext';

export type RootStackParamList = {
  Home: undefined,
  Settings: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const ctx = useContext(AppContext);
  
  const [theme, setTheme] = useState<AppTheme>(defaults.THEME);

  ctx.Settings.PROPS.THEME.get().then(setTheme)

  // UseMemo to avoid re-creating the object unless theme changes
  const themeContextValue = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={themeContextValue}>
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
    </ThemeContext.Provider>
   
  );
}


