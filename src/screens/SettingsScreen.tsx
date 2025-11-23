import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import AppContext from "AppContext";
import SettingGroups, {
	ButtonKeys,
	Group,
	GroupItem,
	GroupTypes,
	SettingType,
} from "classes/SettingGroups";
import { SettingPropTypes, SettingsDefaults } from "classes/Settings";
import { Color, CustomTheme, Theme } from "classes/Themes";
import Validator from "classes/Validated";
import ColorPickers, { ColorPickerOptions } from "elements/ColorPickers";
import SettingsControl, { ButtonControl } from "elements/SettingsControl";
import { isPrimitive, useLogger } from "helpers/index";
import { useStyles } from "managers/StyleManager";
import { InfoSVG } from "managers/SVGManager";
import { getColor, initCustomTheme } from "managers/ThemeManager";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorFormatsObject } from "reanimated-color-picker";

type SettingsNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Settings"
>;
type SettingsProps = {
	navigation: SettingsNavigationProp;
};
type AllowedKeys = Exclude<keyof SettingPropTypes, ButtonKeys>;
export default function SettingsScreen({ navigation }: SettingsProps) {
	const Styles = useStyles("Main", "Settings", "Library", "Modal");
	const ctx = useContext(AppContext);

	const [values, setValues] = useState<
		Partial<Pick<SettingPropTypes, AllowedKeys>>
	>({});
	const [loaded, setLoaded] = useState(false);
	const [settingIndex, setSettingIndex] = useState<number>();

	const [colorModalVisible, setColorModalVisible] = useState(false);
	const [selectedColorKey, setSelectedColorKey] = useState<keyof Theme>();
	const [selectedColor, setSelectedColor] = useState<ColorFormatsObject>();
	const [customTheme, setCustomTheme] = useState<CustomTheme>();
	const [infoHeading, setInfoHeading] = useState("");
	const [infoText, setInfoText] = useState("");
	const [infoModalVisible, setInfoModalVisible] = useState(false);
	const [infoDefaultValue, setInfoDefaultValue] = useState("");
	const logger = useLogger("Settings Screen");
	const onSave = async () => {
		const entries = Object.entries(values) as [
			AllowedKeys,
			SettingPropTypes[AllowedKeys],
		][];

		try {
			entries.forEach(([key, value]) => {
				logger.log(`Setting: ${key} To: ${value}`);
				ctx.Settings.set(key, Validator.validate(value));
			});

			if (values.THEME != null) {
				ctx.setTheme(values.THEME);
			}
			if (values.CUSTOM_THEME != null && customTheme != null) {
				initCustomTheme(customTheme);
			}
			if (values.IP_ADDRESS) {
				const validIP = Validator.validate(values.IP_ADDRESS);
				if (validIP.isValid()) ctx.BeefWeb.setIp(validIP);
			}
			if (values.PORT) {
				const validPort = Validator.validate(values.PORT);
				if (validPort.isValid()) ctx.BeefWeb.setPort(validPort);
			}
		} catch (error) {
			if (error instanceof Error) logger.log(error.message);
			else logger.log("Unknown Error Occurred");
		}
		navigation.goBack();
	};

	useEffect(() => {
		(async () => {
			const entries = await Promise.all(
				(Object.keys(SettingsDefaults) as (keyof SettingPropTypes)[])
					.filter((key) => typeof SettingsDefaults[key] !== "function")
					.map(async (key) => {
						const value = await ctx.Settings.get(key);
						return [key, value] as const;
					}),
			);

			setValues(Object.fromEntries(entries));
			setLoaded(true);
		})();
	}, []);
	const onInfoPress = (text: string, heading: string, defaultValue: unknown) => {
		setInfoText(text);
		setInfoHeading(heading);
		setInfoModalVisible(true);
		if (isPrimitive(defaultValue)) {
			const value = defaultValue.toString();
			setInfoDefaultValue(value === "" ? "None" : value);
		} else {
			setInfoDefaultValue("Unable to show default");
		}
	};
	const renderItem = useCallback(
		(item: GroupItem<keyof SettingPropTypes, SettingType>, index: number) => (
			<View
				style={[
					Styles.Library[index % 2 === 0 ? "rowEven" : "rowOdd"],
					Styles.Settings.itemView,
				]}
				key={index}
			>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<Text style={Styles.Settings.itemLabel}>{item.NAME}</Text>
					<TouchableOpacity
						onPress={() =>
							onInfoPress(
								item.getDescription(),
								`${item.NAME} - (${item.getType()})`,
								item.getDefault(ctx.Settings),
							)
						}
					>
						<InfoSVG
							color={getColor(ctx.theme, "buttonPrimary")}
							width={15}
							height={15}
						/>
					</TouchableOpacity>
				</View>

				{!item.isButton() ? (
					<SettingsControl
						item={item}
						value={values[item.KEY as AllowedKeys]}
						Styles={Styles}
						ctx={ctx}
						onSet={(newVal) => setValues((prev) => ({ ...prev, [item.KEY]: newVal }))}
						customThemeProps={{
							setSelectedColorKey,
							selectedColorKey,
							setSelectedColor,
							selectedColor,
							setCustomTheme,
							customTheme,
							setColorModalVisible: setColorModalVisible,
							colorModalVisible: colorModalVisible,
						}}
					/>
				) : (
					<ButtonControl
						item={item}
						Styles={Styles}
						ctx={ctx}
						onSet={ctx.setModal}
					/>
				)}
			</View>
		),
		[loaded],
	);
	const renderGroup = (group: Group<GroupTypes>, index: number) => {
		const onPress = () => {
			setSettingIndex(index);
		};
		return (
			<TouchableOpacity
				style={[
					Styles.Library[index % 2 === 0 ? "rowEven" : "rowOdd"],
					Styles.Settings.itemView,
				]}
				key={index}
				onPress={onPress}
			>
				<Text style={Styles.Settings.itemLabel}>
					{group.NAME} - {group.ITEMS.length}
				</Text>
			</TouchableOpacity>
		);
	};
	const groupSelector = () => {
		return <ScrollView>{SettingGroups.GROUPS.map(renderGroup)}</ScrollView>;
	};

	const groupSettings = (groupIndex: number) =>
		SettingGroups.GROUPS[groupIndex].ITEMS.map(renderItem);

	const onColorSave = (
		customTheme: CustomTheme,
		key: keyof Theme,
		value: ColorFormatsObject,
	) => {
		customTheme.set(key, Color.fromHex(value.hex));
		setValues((prev) => ({ ...prev, CUSTOM_THEME: customTheme }));
		onColorClose();
	};
	const onColorClose = () => {
		setColorModalVisible(false);
		setSelectedColor(undefined);
	};
	return (
		<SafeAreaView style={Styles.Main.container}>
			<View style={Styles.Settings.buttonsView}>
				{settingIndex != null && (
					<Button
						buttonStyle={[Styles.Main.button, Styles.Settings.button]}
						onPress={() => setSettingIndex(undefined)}
						title="Back"
					/>
				)}
				<Button
					buttonStyle={[Styles.Main.button, Styles.Settings.button]}
					onPress={() => navigation.navigate("About")}
					title="About"
				/>
			</View>
			<ScrollView style={Styles.Settings.list}>
				{settingIndex == null ? groupSelector() : groupSettings(settingIndex)}
			</ScrollView>
			<View style={Styles.Settings.buttonsView}>
				<Button
					buttonStyle={[Styles.Main.button, Styles.Settings.button]}
					title="Save"
					onPress={onSave}
				/>
				<Button
					buttonStyle={[Styles.Main.button, Styles.Settings.button]}
					title="Cancel"
					onPress={() => navigation.goBack()}
				/>
				<Button
					buttonStyle={[Styles.Main.button, Styles.Settings.button]}
					title={"Setup"}
					onPress={() => navigation.navigate("Setup")}
				/>
				<Button
					buttonStyle={[Styles.Main.button, Styles.Settings.button]}
					title={"Log"}
					onPress={() => navigation.navigate("Log")}
				/>
			</View>
			<Modal
				transparent
				visible={colorModalVisible}
				animationType="fade"
				onRequestClose={() => setColorModalVisible(false)}
			>
				<View style={Styles.Modal.modalOverlay}>
					<View style={Styles.Modal.menu}>
						<ColorPickers
							kind={ColorPickerOptions.Picker1}
							currentColor={
								selectedColor?.hex ??
								(selectedColorKey && customTheme?.get(selectedColorKey)) ??
								""
							}
							onColorPick={setSelectedColor}
						/>
						<View style={Styles.Settings.buttonsView}>
							<Button
								title={"Save"}
								onPress={() =>
									selectedColorKey &&
									customTheme &&
									selectedColor &&
									onColorSave(customTheme, selectedColorKey, selectedColor)
								}
							/>
							<Button title={"Cancel"} onPress={() => onColorClose()} />
						</View>
					</View>
				</View>
			</Modal>
			<Modal
				transparent
				visible={infoModalVisible}
				animationType="fade"
				onRequestClose={() => setInfoModalVisible(false)}
			>
				<View style={Styles.Modal.modalOverlay}>
					<View style={Styles.Modal.menu}>
						<Text style={Styles.Main.header2}>{infoHeading}</Text>
						<Text>{infoText}</Text>
						<Text>Default: {infoDefaultValue}</Text>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}
