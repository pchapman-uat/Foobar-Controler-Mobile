import { KeyboardTypeOptions } from "react-native";
import { SettingPropTypes, SettingsClass } from "./Settings";
import { ArrayItems, ArrayItemType, ArrayItemTypeKeys } from "./ArrayItems";

class GroupItem<K extends keyof SettingPropTypes, T extends SettingType> {
	readonly name: string;
	readonly key: K;
	readonly type: SettingType;
	readonly props: ItemOptions[T];
	readonly unused: boolean = false;
	private readonly description: string;
	constructor(
		name: string,
		key: K,
		type: T,
		props: Partial<ItemOptions[T]> = {},
		unused?: boolean,
	) {
		this.name = name;
		this.key = key;
		this.type = type;
		if (unused) this.unused = unused;
		const defaultProps = ItemPropsDefaults[type] as ItemOptions[T];
		this.props = {
			...defaultProps,
			...props,
		} as ItemOptions[T];
		this.description = SETTINGS_DESCRIPTIONS[this.key];
	}
	public getDescription(): string {
		return this.hasDescription ? "No Description Provided" : this.description;
	}
	public get hasDescription(): boolean {
		return this.description === "";
	}
	public get(settings: SettingsClass): Promise<SettingPropTypes[K]> {
		return settings.get(this.key);
	}

	public getDefault(settings: SettingsClass): SettingPropTypes[K] {
		return settings.getDefault(this.key);
	}

	public getType() {
		return this.type;
	}

	public set(settings: SettingsClass, value: SettingPropTypes[K]) {
		settings.set(this.key, value);
	}
	isString(): this is GroupItem<StringKeys, "string"> {
		return this.type == "string";
	}
	isBoolean(): this is GroupItem<BooleanKeys, "boolean"> {
		return this.type == "boolean";
	}
	isNumber(): this is GroupItem<NumberKeys, "number"> {
		return this.type == "number";
	}
	isEnum(): this is GroupItem<EnumKeys, EnumTypes> {
		return this.type == "AppTheme" || this.type == "Screens";
	}
	isCustomTheme(): this is GroupItem<CustomThemeKeys, "CustomTheme"> {
		return this.type == "CustomTheme";
	}
	isArrayItems(): this is ArrayGroupItem<
		ArrayItemsKeys,
		"ArrayItems",
		ArrayItemTypeKeys
	> {
		return this.type == "ArrayItems";
	}
}

export class ArrayGroupItem<
	K extends keyof SettingPropTypes,
	T extends SettingType,
	J extends ArrayItemTypeKeys,
> extends GroupItem<K, T> {
	readonly subType: ArrayItemTypeKeys;
	constructor(
		name: string,
		key: K,
		type: T,
		subType: J,
		props: Partial<ItemOptions[T]> = {},
		unused?: boolean,
	) {
		super(name, key, type, props, unused);
		this.subType = subType;
	}
	isArrayString(): this is ArrayGroupItem<K, T, "string"> {
		return this.subType === "string";
	}
}
type GroupTypes = readonly GroupItem<keyof SettingPropTypes, SettingType>[];

export type StringKeys = {
	[K in keyof SettingPropTypes]: SettingPropTypes[K] extends string ? K : never;
}[keyof SettingPropTypes];
export type NumberKeys = {
	[K in keyof SettingPropTypes]: SettingPropTypes[K] extends number ? K : never;
}[keyof SettingPropTypes];
export type BooleanKeys = {
	[K in keyof SettingPropTypes]: SettingPropTypes[K] extends boolean ? K : never;
}[keyof SettingPropTypes];
export type CustomThemeKeys = "CUSTOM_THEME";
export type EnumKeys = "THEME" | "DEFAULT_SCREEN";
export type EnumTypes = "AppTheme" | "Screens";
export type ArrayItemsKeys = {
	[K in keyof SettingPropTypes]: SettingPropTypes[K] extends ArrayItems<ArrayItemType>
		? K
		: never;
}[keyof SettingPropTypes];
export type ItemProps = {
	string: {
		password: boolean;
		keyboardType: KeyboardTypeOptions;
	};
	boolean: Record<string, never>;
	number: Record<string, never>;
	AppTheme: Record<string, never>;
	Screens: Record<string, never>;
	CustomTheme: Record<string, never>;
	ArrayItems: Record<string, never>;
};
export const ItemPropsDefaults: {
	[K in keyof ItemProps]: ItemProps[K];
} = {
	string: {
		password: false,
		keyboardType: "default",
	},
	boolean: {},
	number: {},
	AppTheme: {},
	Screens: {},
	CustomTheme: {},
	ArrayItems: {},
};
export type SettingType = keyof ItemProps;

