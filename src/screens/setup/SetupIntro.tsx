import { useStyles } from "managers/StyleManager";
import React, { Text, View } from "react-native";

export default function SetupIntro() {
	const Styles = useStyles("Main", "Setup");
	return (
		<View style={Styles.Setup.container}>
			<Text style={Styles.Main.header2}>Introduction</Text>
			<Text style={Styles.Main.centeredText}>
				Foobar Controller Mobile is an app that uses the BeefWeb API to allow users
				to control Foobar2000 remotely.
			</Text>
			<Text style={Styles.Main.centeredText}>
				Follow the instructions in this guide to be able to set up the application.
			</Text>
		</View>
	);
}
