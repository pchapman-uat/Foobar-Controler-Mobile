import React, { useEffect, useMemo, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import SettingsScreen from "screens/SettingsScreen";
import Settings, { AppTheme, SettingsDefaults } from "classes/Settings";
import AppContext, { AppContextType } from "AppContext";
import AlertModal, { AlertProps } from "elements/AlertModal";
import { useOrientation } from "hooks/useOrientation";
import BeefWeb from "classes/BeefWeb";
import AboutScreen from "screens/AboutScreen";
import { initCustomTheme } from "managers/ThemeManager";
import Setup from "screens/Setup";
import { Modal, View } from "react-native";
import { useStyles } from "managers/StyleManager";
import { Button } from "react-native-elements";

export type RootStackParamList = {
	Home: undefined;
	Settings: undefined;
	About: undefined;
	Setup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const [theme, setTheme] = useState<AppTheme>(SettingsDefaults.THEME);
	const orientation = useOrientation();

	// Set the theme from settings once on mount
	useEffect(() => {}, []);

	useEffect(() => {
		Settings.PROPS.THEME.get().then(setTheme);
		Settings.get("CUSTOM_THEME").then(initCustomTheme);

		// Beefweb Init

		Settings.PROPS.AUTOMATIC_UPDATES.get().then(BeefWeb.setState);
		Settings.get("AUTHENTICATION").then(BeefWeb.setAuthenticationEnabled);
		Settings.get("USERNAME").then(BeefWeb.setUsername);
		Settings.get("PASSWORD").then(BeefWeb.setPassword);
		Settings.get("IP_ADDRESS").then(BeefWeb.setIp);
		Settings.get("PORT").then(BeefWeb.setPort);

		return () => {
			BeefWeb.setState(false);
		};
	}, []);
	const [modalVisable, setModalVisable] = useState(false);
	const [modalContent, setModalContent] = useState<React.JSX.Element | null>(
		null,
	);
	const [alertModalVisable, setAlertModalVisable] = useState(false);
	const [alertModalProps, setAlertModalProps] = useState<AlertProps>();
	const alert = (props: AlertProps) => {
		setAlertModalProps(props);
		setAlertModalVisable(true);
	};

	const setModal = (content: React.JSX.Element) => {
		console.log("Setting Modal");
		console.log(content);
		setModalContent(content);
		setModalVisable(true);
	};
	const contextValue = useMemo<AppContextType>(
		() => ({
			BeefWeb: BeefWeb,
			Settings: Settings,
			theme,
			setTheme,
			orientation,
			setModal,
			alert,
		}),
		[theme, orientation, setModal, alert],
	);
	const Styles = useStyles("Main", "Modal");
	return (
		<AppContext.Provider value={contextValue}>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Home" component={Home} />
					<Stack.Screen name="Settings" component={SettingsScreen} />
					<Stack.Screen name="About" component={AboutScreen} />
					<Stack.Screen name="Setup" component={Setup} />
				</Stack.Navigator>
				<Modal
					transparent
					visible={modalVisable}
					animationType="fade"
					onRequestClose={() => setModalVisable(false)}
				>
					<View style={Styles.Modal.modalOverlay}>
						<View style={Styles.Modal.menu}>
							{modalContent}
							<View>
								<Button title={"Close"} onPress={() => setModalVisable(false)} />
							</View>
						</View>
					</View>
				</Modal>
				<AlertModal
					transparent
					visible={alertModalVisable}
					animationType="fade"
					onRequestClose={() => setAlertModalVisable(false)}
					Styles={Styles}
					alertData={alertModalProps}
				/>
			</NavigationContainer>
		</AppContext.Provider>
	);
}
