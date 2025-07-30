import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import AppContext from "AppContext";
import { RequestStatus } from "classes/WebRequest";
import { PlayerResponse } from "classes/responses/Player";
import { Button } from "react-native-elements";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import updateColors, { LottieLoading } from "managers/LottiManager";

export default function App() {
	const ctx = useContext(AppContext);
	const Styles = useStyles("Main", "Modal");
	const [infoName, setInfoname] = useState<string>("");
	const [infoTitle, setInfoTitle] = useState<string>("");
	const [infoVersion, setInfoVersion] = useState<string>("");
	const [infoPluginVersion, setPluginInfoVersion] = useState<string>("");
	const [status, setStatus] = useState<string>("");

	const connectToBeefweb = useCallback(async () => {
		setStatus("Connecting... Please Wait");
		const response = await ctx.BeefWeb.getPlayer();
		console.log(response);
		if (!response || response.status != RequestStatus.OK) onConnectFail();
		else onConnectSucess(response.data);
	}, [ctx]);

	const onConnectSucess = (response: PlayerResponse) => {
		setStatus("Connected!");
		setInfoname(response.info.name);
		setInfoTitle(response.info.title);
		setInfoVersion(response.info.version);
		setPluginInfoVersion(response.info.pluginVersion);
	};

	const onConnectFail = () => {
		setStatus("Failed");
	};

	useEffect(() => {
		console.log("Running");
		ctx.BeefWeb.addEventListener(
			"update",
			(response) => response?.data && onConnectSucess(response.data),
		);
	}, []);

	useEffect(() => {
		updateColors(LottieLoading, getColor(ctx.theme, "buttonPrimary"));
	}, [ctx]);

	return (
		<View style={Styles.Main.container}>
			<View>
				<Text style={Styles.Main.statusItem}>Status: {status}</Text>
				<Text style={Styles.Main.statusItem}>Name: {infoName}</Text>
				<Text style={Styles.Main.statusItem}>Title: {infoTitle}</Text>
				<Text style={Styles.Main.statusItem}>Version: {infoVersion}</Text>
				<Text style={Styles.Main.statusItem}>
					Plugin Version: {infoPluginVersion}
				</Text>
			</View>
			<Button
				buttonStyle={Styles.Main.button}
				title="Connect to Beefweb"
				onPress={connectToBeefweb}
			/>
		</View>
	);
}
