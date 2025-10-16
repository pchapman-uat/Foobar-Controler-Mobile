import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import AppContext from "AppContext";
import { ThemeType } from "classes/Themes";
import { useStyles } from "managers/StyleManager";
import { GitHubMark, GitHubMarkWhite } from "managers/SVGManager";
import { getTheme } from "managers/ThemeManager";
import React, { useContext } from "react";
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
			<Text style={Styles.Main.header1}>Foobar Controller Mobile</Text>
			<Text style={Styles.Main.header2}>Version: 0.3.0 - Dev</Text>

			<View>
				<Text style={Styles.Main.centeredText}>
					Foobar Controller Mobile is an app that uses the BeefWeb API to allow users
					to control Foobar2000 remotely.
				</Text>
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
			<Text style={Styles.Main.header2}>Links</Text>
			<View>
				<TouchableOpacity
					onPress={() =>
						Linking.openURL("https://github.com/pchapman-uat/Foobar-Controler-Mobile")
					}
				>
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
