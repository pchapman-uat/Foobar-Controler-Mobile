import PlayerDependentSetup from "elements/PlayerDependentSetup";
import { StyleMapType, useStyles } from "managers/StyleManager";
import { useEffect } from "react";
import React, { Linking, Text, View } from "react-native";
import { SetupScreenProps } from "screens/Setup";

export default function SetupPlayer({
	setReady,
	player = "Foobar2000",
}: SetupScreenProps) {
	useEffect(() => setReady(true));
	const Styles = useStyles("Main", "Setup");
	return (
		<PlayerDependentSetup player={player} Styles={Styles}>
			<SetupFoobar Styles={Styles} />
			<SetupDeadBeef Styles={Styles} />
		</PlayerDependentSetup>
	);
}

type PlayerProps = {
	Styles: Pick<StyleMapType, "Main" | "Setup">;
};
function SetupDeadBeef({ Styles }: PlayerProps) {
	const centeredText = Styles.Main.centeredText;
	const hyperlink = Styles.Main.hyperlink;
	return (
		<>
			<Text style={Styles.Main.header2}>DeaDBeeF Setup</Text>
			<View>
				<Text style={centeredText}>
					1. Download the latest version of{" "}
					<Text
						style={hyperlink}
						onPress={() => Linking.openURL("https://deadbeef.sourceforge.io")}
					>
						DeaDBeeF
					</Text>
					. Version 1.9.6 was used; other versions may not work.
				</Text>
				<View style={Styles.Main.spacer}></View>
				<Text style={centeredText}>2. Run the installation of DeaDBeef.</Text>
			</View>
		</>
	);
}
function SetupFoobar({ Styles }: PlayerProps) {
	const centeredText = Styles.Main.centeredText;
	const hyperlink = Styles.Main.hyperlink;
	return (
		<>
			<Text style={Styles.Main.header2}>Foobar2000 Setup</Text>
			<View>
				<Text style={centeredText}>
					1. Download the latest version of{" "}
					<Text
						style={hyperlink}
						onPress={() => Linking.openURL("https://www.foobar2000.org")}
					>
						Foobar2000
					</Text>
					. Version 2.24.5 was used; other versions may not work.
				</Text>
				<View style={Styles.Main.spacer}></View>
				<Text style={centeredText}>
					2. Run the installation of Foobar2000, either a full installation or a
					portable one; both will work. (Portable was used for testing)
				</Text>
			</View>
		</>
	);
}
