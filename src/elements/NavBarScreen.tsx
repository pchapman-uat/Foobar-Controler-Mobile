import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./NavBar";
import React from "react";
import StatusBar from "./Statusbar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useStyles } from "managers/StyleManager";
type NavBarScreenProps = {
	children: React.ReactNode;
	onNavigate: (screen: number) => void;
	currentScreen: number;
	navigator: NativeStackNavigationProp<RootStackParamList, "Home">;
};
const NavBarScreen: React.FC<NavBarScreenProps> = ({
	onNavigate,
	currentScreen,
	children,
	navigator,
}) => {
	const Styles = useStyles("Main");
	return (
		<SafeAreaProvider>
			<SafeAreaView style={Styles.Main.view}>
				<StatusBar navigator={navigator} onNavigate={onNavigate} />
				<React.Fragment>{children}</React.Fragment>

				<NavBar currentScreen={currentScreen} onNavigate={onNavigate} />
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default NavBarScreen;
