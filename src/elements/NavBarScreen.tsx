import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./NavBar";
import React, { useContext } from "react";
import StatusBar from "./Statusbar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import ThemeContext from "ThemeContext";
import { createStyle } from "managers/StyleManager";
type NavBarScreenProps = {
  children: React.ReactNode;
  onNavigate: (screen: number) => void;
  currentScreen: number;
  navigator:NativeStackNavigationProp<RootStackParamList, 'Home'>
};
const NavBarScreen: React.FC<NavBarScreenProps> = ({onNavigate, currentScreen, children, navigator}) => {
  const {theme} = useContext(ThemeContext);
  const Styles = createStyle(theme, 'Main')
  return (
    <SafeAreaProvider>
      <SafeAreaView style={Styles.Main.view}>
        <StatusBar navigator={navigator}/>
        <React.Fragment>
          {children}
        </React.Fragment>

        <NavBar currentScreen={currentScreen} onNavigate={onNavigate}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default NavBarScreen;
