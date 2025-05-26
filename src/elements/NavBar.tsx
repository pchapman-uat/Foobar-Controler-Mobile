import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import NavBarStyle from "../style/NavBarStyle";
import { items,  } from "../classes/NavBar";
import ThemeContext from "ThemeContext";
import { createStyle } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";

type NavBarProps = {
  currentScreen: number;        
  onNavigate: (screen: number) => void;
};
const NavBar: React.FC<NavBarProps> = ({ currentScreen, onNavigate }) => {
  const {theme} = useContext(ThemeContext);
  const Style = createStyle(theme, 'Navbar')

  return (
    <View style={Style.Navbar.navBarContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={`nav-${index}`}
          onPress={() => onNavigate(index)}
          style={Style.Navbar.navBarItem}
        >
          <item.icon
            width={Style.Navbar.navBarItem.width}
            height={Style.Navbar.navBarItem.height}
            color={currentScreen === index ? getColor(theme, 'textPrimary') : getColor(theme, 'textDisabled')}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavBar;
