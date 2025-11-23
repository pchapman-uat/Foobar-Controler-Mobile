import AppContext from "AppContext";
import { NavBarItemProps } from "classes/NavBar";
import { RequestStatus } from "classes/WebRequest";
import { PlayerResponse } from "classes/responses/Player";
import { useLogger } from "helpers/index";
import updateColors, { LottieLoading } from "managers/LottieManager";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";

export default function Connection({}: NavBarItemProps<"Connection">) {
	const ctx = useContext(AppContext);
	const Styles = useStyles("Main", "Modal");
	const [infoName, setInfoName] = useState<string>("");
	const [infoTitle, setInfoTitle] = useState<string>("");
	const [infoVersion, setInfoVersion] = useState<string>("");
	const [infoPluginVersion, setInfoPluginVersion] = useState<string>("");
	const [status, setStatus] = useState<string>("");
	const logger = useLogger("Connection Screen");
	const connectToBeefweb = useCallback(async () => {
		setStatus("Connecting... Please Wait");
		const response = await ctx.BeefWeb.getPlayer();
		if (!response || response.status != RequestStatus.OK)
			onConnectFail(response?.status);
		else onConnectSuccess(response.data);
	}, [ctx]);

	const onConnectSuccess = (response: PlayerResponse) => {
		logger.log("Successfully connected to Beefweb");
		setStatus("Connected!");
		setInfoName(response.info.name);
		setInfoTitle(response.info.title);
		setInfoVersion(response.info.version);
		setInfoPluginVersion(response.info.pluginVersion);
	};

	const onConnectFail = (status?: RequestStatus) => {
		if (status)
			logger.error(`Failed to connect to Beefweb with error code: ${status}`);
		else
			logger.error(
				`Failed to get a response from Beefweb, please check your internet connection`,
			);
		setStatus("Failed");
	};

	useEffect(() => {
		ctx.BeefWeb.addEventListener(
			"update",
			(response) => response?.data && onConnectSuccess(response.data),
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
