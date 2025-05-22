import React from "react";
import { TouchableOpacity, View } from "react-native";
import NavBarStyle from "../style/NavBarStyle";
import { items } from "../App";

type NavBarProps = {
  currentScreen: number;        
  onNavigate: (screen: number) => void;
};

const NavBar: React.FC<NavBarProps> = ({ currentScreen, onNavigate }) => {


  return (
    <View style={NavBarStyle.navBarContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={`nav-${index}`}
          onPress={() => onNavigate(index)}
          style={NavBarStyle.navBarItem}
        >
          <item.icon
            width={NavBarStyle.navBarItem.width}
            height={NavBarStyle.navBarItem.height}
            color={currentScreen === index ? "black" : "gray"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavBar;
