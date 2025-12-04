import { useStyles } from "managers/StyleManager";
import { useEffect } from "react";
import React, { Text, View } from "react-native";
import { SetupScreenProps } from "screens/Setup";

export default function SetupIntro({ setReady }: SetupScreenProps) {
	useEffect(() => setReady(true));
	const Styles = useStyles("Main", "Setup");
	return (
		<View style={Styles.Setup.container}>
			<Text style={Styles.Main.header2}>Introduction</Text>
			<Text style={Styles.Main.centeredText}>
				Astro Tune (Previously known as Foobar Controller Mobile) is an app that
				uses the BeefWeb API to allow users to control Foobar2000 and DeaDBeeF
				remotely.
			</Text>
			<Text style={Styles.Main.centeredText}>
				Follow the instructions in this guide to be able to set up the application.
			</Text>
		</View>
	);
}
