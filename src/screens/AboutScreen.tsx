import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import AppContext from "AppContext";
import { ThemeType } from "classes/Themes";
import { APP_NAME, APP_VERSION, REPO_URL } from "constants/constants";
import { useStyles } from "managers/StyleManager";
import { GitHubMark, GitHubMarkWhite } from "managers/SVGManager";
import { getTheme } from "managers/ThemeManager";
import { useContext } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

type AboutNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"About"
>;
type AboutProps = {
	navigation: AboutNavigationProp;
};

export default function AboutScreen({ navigation }: AboutProps) {
	const { theme } = useContext(AppContext);
	const Styles = useStyles("Main");
	return (
		<SafeAreaView style={Styles.Main.container}>
			<View>
				<Button
					buttonStyle={Styles.Main.button}
					title="Back"
					onPress={navigation.goBack}
				/>
			</View>
			<AboutInformation />
			<Text style={Styles.Main.header2}>Links</Text>
			<View>
				<TouchableOpacity onPress={() => Linking.openURL(REPO_URL)}>
					{getTheme(theme).type == ThemeType.Light ? (
						<GitHubMark />
					) : (
						<GitHubMarkWhite />
					)}
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

export function AboutInformation() {
	const Styles = useStyles("Main");
	return (
		<>
			<Text style={Styles.Main.header1}>{APP_NAME}</Text>
			<Text style={Styles.Main.header2}>Version: {APP_VERSION}</Text>

			<View>
				<Text style={Styles.Main.centeredText}>
					Astro Tune (Previously known as Foobar Controller Mobile) is an app that
					uses the BeefWeb API to allow users to control Foobar2000 and DeaDBeeF
					remotely.
				</Text>
				<View style={Styles.Main.spacer} />
				<Text style={Styles.Main.centeredText}>
					{
						"This project was created for Preston Chapman's Student Innovation Project (SIP) at the University of Advancing Technology (UAT). The SIP is UAT's equivalent of a master's thesis; all students graduating with a bachelor'sdegree are required to innovate and create a product. For more information, view "
					}
					<Text
						style={Styles.Main.hyperlink}
						onPress={() =>
							Linking.openURL("https://www.uat.edu/student-innovation-projects")
						}
					>
						https://www.uat.edu/student-innovation-projects
					</Text>
					.
				</Text>
				<View style={Styles.Main.spacer}></View>
				<Text style={Styles.Main.centeredText}>
					UAT does not own this project; however, it has been granted a
					non-exclusive, royalty-free license to use, copy, display, describe,
					mark-on, modify, retain, or make other use of the student’s work. For more
					information, view{" "}
					<Text
						style={Styles.Main.hyperlink}
						onPress={() => Linking.openURL("https://www.uat.edu/catalog")}
					>
						https://www.uat.edu/catalog
					</Text>
					.
				</Text>
			</View>
		</>
	);
}
