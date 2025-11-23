import {
	createNavigationContainerRef,
	NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppContext, { AppContextType } from "AppContext";
import { ChoiceArrayItems } from "classes/ArrayItems";
import Logger from "classes/Logger";
import Settings, { AppTheme, SettingsDefaults } from "classes/Settings";
import Validator, { Valid } from "classes/Validated";
import AlertModal, { AlertProps } from "elements/AlertModal";
import { useOrientation } from "hooks/useOrientation";
import { useStyles } from "managers/StyleManager";
import { initCustomTheme } from "managers/ThemeManager";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Modal, View } from "react-native";
import { Button } from "react-native-elements";
import AboutScreen from "screens/AboutScreen";
import LogScreen from "screens/LogScreen";
import SettingsScreen from "screens/SettingsScreen";
import Setup from "screens/Setup";
import Home from "./screens/Home";

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
			Settings.set("FIRST_TIME", new Valid(false));
			navigationRef.navigate("Setup");
		};
		const onNo = () => {
			Settings.set("FIRST_TIME", new Valid(false));
		};
		if (value) {
			Logger.log("Application", "First Time!");
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
		Settings.get("USERNAME").then((item) => {
			const validItem = Validator.validate(item);
			if (validItem.isValid()) BeefWeb.setUsername(validItem);
		});
		Settings.get("PASSWORD").then((item) => {
			const validItem = Validator.validate(item);
			if (validItem.isValid()) BeefWeb.setPassword(validItem);
		});

		Settings.get("IP_ADDRESS").then((item) => {
			const validItem = Validator.validate(
				ChoiceArrayItems.init(item) as ChoiceArrayItems<string>,
			);
			if (validItem.isValid()) BeefWeb.setIp(validItem);
		});
		Settings.get("PORT").then((item) => {
			const validItem = Validator.validate(item);
			if (validItem.isValid()) BeefWeb.setPort(validItem);
		});
		Settings.get("AUTOMATIC_UPDATES").then(BeefWeb.setState);
		Settings.get("FIRST_TIME").then(firstTime);
		return () => {
			BeefWeb.setState(false);
		};
	}, []);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState<React.JSX.Element | null>(
		null,
	);
	const [alertModalVisible, setAlertModalVisible] = useState(false);
	const [alertModalProps, setAlertModalProps] = useState<AlertProps>();
	const alert = (props: AlertProps) => {
		setAlertModalProps(props);
		setAlertModalVisible(true);
	};

	const setModal = (content: React.JSX.Element) => {
		setModalContent(content);
		setModalVisible(true);
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
					visible={modalVisible}
					animationType="fade"
					onRequestClose={() => setModalVisible(false)}
				>
					<View style={Styles.Modal.modalOverlay}>
						<View style={Styles.Modal.menu}>
							{modalContent}
							<View>
								<Button title={"Close"} onPress={() => setModalVisible(false)} />
							</View>
						</View>
					</View>
				</Modal>
				<AlertModal
					transparent
					visible={alertModalVisible}
					animationType="fade"
					onRequestClose={() => setAlertModalVisible(false)}
					Styles={Styles}
					alertData={alertModalProps}
				/>
			</NavigationContainer>
		</AppContext.Provider>
	);
}
