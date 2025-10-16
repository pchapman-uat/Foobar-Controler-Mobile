import AppContext from "AppContext";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { items } from "../classes/NavBar";
import { NavigateToType } from "./NavBarScreen";

type NavBarProps = {
	currentScreen: number;
	onNavigate: NavigateToType;
};
const NavBar: React.FC<NavBarProps> = ({ currentScreen, onNavigate }) => {
	const { theme } = useContext(AppContext);
	const Style = useStyles("Navbar");

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
						color={
							currentScreen === index
								? getColor(theme, "textPrimary")
								: getColor(theme, "textDisabled")
						}
					/>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default NavBar;
