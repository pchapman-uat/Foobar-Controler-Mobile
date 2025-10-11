import React, { useContext, useEffect, useMemo, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	createNavigationContainerRef,
	NavigationContainer,
} from "@react-navigation/native";
import Home from "./screens/Home";
import SettingsScreen from "screens/SettingsScreen";
import Settings, { AppTheme, SettingsDefaults } from "classes/Settings";
import AppContext, { AppContextType } from "AppContext";
import AlertModal, { AlertProps } from "elements/AlertModal";
import { useOrientation } from "hooks/useOrientation";
import AboutScreen from "screens/AboutScreen";
import { initCustomTheme } from "managers/ThemeManager";
import Setup from "screens/Setup";
import { Modal, View } from "react-native";
import { useStyles } from "managers/StyleManager";
import { Button } from "react-native-elements";
import LogScreen from "screens/LogScreen";
import Logger from "classes/Logger";
import {
	ArrayItemType,
	ChoiceArrayItems,
	ChoiceArrayItemsJSON,
} from "classes/ArrayItems";

export type RootStackParamList = {
	Home: undefined;
	Settings: undefined;
	About: undefined;
	Setup: undefined;
	Log: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
	const [theme, setTheme] = useState<AppTheme>(SettingsDefaults.THEME);
	const orientation = useOrientation();
	const { BeefWeb } = useContext(AppContext);
	const firstTime = (value: boolean) => {
		const onYes = () => {
			console.log(navigationRef);
			Settings.set("FIRST_TIME", false);
			navigationRef.navigate("Setup");
		};
		const onNo = () => {
			Settings.set("FIRST_TIME", false);
		};
		if (value) {
			console.log("First Time!");
			alert({
				title: "Welcome!",
				message:
					"This is your first time using the application, would you like to go through the setup process?",
				options: [
					{ optionText: "No", onPress: onNo },
					{ optionText: "Yes", onPress: onYes },
				],
			});
		}
	};
	useEffect(() => {
		Settings.PROPS.THEME.get().then(setTheme);
		Settings.get("CUSTOM_THEME").then(initCustomTheme);

		// Beefweb Init

		Settings.PROPS.AUTOMATIC_UPDATES.get().then(BeefWeb.setState);
		Settings.get("AUTHENTICATION").then(BeefWeb.setAuthenticationEnabled);
		Settings.get("USERNAME").then(BeefWeb.setUsername);
		Settings.get("PASSWORD").then(BeefWeb.setPassword);

		Settings.get("IP_ADDRESS").then((item) =>
			BeefWeb.setIp(ChoiceArrayItems.init(item) as ChoiceArrayItems<string>),
		);
		Settings.get("PORT").then(BeefWeb.setPort);
		Settings.get("FIRST_TIME").then(firstTime);
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
			Logger,
		}),
		[theme, orientation, setModal, alert],
	);
	const Styles = useStyles("Main", "Modal");
	return (
		<AppContext.Provider value={contextValue}>
			<NavigationContainer ref={navigationRef}>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Home" component={Home} />
					<Stack.Screen name="Settings" component={SettingsScreen} />
					<Stack.Screen name="About" component={AboutScreen} />
					<Stack.Screen name="Setup" component={Setup} />
					<Stack.Screen name="Log" component={LogScreen} />
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
