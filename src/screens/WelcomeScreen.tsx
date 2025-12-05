import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PlayerType, RootStackParamList } from "App";
import AppContext from "AppContext";
import { Valid } from "classes/Validated";
import { useStyles } from "managers/StyleManager";
import { useContext } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { AboutInformation } from "./AboutScreen";

type WelcomeNavigationProps = NativeStackNavigationProp<
	RootStackParamList,
	"Welcome"
>;
type WelcomeProps = {
	navigation: WelcomeNavigationProps;
};

export default function WelcomeScreen({ navigation }: WelcomeProps) {
	const Styles = useStyles("Main");
	const ctx = useContext(AppContext);
	const onNavigate = (path: PlayerType | "Manual") => {
		ctx.Settings.set("FIRST_TIME", new Valid(false));
		if (path === "Manual") navigation.navigate("Home");
		else navigation.navigate("Setup", { player: path });
	};
	return (
		<SafeAreaView style={Styles.Main.containerBlock}>
			<AboutInformation />
			<View style={Styles.Main.spacer}></View>
			<View>
				<Text style={Styles.Main.header2}>First Time</Text>
				<Text style={Styles.Main.centeredText}>
					Since this is your first time, would you like a guide to set up the
					application?
				</Text>
				<View
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-around",
						flexWrap: "wrap",
					}}
				>
					<Button
						style={Styles.Main.button}
						title={"Setup Foobar2000"}
						onPress={() => onNavigate("Foobar2000")}
					/>
					<Button
						style={Styles.Main.button}
						title={"Setup DeaDBeef"}
						onPress={() => onNavigate("DeaDBeeF")}
					/>
					<Button
						style={Styles.Main.button}
						title={"Setup Manually"}
						onPress={() => onNavigate("Manual")}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
