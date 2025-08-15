import AppContext from "AppContext";
import { SettingPropTypes, SettingsDefaults } from "classes/Settings";
import { useStyles } from "managers/StyleManager";
import { getColor, initCustomTheme } from "managers/ThemeManager";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-elements";
import SettingGroups, {
	Group,
	GroupItem,
	GroupTypes,
	SettingType,
} from "classes/SettingGroups";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { Color, CustomTheme, Theme } from "classes/Themes";
import ColorPickers, { ColorPickerOptions } from "elements/ColorPickers";
import { ColorFormatsObject } from "reanimated-color-picker";
import SettingsControl, { ButtonControl } from "elements/SettingsControl";
import { InfoSVG } from "managers/SVGManager";
import { isPrimitive } from "helpers/helpers";

type SettingsNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Settings"
>;
type SettingsProps = {
	navigation: SettingsNavigationProp;
};

export default function SettingsScreen({ navigation }: SettingsProps) {
	const Styles = useStyles("Main", "Settings", "Library", "Modal");
	const ctx = useContext(AppContext);

	const [values, setValues] = useState<Partial<SettingPropTypes>>({});
	const [loaded, setLoaded] = useState(false);
	const [settingIndex, setSettingIndex] = useState<number>();

	const [colorModalVisable, setColorModalVisable] = useState(false);
	const [selectedColorKey, setSelectedColorKey] = useState<keyof Theme>();
	const [selectedColor, setSelectedColor] = useState<ColorFormatsObject>();
	const [customTheme, setCustomTheme] = useState<CustomTheme>();
	const [infoHeading, setInfoHeading] = useState("");
	const [infoText, setInfoText] = useState("");
	const [infoModalVisable, setInfoModalVisable] = useState(false);
	const [infoDefaultValue, setInfoDefaultValue] = useState("");
	const onSave = async () => {
		const entries = Object.entries(values) as [
			keyof SettingPropTypes,
			SettingPropTypes[keyof SettingPropTypes],
		][];

		await Promise.all(
			entries.map(([key, value]) => {
				console.log("Setting: ", key, " To: ", value);
				return ctx.Settings.set(key, value);
			}),
		);

		if (values.THEME != null) {
			ctx.setTheme(values.THEME);
		}
		if (values.CUSTOM_THEME != null && customTheme != null) {
			initCustomTheme(customTheme);
		}
		navigation.goBack();
	};

	useEffect(() => {
		(async () => {
			const entries = await Promise.all(
				(Object.keys(SettingsDefaults) as (keyof SettingPropTypes)[]).map(
					async (key) => {
						const value = await ctx.Settings.get(key);
						return [key, value] as const;
					},
				),
			);

			setValues(Object.fromEntries(entries));
			setLoaded(true);
		})();
	}, []);
	const onInfoPress = (text: string, heading: string, defaultValue: unknown) => {
		setInfoText(text);
		setInfoHeading(heading);
		setInfoModalVisable(true);
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

				{item.isButton() ? (
					<ButtonControl
						item={item}
						Styles={Styles}
						ctx={ctx}
						onSet={ctx.setModal}
					/>
				) : (
					<SettingsControl
						item={item}
						value={values[item.KEY]}
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
							setColorModalVisable,
							colorModalVisable,
						}}
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
		setColorModalVisable(false);
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
			</View>
			<Modal
				transparent
				visible={colorModalVisable}
				animationType="fade"
				onRequestClose={() => setColorModalVisable(false)}
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
				visible={infoModalVisable}
				animationType="fade"
				onRequestClose={() => setInfoModalVisable(false)}
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
