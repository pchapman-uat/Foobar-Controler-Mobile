import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useRef, useEffect } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { RootStackParamList } from "App";
import { items } from "classes/NavBar";
import NavBarScreen from "elements/NavBarScreen";

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>
type HomeProps = {
  navigation: HomeNavigationProp
}
export default () =>{
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
     
  )
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});