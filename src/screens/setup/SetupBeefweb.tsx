import CodeText from "elements/CodeText";
import List from "elements/List";
import { useStyles } from "managers/StyleManager";
import { useEffect } from "react";
import React, { Linking, Text, View } from "react-native";
import { SetupScreenProps } from "screens/Setup";
export default function SetupBeefweb({ setReady }: SetupScreenProps) {
	useEffect(() => setReady(true));
	const Styles = useStyles("Main", "Setup");
	const centeredText = Styles.Main.centeredText;
	const hyperlink = Styles.Main.hyperlink;

	return (
		<View style={Styles.Setup.container}>
			<Text style={Styles.Main.header2}>Beefweb Setup</Text>
			<View>
				<Text style={centeredText}>
					1. Download the latest version of the{" "}
					<Text
						style={hyperlink}
						onPress={() =>
							Linking.openURL("https://github.com/hyperblast/beefweb/releases")
						}
					>
						BeefWeb fb2k-component
					</Text>{" "}
					(Version 0.10 was used for testing)
				</Text>
				<View style={Styles.Setup.spacer}></View>
				<Text style={centeredText}>
					2. Open Foobar2000, choose file, then preferences (or ctrl+p), press the
					install component button. Once pressed, choose the BeefWeb component and
					install it. Foobar2000 will require a restart
				</Text>
				<View style={Styles.Setup.spacer}></View>
				<Text style={centeredText}>
					3. After restart go to the preferences, then tools, then Beefweb Remote
					Control. Set the following settings:
				</Text>
				<List
					type={"unordered"}
					items={[
						"Port: 8880 (This can not be changed at the moment)",
						"Allow remote connections: ☑",
						"Music Directories: Add all directories",
						"Require Authentication: ☐ (Authentication is not supported as of v0.1.0 and will break if enabled)",
					]}
				/>
				<View style={Styles.Setup.spacer}></View>
				<Text style={centeredText}>
					4. Go to Tools → Beefweb Remote Control → Permissions and enabled the
					following:
				</Text>
				<List
					type={"unordered"}
					items={[
						"Changing Playlists: ☑",
						"Changing Output Device: ☐ (Not supported in v0.1.0, enabling will not break)",
						"Changing Default Web Interface: ☐ (Not supported in v0.1.0, enabling will not break)",
					]}
				/>
				<View style={Styles.Setup.spacer}></View>
				<Text style={centeredText}>
					5. Open your foobar2000 application directory (such as
					%APPDATA%\foobar2000-v2), then navigate to profile → beefweb
				</Text>
				<View style={Styles.Setup.spacer}></View>
				<Text style={centeredText}>6. Create a new file called config.json</Text>
				<Text style={centeredText}>
					Note: Do NOT put the config.json inside clientconfig, as this will not
					work. (as of Beefweb v0.10)
				</Text>
				<View style={Styles.Setup.spacer}></View>
				<Text style={centeredText}>
					Open config.json in a text editor and add the following:
				</Text>
				<CodeText
					code={`{
    "responseHeaders": {
        "Access-Control-Allow-Origin": "*"
    }
}
`}
				/>
				{/* TODO: Add Warning Message about Cross Orgin */}
			</View>
		</View>
	);
}
