import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MainStyle } from "../style/MainStyle";
import NavBar from "./NavBar";
import React from "react";
import StatusBar from "./Statusbar";

type NavBarScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  children?: React.ReactNode;
};

const NavBarScreen: React.FC<NavBarScreenProps> = ({ navigation, children }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={MainStyle.view}>
        <StatusBar/>
        <React.Fragment>
          {children}
        </React.Fragment>

        <NavBar navigation={navigation} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default NavBarScreen;
