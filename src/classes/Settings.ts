import AsyncStorage from "@react-native-async-storage/async-storage";
import { Screen } from "enum/Screens";
import { CustomTheme } from "./Themes";
import { Orientation } from "hooks/useOrientation";
import { setItemAsync, getItemAsync } from "expo-secure-store";
class Settings {
	readonly PROPS = SettingProps.create();

	public async get<K extends keyof SettingPropTypes>(
		key: K,
	): Promise<SettingPropTypes[K]> {
		const prop = this.PROPS[key];

		return await prop.get();
	}
	public getDefault<K extends keyof SettingPropTypes>(
		key: K,
	): SettingPropTypes[K] {
		const prop = this.PROPS[key];
		return prop.fallback;
	}

	public set<K extends keyof SettingPropTypes>(
		key: K,
		value?: SettingPropTypes[K],
	) {
		this.PROPS[key].set(value);
	}
	setOnlyNew<K extends keyof SettingPropTypes>(
		key: K,
		value: SettingPropTypes[K],
	) {
		this.PROPS[key].setOnlyNew(value);
	}
}

enum AppTheme {
	Light,
	Dark,
	LightRed,
	DarkRed,
	Custom,
}
type StyleProps = {
	theme: AppTheme;
	ori: Orientation;
};
const themes = Object.keys(AppTheme).filter((k) =>
	isNaN(Number(k)),
) as (keyof typeof AppTheme)[];

const SettingsDefaults = {
	IP_ADDRESS: "",
	REMEMBER_IP: false,
	THEME: AppTheme.Light,
	DYNAMIC_BACKGROUND: false,
	AUTOMATIC_UPDATES: true,
	UPDATE_FREQUENCY: 1000,
	DEFAULT_SCREEN: Screen.Connection,
	CUSTOM_THEME: new CustomTheme(),
	USERNAME: "",
	PASSWORD: "",
	AUTHENTICATION: false,
};

type SettingPropTypes = {
	[K in keyof typeof SettingsDefaults]: (typeof SettingsDefaults)[K];
};

class SettingProps {
	static create(): {
		[K in keyof SettingPropTypes]: SettingsProperty<SettingPropTypes[K]>;
	} {
		return {
			IP_ADDRESS: new SettingsProperty<string>(
				"ip_address",
				SettingsDefaults.IP_ADDRESS,
			),
			REMEMBER_IP: new SettingsProperty<boolean>(
				"remember_ip",
				SettingsDefaults.REMEMBER_IP,
			),
			THEME: new SettingsProperty<AppTheme>("app_theme", SettingsDefaults.THEME),
			DYNAMIC_BACKGROUND: new SettingsProperty<boolean>(
				"dynamic_background",
				SettingsDefaults.DYNAMIC_BACKGROUND,
			),
			AUTOMATIC_UPDATES: new SettingsProperty<boolean>(
				"automatic_updates",
				SettingsDefaults.AUTOMATIC_UPDATES,
			),
			UPDATE_FREQUENCY: new SettingsProperty<number>(
				"update_frequency",
				SettingsDefaults.UPDATE_FREQUENCY,
			),
			DEFAULT_SCREEN: new SettingsProperty<Screen>(
				"default_screen",
				SettingsDefaults.DEFAULT_SCREEN,
			),
			CUSTOM_THEME: new SettingsProperty<CustomTheme>(
				"custom_theme",
				SettingsDefaults.CUSTOM_THEME,
			),
			USERNAME: new SettingsProperty<string>(
				"username",
				SettingsDefaults.USERNAME,
			),
			PASSWORD: new EncryptedSettingsProperty(
				"password",
				SettingsDefaults.PASSWORD,
			),
			AUTHENTICATION: new SettingsProperty<boolean>(
				"authentication",
				SettingsDefaults.AUTHENTICATION,
			),
		};
	}
}
class SettingsProperty<T> {
	readonly key: string;
	readonly fallback: T;
	protected readonly prefix = "@";

	constructor(key: string, fallback: T) {
		this.key = key;
		this.fallback = fallback;
	}

	protected getKey(): string {
		return this.prefix + this.key;
	}

	async set(value?: T) {
		if (value == null || value == undefined) return;
		try {
			const json = JSON.stringify(value);
			await AsyncStorage.setItem(this.getKey(), json);
		} catch (e) {
			console.error(e);
		}
	}

	async setOnlyNew(value: T) {
		const current = await this.get();
		if (current == null) await this.set(value);
	}

	async getHelper<T>(fallback: T): Promise<T>;
	async getHelper<T>(fallback: null): Promise<T | null>;
	async getHelper(fallback: T | null): Promise<T | null> {
		try {
			const jsonValue = await AsyncStorage.getItem(this.getKey());
			return jsonValue != null ? (JSON.parse(jsonValue) as T) : fallback;
		} catch (e) {
			console.error(`Error retrieving item with key "${this.getKey()}":`, e);
			return fallback;
		}
	}

	async get(): Promise<T> {
		return await this.getHelper(this.fallback);
	}
	async getNullable(): Promise<T | null> {
		return await this.getHelper(null);
	}
}

class EncryptedSettingsProperty extends SettingsProperty<string> {
	override async set(value?: string) {
		if (value == null || value == undefined) return;
		try {
			await setItemAsync(this.key, value);
		} catch (e) {
			console.error(e);
		}
	}
	override async getHelper(fallback: string): Promise<string>;
	override async getHelper(fallback: null): Promise<string | null>;
	override async getHelper(fallback: string | null): Promise<string | null> {
		console.warn("Look at me!", this.key);
		try {
			return getItemAsync(this.key);
		} catch (e) {
			console.error(`Error retrieving item with key "${this.key}":`, e);
			return fallback;
		}
	}
	protected getKey(): string {
		return this.prefix + this.key;
	}
}
export default new Settings();
export {
	AppTheme,
	SettingsDefaults,
	SettingProps,
	SettingsProperty,
	themes,
	Settings as SettingsClass,
	SettingPropTypes,
	StyleProps,
};
