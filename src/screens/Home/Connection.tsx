import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View, Alert, TouchableOpacity } from "react-native";
import AppContext from "AppContext";
import { RequestStatus } from "classes/WebRequest";
import { PlayerResponse } from "classes/responses/Player";
import { Button } from "react-native-elements";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import { Modal } from "react-native";
import updateColors, { LottieLoading } from "managers/LottiManager";
import LottieView from "lottie-react-native";

export default function App() {
	const ctx = useContext(AppContext);
	const Styles = useStyles("Main", "Modal");
	const [infoName, setInfoname] = useState<string>("");
	const [infoTitle, setInfoTitle] = useState<string>("");
	const [infoVersion, setInfoVersion] = useState<string>("");
	const [infoPluginVersion, setPluginInfoVersion] = useState<string>("");
	const [modalVisible, setModalVisible] = useState(false);
	const [status, setStatus] = useState<string>("");

	const [ipAddress, setIpAddress] = useState<string>();
	const [scannedIps, setScannedIps] = useState<string[]>([]);

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

	const setIP = (ip: string) => {
		ctx.BeefWeb.setConnection(ip, 8880);
		ctx.Settings.PROPS.IP_ADDRESS.set(ip);
		setIpAddress(ip);
		setModalVisible(false);
	};

	useEffect(() => {
		console.log("Running");
		ctx.BeefWeb.addEventListener(
			"update",
			(response) => response?.data && onConnectSucess(response.data),
		);
	}, []);

	const startScan = async () => {
		setModalVisible(true);
		const result = await ctx.BeefWeb.findBeefwebServer();
		setScannedIps(result);
	};
	const modal = (ips: string[]) => (
		<Modal
			transparent
			visible={modalVisible}
			animationType="fade"
			onRequestClose={() => setModalVisible(false)}
		>
			<TouchableOpacity
				style={Styles.Modal.modalOverlay}
				onPress={() => setModalVisible(false)}
			>
				{ips.length <= 0 && (
					<LottieView
						source={LottieLoading}
						autoPlay
						loop
						style={{ width: 100, height: 100 }}
					/>
				)}
				<View style={Styles.Modal.menu}>
					{ips.map((item, index) => (
						<TouchableOpacity key={"ip-" + index} onPress={() => setIP(item)}>
							<Text style={Styles.Modal.menuItem}>{item}</Text>
						</TouchableOpacity>
					))}
				</View>
			</TouchableOpacity>
		</Modal>
	);
	useEffect(() => {
		updateColors(LottieLoading, getColor(ctx.theme, "buttonPrimary"));
	}, [ctx]);
	const findBeefwebServers = async () => {
		Alert.alert(
			"Find Music Player",
			"This will scan your local Wi-Fi network for a compatible music player. Do you want to continue?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Scan", onPress: () => startScan() },
			],
			{ cancelable: true },
		);
	};

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
				<Text style={Styles.Main.statusItem}>IP: {ipAddress}</Text>
			</View>
			<Button
				buttonStyle={Styles.Main.button}
				title="Connect to Beefweb"
				onPress={connectToBeefweb}
			/>
			<Button
				buttonStyle={Styles.Main.button}
				title="Find Beefweb Servers"
				onPress={findBeefwebServers}
			/>
			{modal(scannedIps)}
		</View>
	);
}
