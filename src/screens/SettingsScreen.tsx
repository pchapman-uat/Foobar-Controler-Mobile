import { Picker } from "@react-native-picker/picker";
import AppContext from "AppContext";
import { AppTheme, SettingPropTypes, SettingsDefaults } from "classes/Settings";
import { useStyles } from "managers/StyleManager";
import {
	getColor,
	getCustomTheme,
	initCustomTheme,
} from "managers/ThemeManager";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Modal,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Switch } from "react-native-elements";
import { Screen } from "enum/Screens";
import SettingGroups, {
	Group,
	GroupItem,
	GroupTypes,
} from "classes/SettingGroups";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { renderPicker } from "elements/EnumPicker";
import { getEnumKeys } from "helpers/helpers";
import { Color, CustomTheme, Theme } from "classes/Themes";
import ColorPickers, { ColorPickerOptions } from "elements/ColorPickers";
import { ColorFormatsObject } from "reanimated-color-picker";
type SettingsNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Settings"
>;
type SettingsProps = {
	navigation: SettingsNavigationProp;
};
type renderItemProps = {
	item: GroupItem<keyof SettingPropTypes>;
	index: number;
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
	const SettingsControl = ({ item }: renderItemProps) => {
		const value = values[item.key];
		const [val, setVal] = useState<SettingPropTypes[typeof item.key] | undefined>(
			value,
		);

		useEffect(() => {
			setVal(value);
		}, [value]);

		const set = (newVal: SettingPropTypes[typeof item.key]) => {
			setVal(newVal);
			setValues((prev) => ({ ...prev, [item.key]: newVal }));
		};
		const [hiddenPassword, setHiddenPassword] = useState(true);
		switch (item.type) {
			case "string":
				return (
					<TextInput
						style={{ ...Styles.Main.textInput, width: 200 }}
						keyboardType="default"
						value={val?.toString() ?? ""}
						onChangeText={set}
						placeholder={item.getDefault(ctx.Settings).toString()}
					/>
				);
			case "encrypted_string":
				console.log("Look at this!", val);
				return (
					<View
						style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
					>
						<TextInput
							style={{ ...Styles.Main.textInput, width: 200 }}
							keyboardType="default"
							value={val?.toString() ?? ""}
							onChangeText={set}
							placeholder={item.getDefault(ctx.Settings).toString()}
							secureTextEntry={hiddenPassword}
						/>
						<Button
							buttonStyle={Styles.Main.button}
							title={hiddenPassword ? "Show" : "Hide"}
							onPress={() => setHiddenPassword(!hiddenPassword)}
						/>
					</View>
				);
			case "number": {
				return (
					<TextInput
						style={{ ...Styles.Main.textInput, width: 200 }}
						keyboardType="number-pad"
						value={val?.toString() ?? ""}
						onChangeText={set}
						placeholder={item.getDefault(ctx.Settings).toString()}
					/>
				);
			}
			case "boolean": {
				console.log((val as boolean) ?? false);
				return (
					<Switch
						thumbColor={getColor(ctx.theme, "buttonPrimary")}
						value={(val as boolean) ?? false}
						onValueChange={set}
						trackColor={{ true: getColor(ctx.theme, "buttonPrimary") }}
					/>
				);
			}
			case "AppTheme":
			case "Screens":
				const values =
					item.type === "AppTheme"
						? AppTheme
						: item.type === "Screens"
							? Screen
							: (() => {
									throw new Error("This error should never happen");
								})();

				const keys = getEnumKeys(values);

				return (
					<Picker
						style={Styles.Main.picker}
						onValueChange={set}
						dropdownIconColor={getColor(ctx.theme, "textPrimary")}
						mode="dropdown"
						selectedValue={val}
					>
						{renderPicker(keys, values)}
					</Picker>
				);

			case "CustomTheme":
				const custom = getCustomTheme();
				if (!(custom instanceof CustomTheme)) return;

				useEffect(() => {
					setCustomTheme(custom);
				}, [item.key]);

				const onPress = (key: keyof Theme) => {
					setColorModalVisable(true);
					setSelectedColorKey(key);
				};
				const onReset = (key: keyof Theme) => {
					customTheme?.reset(key);
					setValues((prev) => ({ ...prev, CUSTOM_THEME: customTheme }));
				};
				const onLongPress = (key: keyof Theme) => {
					Alert.alert("Reset", `Are you sure you want to reset: ${key}?`, [
						{ text: "No", style: "cancel" },
						{ text: "Yes", onPress: () => onReset(key) },
					]);
				};
				return (
					<View>
						{Object.keys(custom).map((key) => {
							const themeKey = key as keyof Theme;
							const value = custom[themeKey];

							if (value instanceof Color) {
								return (
									<Button
										key={themeKey}
										title={themeKey}
										onPress={() => onPress(themeKey)}
										onLongPress={() => onLongPress(themeKey)}
										titleStyle={{ color: value.isDark() ? "white" : "black" }}
										buttonStyle={[Styles.Main.button, { backgroundColor: value.toHex() }]}
									/>
								);
							}
							return null;
						})}
					</View>
				);

			default:
				throw new Error("Unhandled Setting Type of: " + item.type);
		}
	};

	const renderItem = useCallback(
		(item: GroupItem<keyof SettingPropTypes>, index: number) => (
			<View
				style={[
					Styles.Library[index % 2 === 0 ? "rowEven" : "rowOdd"],
					Styles.Settings.itemView,
				]}
				key={index}
			>
				<Text style={Styles.Settings.itemLabel}>{item.name}</Text>
				<SettingsControl item={item} index={index} />
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
					{group.name} - {group.items.length}
				</Text>
			</TouchableOpacity>
		);
	};
	const groupSelector = () => {
		return <ScrollView>{SettingGroups.groups.map(renderGroup)}</ScrollView>;
	};

	const groupSettings = (groupIndex: number) =>
		SettingGroups.groups[groupIndex].items.map(renderItem);

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
		</SafeAreaView>
	);
}
