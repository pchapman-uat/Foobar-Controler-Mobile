import React, { useEffect, useState } from "react";
import {
	ArrayGroupItem,
	ArrayItemsKeys,
	BooleanKeys,
	ButtonKeys,
	CustomThemeKeys,
	EnumKeys,
	GroupItem,
	ItemProps,
	NumberKeys,
	SettingType,
	StringKeys,
} from "classes/SettingGroups";
import { SettingPropTypes, AppTheme } from "classes/Settings";
import {
	ArrayItemType,
	ArrayItems,
	ArrayItemTypeKeys,
} from "classes/ArrayItems";
import { CustomTheme, Color, Theme } from "classes/Themes";
import {
	EnumTypes,
	getEnumValuesAndKeys,
	isEnumType,
} from "managers/EnumManager";
import { getColor, getCustomTheme } from "managers/ThemeManager";
import { View, TextInput, Switch, Alert, Text } from "react-native";
import { Button } from "react-native-elements";
import EnumPicker from "./EnumPicker";
import { StyleMapType } from "managers/StyleManager";
import { AppContextType } from "AppContext";
import { Screen } from "enum/Screens";
import { ColorFormatsObject } from "reanimated-color-picker";

type StylesType = Pick<StyleMapType, "Main">;
type SettingsControlProps<
	K extends keyof SettingPropTypes = keyof SettingPropTypes,
> = {
	item: GroupItem<K, SettingType>;
	value: Partial<SettingPropTypes>[K];
	Styles: StylesType;
	ctx: AppContextType;
	customThemeProps?: CustomThemeControlProps;
	onSet: (newVal: SettingPropTypes[K]) => void;
};

type CustomThemeControlProps = {
	setSelectedColorKey: React.Dispatch<
		React.SetStateAction<keyof Theme | undefined>
	>;
	selectedColorKey: keyof Theme | undefined;
	setSelectedColor: React.Dispatch<
		React.SetStateAction<ColorFormatsObject | undefined>
	>;
	selectedColor: ColorFormatsObject | undefined;
	setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>;
	customTheme: CustomTheme | undefined;
	setColorModalVisable: React.Dispatch<React.SetStateAction<boolean>>;
	colorModalVisable: boolean;
};

type ControlProps<
	K extends keyof SettingPropTypes,
	J extends keyof ItemProps,
> = {
	Styles: StylesType;
	ctx: AppContextType;
	item: GroupItem<K, J>;
	set: (newVal: SettingPropTypes[K]) => void;
	value: Partial<SettingPropTypes>[K];
};
function BaseSettingsControl<K extends keyof SettingPropTypes>({
	item,
	value,
	Styles,
	onSet,
	ctx,
	customThemeProps,
}: SettingsControlProps<K>): React.JSX.Element {
	const [val, setVal] = useState<SettingPropTypes[K] | undefined>(value);
	useEffect(() => {
		setVal(value);
	}, [value]);

	const set = (newVal: SettingPropTypes[K]) => {
		setVal(newVal);
		onSet(newVal);
	};

	if (item.isString()) {
		return StringControl({
			item,
			Styles,
			ctx,
			value: val as string | undefined,
			set,
		});
	} else if (item.isNumber()) {
		return NumberControl<NumberKeys>({
			item,
			Styles,
			ctx,
			value: val as number | undefined,
			set: set as (v: SettingPropTypes[NumberKeys]) => void,
		});
	} else if (item.isBoolean()) {
		return BooleanControl({
			item,
			Styles,
			ctx,
			value: val as boolean | undefined,
			set,
		});
	} else if (item.isEnum()) {
		return EnumControl({
			item: item as GroupItem<EnumKeys, EnumTypes>,
			Styles,
			ctx,
			value: val as AppTheme | Screen | undefined,
			set: set as (v: SettingPropTypes[EnumKeys]) => void,
		});
	} else if (item.isCustomTheme()) {
		if (!customThemeProps) throw new Error("Custom Theme Props are Required");
		return CustomThemeControl({
			item,
			Styles,
			ctx,
			value: val as CustomTheme,
			set,
			customThemeProps,
		});
	} else if (item.isArrayItems()) {
		return ArrayItemsControl({
			item,
			Styles,
			ctx,
			value: val as ArrayItems<ArrayItemType>,
			set: set as (v: SettingPropTypes[ArrayItemsKeys]) => void,
		});
	} else {
		throw new Error("Unhandled Setting Type of: " + item.TYPE);
	}
}

function StringControl<K extends StringKeys>({
	item,
	Styles,
	ctx,
	value: val,
	set,
}: ControlProps<K, "string">) {
	const props = item.PROPS;
	const [hiddenPassword, setHiddenPassword] = useState<boolean>(props.password);
	const setString = (newVal: string) => set(newVal as SettingPropTypes[K]);
	return (
		<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
			<TextInput
				style={{ ...Styles.Main.textInput, width: 200 }}
				keyboardType={props.keyboardType}
				value={val?.toString() ?? ""}
				onChangeText={setString}
				placeholder={item.getDefault(ctx.Settings).toString()}
				secureTextEntry={hiddenPassword}
			/>
			{props.password && (
				<Button
					buttonStyle={Styles.Main.button}
					title={hiddenPassword ? "Show" : "Hide"}
					onPress={() => setHiddenPassword(!hiddenPassword)}
				/>
			)}
		</View>
	);
}

