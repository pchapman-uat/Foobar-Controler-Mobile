import { SettingPropTypes, SettingsClass } from "./Settings";

class GroupItem<K extends keyof SettingPropTypes, T extends SettingType> {
	readonly name: string;
	readonly key: K;
	readonly type: SettingType;
	readonly props: ItemOptions[T];

	constructor(
		name: string,
		key: K,
		type: T,
		props: Partial<ItemOptions[T]> = {},
	) {
		this.name = name;
		this.key = key;
		this.type = type;

		const defaultProps = ItemPropsDefaults[type] as ItemOptions[T];
		this.props = {
			...defaultProps,
			...props,
		} as ItemOptions[T];
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
}

type ItemProps = {
	string: {
		password: boolean;
	};
	boolean: Record<string, never>;
	number: Record<string, never>;
	AppTheme: Record<string, never>;
	Screens: Record<string, never>;
	CustomTheme: Record<string, never>;
	encrypted_string: Record<string, never>;
};
export const ItemPropsDefaults: {
	[K in keyof ItemProps]: Partial<ItemProps[K]>;
} = {
	string: {
		password: false,
	},
	boolean: {},
	number: {},
	AppTheme: {},
	Screens: {},
	CustomTheme: {},
	encrypted_string: {},
};
export type SettingType = keyof ItemProps;

type ItemOptions = {
	[K in SettingType]: ItemProps[K];
};

type GroupTypes = readonly GroupItem<keyof SettingPropTypes, SettingType>[];

class Group<TItems extends GroupTypes> {
	readonly name: string;
	readonly items: TItems;

	constructor(name: string, ...items: TItems) {
		this.name = name;
		this.items = items;
	}
}

class SettingGroups {
	readonly groups = [
		new Group(
			"General",
			new GroupItem("Theme", "THEME", "AppTheme"),
			new GroupItem("Dynamic Background", "DYNAMIC_BACKGROUND", "boolean"),
			new GroupItem("Automatic Updates", "AUTOMATIC_UPDATES", "boolean"),
			new GroupItem("Default Screen", "DEFAULT_SCREEN", "Screens"),
		),
		new Group(
			"Network",
			new GroupItem("IP Address", "IP_ADDRESS", "string"),
			new GroupItem("Port", "PORT", "number"),
			new GroupItem("Require Authentication", "AUTHENTICATION", "boolean"),
			new GroupItem("Username", "USERNAME", "string"),
			new GroupItem("Password", "PASSWORD", "string", { password: true }),
		),
		new Group(
			"Themes",
			new GroupItem("Theme", "THEME", "AppTheme"),
			new GroupItem("Custom Theme", "CUSTOM_THEME", "CustomTheme"),
		),
		new Group(
			"Advanced",
			new GroupItem("Update Frequency", "UPDATE_FREQUENCY", "number"),
		),
	];

	[Symbol.iterator]() {
		return this.groups[Symbol.iterator]();
	}

	get length() {
		return this.groups.length;
	}
}
export default new SettingGroups();
export { GroupItem, Group, SettingGroups, GroupTypes };
