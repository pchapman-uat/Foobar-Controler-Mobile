import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useRef, useEffect, useContext } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { RootStackParamList } from "App";
import { items } from "classes/NavBar";
import NavBarScreen from "elements/NavBarScreen";
import AppContext from "AppContext";

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
type HomeProps = {
	navigation: HomeNavigationProp;
};
export default ({ navigation }: HomeProps) => {
	const [currentScreen, setCurrentScreen] = useState<number>(0);
	const [prevScreen, setPrevScreen] = useState<number | null>(null);

	const screenTranslateX = useRef(new Animated.Value(0)).current;

	const screenWidth = Dimensions.get("window").width;
	const ctx = useContext(AppContext);
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
	useEffect(() => {
		ctx.Settings.get("DEFAULT_SCREEN").then((item) => {
			if (typeof item == "number") setCurrentScreen(item);
		});
	}, []);
	let ScreenComponent = items[currentScreen].screen;
	return (
		<NavBarScreen
			onNavigate={setCurrentScreen}
			currentScreen={currentScreen}
			navigator={navigation}
		>
			<Animated.View
				style={[
					styles.screenContainer,
					{ transform: [{ translateX: screenTranslateX }] },
				]}
			>
				<ScreenComponent />
			</Animated.View>
		</NavBarScreen>
	);
};
const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
	},
});
