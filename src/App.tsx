import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Connection from './screens/Connection'
import NowPlaying from './screens/NowPlaying';
import Library from './screens/Library';
import PlaybackQueue from './screens/PlaybackQueue';

export type RootStackParamList = {
  Connection: undefined,
  NowPlaying: undefined,
  Library: undefined,
  PlaybackQueue: undefined,
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Connection"
          component={Connection}
          options={{title: 'Connection'}}
        />
        <Stack.Screen name="NowPlaying" component={NowPlaying} />
        <Stack.Screen name="Library" component={Library} />
        <Stack.Screen name="PlaybackQueue" component={PlaybackQueue}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};