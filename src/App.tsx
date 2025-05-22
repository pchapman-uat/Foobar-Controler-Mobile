import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import Connection from './screens/Connection';
import NowPlaying from './screens/NowPlaying';
import Library from './screens/Library';
import PlaybackQueue from './screens/PlaybackQueue';
import NavBarScreen from './elements/NavBarScreen';
import { SvgProps } from 'react-native-svg';
import {
  ConnectionSVG,
  LibrarySVG,
  NowPlayingSVG,
  PlaybackQueueSVG,
} from "./managers/SVGManager";


export type ScreenName = 'Connection' | 'NowPlaying' | 'Library' | 'PlaybackQueue';

type Icon = React.FC<SvgProps>;

class NavBarItem {
  icon: Icon;
  location: ScreenName;
  screen: () => React.JSX.Element
  constructor(icon: Icon, location: ScreenName, screen: () => React.JSX.Element ) {
    this.icon = icon;
    this.location = location;
    this.screen = screen;
  }
}


export const items = [
    new NavBarItem(ConnectionSVG, "Connection", Connection),
    new NavBarItem(LibrarySVG, "Library", Library),
    new NavBarItem(NowPlayingSVG, "NowPlaying", NowPlaying),
    new NavBarItem(PlaybackQueueSVG, "PlaybackQueue", PlaybackQueue),
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [prevScreen, setPrevScreen] = useState<number | null>(null);

  const screenTranslateX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (prevScreen === null) {
      setPrevScreen(currentScreen);
      return;
    }
    const direction = currentScreen > prevScreen ? 1 : -1;

    screenTranslateX.setValue(direction * screenWidth);

    Animated.timing((screenTranslateX), {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setPrevScreen(currentScreen);
  }, [currentScreen]);

  let ScreenComponent = items[currentScreen].screen;

  return (
    <NavBarScreen onNavigate={setCurrentScreen} currentScreen={currentScreen}>
      <Animated.View style={[styles.screenContainer, { transform: [{ translateX: screenTranslateX }] }]}>
        <ScreenComponent />
      </Animated.View>
    </NavBarScreen>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});
