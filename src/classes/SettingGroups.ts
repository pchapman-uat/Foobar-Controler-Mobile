import { SettingPropTypes, SettingsClass } from "./Settings";

type SettingType =
	| "string"
	| "boolean"
	| "number"
	| "AppTheme"
	| "Screens"
	| "CustomTheme"
	| "encrypted_string";
class GroupItem<K extends keyof SettingPropTypes> {
	readonly name: string;
	readonly key: K;
	readonly type: SettingType;

	constructor(name: string, key: K, type: SettingType) {
		this.name = name;
		this.key = key;
		this.type = type;
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

type GroupTypes = readonly GroupItem<keyof SettingPropTypes>[];
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
			"Themes",
			new GroupItem("Theme", "THEME", "AppTheme"),
			new GroupItem("Custom Theme", "CUSTOM_THEME", "CustomTheme"),
		),
		new Group(
			"Advanced",
			new GroupItem("Update Frequency", "UPDATE_FREQUENCY", "number"),
			new GroupItem("Require Auithentication", "AUTHENTICATION", "boolean"),
			new GroupItem("Username", "USERNAME", "string"),
			new GroupItem("Password", "PASSWORD", "encrypted_string"),
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