type ItemOptions = {
	[K in SettingType]: ItemProps[K];
};

class Group<TItems extends GroupTypes> {
	readonly name: string;
	readonly items: TItems;

	constructor(name: string, ...items: TItems) {
		this.name = name;
		this.items = items;
	}
}

const SETTINGS_DESCRIPTIONS: { [K in keyof SettingPropTypes]: string } = {
	IP_ADDRESS:
		"The IP Address of the machine that is currently running Foobar2000. Run ipconfig in CMD and enter the IPv4 or IPv6 address",
	REMEMBER_IP: "This is unused and should be disregarded",
	THEME:
		"The current theme of the applicatio, custom will default to the 'Light' theme",
	DYNAMIC_BACKGROUND:
		"Change the background of the now playing screen based on the album art of the current song",
	AUTOMATIC_UPDATES:
		"This will enable or disable the updates for the application. This requires a restart of the application",
	UPDATE_FREQUENCY:
		"Change how often the application updates. WARNING: The lower the number the more processing power the app will use, it is recomended to keep it at the default",
	DEFAULT_SCREEN: "Change the screen that the application will first open to",
	CUSTOM_THEME:
		"Create your own custom theme by adjusting the values, theme mustbe set to 'Custom' for the changes to apply",
	USERNAME:
		"When authentication is enabled this will be the username that will be provided to the server. NOTE: Due to the server this is sent over HTTP, meaning anyone can see this value",
	PASSWORD:
		"When authentication is enabled this will be the password that will be provided to the server. NOTE: Due to the server this is sent over HTTP, meaning anyone can see this value",
	AUTHENTICATION:
		"Enable or disable the application from using the Username/Password",
	PORT: "Change the port that the server is running on",
};
const ALL_SETTINGS: {
	[K in keyof SettingPropTypes]: GroupItem<K, SettingType>;
} = {
	THEME: new GroupItem("Theme", "THEME", "AppTheme"),
	DYNAMIC_BACKGROUND: new GroupItem(
		"Dynamic Background",
		"DYNAMIC_BACKGROUND",
		"boolean",
	),
	AUTOMATIC_UPDATES: new GroupItem(
		"Automatic Updates",
		"AUTOMATIC_UPDATES",
		"boolean",
	),
	DEFAULT_SCREEN: new GroupItem("Default Screen", "DEFAULT_SCREEN", "Screens"),
	IP_ADDRESS: new GroupItem("IP Address", "IP_ADDRESS", "string", {
		keyboardType: "url",
	}),
	PORT: new GroupItem("Port", "PORT", "number"),
	AUTHENTICATION: new GroupItem(
		"Require Authentication",
		"AUTHENTICATION",
		"boolean",
	),
	USERNAME: new GroupItem("Username", "USERNAME", "string"),
	PASSWORD: new GroupItem("Password", "PASSWORD", "string", { password: true }),
	CUSTOM_THEME: new GroupItem("Custom Theme", "CUSTOM_THEME", "CustomTheme"),
	UPDATE_FREQUENCY: new GroupItem(
		"Update Frequency",
		"UPDATE_FREQUENCY",
		"number",
	),
	REMEMBER_IP: new GroupItem("Rememeber IP", "REMEMBER_IP", "boolean", {}, true),
};
class SettingGroups {
	readonly groups = [
		new Group(
			"General",
			ALL_SETTINGS.THEME,
			ALL_SETTINGS.DYNAMIC_BACKGROUND,
			ALL_SETTINGS.AUTOMATIC_UPDATES,
			ALL_SETTINGS.DEFAULT_SCREEN,
		),
		new Group(
			"Network",
			ALL_SETTINGS.IP_ADDRESS,
			ALL_SETTINGS.PORT,
			ALL_SETTINGS.AUTHENTICATION,
			ALL_SETTINGS.USERNAME,
			ALL_SETTINGS.PASSWORD,
		),
		new Group("Themes", ALL_SETTINGS.THEME, ALL_SETTINGS.CUSTOM_THEME),
		new Group("Advanced", ALL_SETTINGS.UPDATE_FREQUENCY),
	];

	[Symbol.iterator]() {
		return this.groups[Symbol.iterator]();
	}

	get length() {
		return this.groups.length;
	}
}
export default new SettingGroups();
export { GroupItem, Group, SettingGroups, GroupTypes, ALL_SETTINGS };
