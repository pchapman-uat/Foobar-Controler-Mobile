import AppContext from "AppContext";
import React, { useState, useRef, useContext, useEffect } from "react";
import { Animated, Dimensions, View, Text, ScrollView } from "react-native";
import SetupIntro from "./setup/SetupIntro";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStyles } from "managers/StyleManager";
import { Button } from "react-native-elements";
import SetupFoobar from "./setup/SetupFoobar";
import SetupBeefweb from "./setup/SetupBeefweb";
import SetupApplication from "./setup/SetupApplication";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";

class SetupStep {
	name: string;
	screen: () => React.JSX.Element;
	constructor(name: string, screen: () => React.JSX.Element) {
		this.name = name;
		this.screen = screen;
	}
}
const items: SetupStep[] = [
	new SetupStep("Intro", SetupIntro),
	new SetupStep("Foobar", SetupFoobar),
	new SetupStep("Beefweb", SetupBeefweb),
	new SetupStep("Beefweb", SetupApplication),
];
type SetupNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Settings"
>;
type SetupProps = {
	navigation: SetupNavigationProp;
};
export default function Setup({ navigation }: SetupProps) {
	const [currentScreen, setCurrentScreen] = useState<number>(0);
	const [prevScreen, setPrevScreen] = useState<number | null>(null);

	const screenTranslateX = useRef(new Animated.Value(0)).current;

	const screenWidth = Dimensions.get("window").width;
	const ctx = useContext(AppContext);
	const Styles = useStyles("Main", "Setup");
	useEffect(() => {
		if (prevScreen === null) {
			setPrevScreen(currentScreen);
			return;
		}
		const direction = currentScreen > prevScreen ? 1 : -1;

		screenTranslateX.setValue(direction * screenWidth);

		Animated.timing(screenTranslateX, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();

		setPrevScreen(currentScreen);
	}, [currentScreen]);

	const onNavigation = (direction: "back" | "next", current: number) => {
		const newCurrent = direction == "back" ? current - 1 : current + 1;
		if (newCurrent < 0 || newCurrent >= items.length) navigation.goBack();
		else setCurrentScreen(newCurrent);
	};

	const screenItem = items[currentScreen];
	return (
		<SafeAreaView>
			<View style={Styles.Setup.header}>
				<Text style={Styles.Setup.headerText}>
					{screenItem.name} - {currentScreen + 1}/{items.length}
				</Text>
			</View>
			<ScrollView>
				<screenItem.screen />
				<View>
					<Button
						title={"Back"}
						onPress={() => onNavigation("back", currentScreen)}
					/>
					<Button
						title={"Next"}
						onPress={() => onNavigation("next", currentScreen)}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