function NumberControl<K extends NumberKeys>({
	item,
	Styles,
	ctx,
	value: val,
	set,
}: ControlProps<K, "number">) {
	const setNumber = (newVal: string) => {
		const parsed = Number(newVal);
		if (!isNaN(parsed)) {
			set(parsed as SettingPropTypes[K]);
		}
	};
	return (
		<TextInput
			style={{ ...Styles.Main.textInput, width: 200 }}
			keyboardType="number-pad"
			value={val?.toString() ?? ""}
			onChangeText={setNumber}
			placeholder={item.getDefault(ctx.Settings).toString()}
		/>
	);
}

function BooleanControl<K extends BooleanKeys>({
	ctx,
	value: val,
	set,
}: ControlProps<K, "boolean">) {
	const setBoolean = (newVal: boolean) => set(newVal as SettingPropTypes[K]);
	return (
		<Switch
			thumbColor={getColor(ctx.theme, "buttonPrimary")}
			value={(val as boolean) ?? false}
			onValueChange={setBoolean}
			trackColor={{ true: getColor(ctx.theme, "buttonPrimary") }}
		/>
	);
}

function EnumControl<K extends EnumKeys>({
	item,
	Styles,
	ctx,
	value: val,
	set,
}: ControlProps<K, EnumTypes>) {
	if (!isEnumType(item.TYPE))
		throw new Error("This error should not occor should not happen");
	const { values, keys } = getEnumValuesAndKeys(item.TYPE);

	return (
		<EnumPicker
			style={Styles.Main.picker}
			onValueChange={(item) => set(item as SettingPropTypes[K])}
			dropdownIconColor={getColor(ctx.theme, "textPrimary")}
			mode="dropdown"
			selectedValue={val}
			keys={keys}
			values={values}
		/>
	);
}

type CustomThemeFunctionProps<K extends keyof SettingPropTypes> = ControlProps<
	K,
	"CustomTheme"
> & {
	customThemeProps: CustomThemeControlProps;
};
function CustomThemeControl<K extends CustomThemeKeys>({
	item,
	Styles,
	set,
	customThemeProps,
}: CustomThemeFunctionProps<K>) {
	if (!customThemeProps) {
		throw new Error("Missing Custom Theme Props");
	}
	const {
		setSelectedColorKey,
		setCustomTheme,
		customTheme,
		setColorModalVisable,
	} = customThemeProps;

	const custom = getCustomTheme();

	useEffect(() => {
		setCustomTheme(custom);
	}, [item.KEY]);

	const onPress = (key: keyof Theme) => {
		setColorModalVisable(true);
		setSelectedColorKey(key);
	};
	const onReset = (key: keyof Theme) => {
		customTheme?.reset(key);
		set(customTheme as SettingPropTypes[K]);
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
}

const SettingsControl = Object.assign(BaseSettingsControl, {
	String: StringControl,
	Number: NumberControl,
	Boolean: BooleanControl,
	Enum: EnumControl,
	CustomTheme: CustomThemeControl,
});
type ArrayItemsFunctionProps<K extends keyof SettingPropTypes> = Omit<
	ControlProps<K, "ArrayItems">,
	"value"
> & {
	item: ArrayGroupItem<K, "ArrayItems", ArrayItemTypeKeys>;
	value: ArrayItems<ArrayItemType>;
};
function ArrayItemsControl<K extends ArrayItemsKeys>({
	value,
	set,
	Styles,
}: ArrayItemsFunctionProps<K>): React.JSX.Element {
	const [items, setItems] = useState<string[]>();
	const [inputBoxValue, setInputBoxValue] = useState("");
	useEffect(() => {
		setItems(value.ITEMS.map((item) => item.toString()));
	}, [value]);

	const updateValue = (newItems: typeof value.ITEMS) => {
		const newValue = new ArrayItems(value.SETTINGS, ...newItems);
		newValue.limit = value.limit;
		newValue.selectedItems = [...value.selectedItems];
		set(newValue as SettingPropTypes[K]);
	};

	const onAddPress = (newValue: string) => {
		if (newValue == "") return;
		const updatedItems = [...value.ITEMS, newValue];
		updateValue(updatedItems);
	};

	const onRemovePress = () => {
		const updatedItems = value.ITEMS.slice(0, -1);
		updateValue(updatedItems);
	};

	return (
		<View>
			<View>
				<Text style={Styles.Main.primaryText}>Items ({items?.length ?? 0})</Text>
				<Text style={Styles.Main.primaryText}>{items?.join()}</Text>
			</View>
			<View></View>
			<View>
				<TextInput
					style={{ ...Styles.Main.textInput, width: 200 }}
					onChangeText={setInputBoxValue}
				/>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-around",
					}}
				>
					<Button
						buttonStyle={Styles.Main.button}
						onPress={onRemovePress}
						title={"Remove"}
					/>
					<Button
						buttonStyle={Styles.Main.button}
						title={"Add Item"}
						onPress={() => onAddPress(inputBoxValue)}
					/>
				</View>
			</View>
		</View>
	);
}
type ButtonControlProps<K extends ButtonKeys> = {
	item: GroupItem<K, "Button">;
	Styles: StylesType;
	ctx: AppContextType;
	onSet: (newVal: React.JSX.Element) => void;
};
export function ButtonControl<K extends ButtonKeys>({
	item,
	ctx,
	onSet,
	Styles,
}: ButtonControlProps<K>) {
	return (
		<Button
			buttonStyle={Styles.Main.button}
			title={item.NAME}
			onPress={() =>
				item
					.get(ctx.Settings)
					.then((Value) =>
						onSet(
							Value({ Styles, action: item.getSetting(ctx.Settings).ACTIONS, ctx }),
						),
					)
			}
		/>
	);
}
export default SettingsControl;
