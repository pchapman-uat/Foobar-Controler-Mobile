import AppContext from "AppContext";
import { ChoiceArrayItems } from "classes/ArrayItems";
import { ALL_SETTINGS, ButtonKeys } from "classes/SettingGroups";
import { SettingPropTypes } from "classes/Settings";
import Validator, { Valid } from "classes/Validated";
import SettingsControl from "elements/SettingsControl";
import LottieView from "lottie-react-native";
import { LottieLoading } from "managers/LottiManager";
import { useStyles } from "managers/StyleManager";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { Button } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import { SetupScreenProps } from "screens/Setup";
type AllowedKeys = Exclude<keyof SettingPropTypes, ButtonKeys>;

export default function SetupApplication({
	setReady,
	setOnReady,
}: SetupScreenProps) {
	const Styles = useStyles("Main", "Setup", "Modal");
	const ctx = useContext(AppContext);
	const centeredText = Styles.Main.centeredText;
	const [values, setValues] = useState<
		Partial<Pick<SettingPropTypes, AllowedKeys>>
	>({});

	const [modalVisible, setModalVisible] = useState(false);
	const [scannedIps, setScannedIps] = useState<string[]>([]);
	const [ipAddress, setIpAddress] = useState<string>();
	const onSave = () => {
		const entries = Object.entries(values) as [
			AllowedKeys,
			SettingPropTypes[AllowedKeys],
		][];

		entries.map(([key, value]) => {
			console.log("Setting: ", key, " To: ", value);
			return ctx.Settings.set(key, Validator.validate(value));
		});
	};
	useEffect(() => {
		setOnReady(onSave);
	}, []);
	const setIP = (ip: string) => {
		const validIp = Validator.validate(ip);
		if (validIp.isValid()) {
			ctx.BeefWeb.setConnection(validIp, new Valid(8880));
			ctx.Settings.PROPS.IP_ADDRESS.set(
				new ChoiceArrayItems<string>(validIp.get()),
			);
		}

		setIpAddress(ip);
		setModalVisible(false);
	};
	const startScan = async () => {
		setModalVisible(true);
		const result = await ctx.BeefWeb.findBeefwebServer();
		setScannedIps(result);
	};
	const findBeefwebServers = async () => {
		// TODO: Change Alert to native notification
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

	useEffect(() => {
		console.log(ipAddress);
		if (ipAddress) setReady(true);
		else setReady(false);
	}, [ipAddress]);
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

	return (
		<View style={Styles.Main.container}>
			<Text style={Styles.Main.header2}>Application Setup</Text>
			<View>
				<Text style={centeredText}>
					Please enter the IP Address of the Beefweb Server
				</Text>
				<View style={Styles.Setup.inputView}>
					<Text style={Styles.Setup.inputLabel}>IP Address</Text>
					<TextInput onChangeText={setIP} />
				</View>
			</View>
			<View>
				<Button
					buttonStyle={Styles.Main.button}
					title="Find Beefweb Servers"
					onPress={findBeefwebServers}
				/>
			</View>
			{modal(scannedIps)}
		</View>
	);
}
