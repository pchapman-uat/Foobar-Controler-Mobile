import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MainStyle } from "../style/MainStyle";
import NavBar from "./NavBar";
import React from "react";
import StatusBar from "./Statusbar";
type NavBarScreenProps = {
  children: React.ReactNode;
  onNavigate: (screen: number) => void;
  currentScreen: number;
};
const NavBarScreen: React.FC<NavBarScreenProps> = ({onNavigate, currentScreen, children}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={MainStyle.view}>
        <StatusBar/>
        <React.Fragment>
          {children}
        </React.Fragment>

        <NavBar currentScreen={currentScreen} onNavigate={onNavigate}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default NavBarScreen;
