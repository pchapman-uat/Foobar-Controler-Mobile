import { useStyles } from "managers/StyleManager";
import React, { Linking, Text, View } from "react-native";

export default function SetupFoobar() {
	const Styles = useStyles("Main", "Setup");
	const centeredText = Styles.Main.centeredText;
	const hyperlink = Styles.Main.hyperlink;
	return (
		<View style={Styles.Setup.container}>
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
				<View style={Styles.Setup.spacer}></View>
				<Text style={centeredText}>
					2. Run the installation of Foobar2000, either a full installation or a
					portable one; both will work. (Portable was used for testing)
				</Text>
			</View>
		</View>
	);
}
