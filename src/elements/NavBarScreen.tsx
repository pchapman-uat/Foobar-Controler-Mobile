import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { ItemsType, PagePropsMap } from "classes/NavBar";
import { useStyles } from "managers/StyleManager";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./NavBar";
import StatusBar from "./Statusbar";
export type NavigateToType = <P extends ItemsType>(
	page: P | number,
	props?: PagePropsMap[P],
) => void;
type NavBarScreenProps = {
	children: React.ReactNode;
	navigateTo: NavigateToType;
	currentScreen: number;
	navigator: NativeStackNavigationProp<RootStackParamList, "Home">;
};
const NavBarScreen: React.FC<NavBarScreenProps> = ({
	navigateTo,
	currentScreen,
	children,
	navigator,
}) => {
	const Styles = useStyles("Main");
	return (
		<SafeAreaProvider>
			<SafeAreaView style={Styles.Main.view}>
				<StatusBar navigator={navigator} onNavigate={navigateTo} />
				<React.Fragment>{children}</React.Fragment>

				<NavBar currentScreen={currentScreen} onNavigate={navigateTo} />
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default NavBarScreen;
