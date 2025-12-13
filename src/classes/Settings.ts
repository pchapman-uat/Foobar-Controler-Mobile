import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalTypes, {
	ActionMap,
	AllModalProps,
} from "elements/modal/ModalTypes";
import {
	RASActions,
	RASProps,
	ResetAllSettingsModal,
} from "elements/modal/ResetAllSettingsModal";
import { Screen } from "enum/Screens";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { Orientation } from "hooks/useOrientation";
import { ArrayItems, ChoiceArrayItems } from "./ArrayItems";
import Logger from "./Logger";
import { Recursive } from "./responses/Browser";
import { ButtonKeys } from "./SettingGroups";
import { CustomTheme } from "./Themes";
import { UnknownValidation } from "./Validated";

export type ButtonSettingType<T extends keyof ActionMap = keyof ActionMap> = (
	p: ModalTypes<T>,
) => React.JSX.Element;
class Settings {
	public readonly PROPS = SettingProps.create();
	public async get<K extends keyof SettingPropTypes>(
		key: K,
	): Promise<SettingPropTypes[K]> {
		const prop = this.PROPS[key];
		return (await prop.get()) as SettingPropTypes[K];
	}
	public getDefault<K extends keyof SettingPropTypes>(
		key: K,
	): SettingPropTypes[K] {
		const prop = this.PROPS[key];
		return prop.FALLBACK as SettingPropTypes[K];
	}
	public set<K extends keyof Exclude<SettingPropTypes, ButtonKeys>>(
		key: K,
		value: UnknownValidation<SettingPropTypes[K]>,
	) {
		const setting = this.PROPS[key];
		if (value.isValid())
			(setting as SettingsProperty<SettingPropTypes[K]>).set(value.get());
	}
	public resetAll() {
		Object.values(this.PROPS).forEach((item) => item.reset());
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
	IP_ADDRESS: new ChoiceArrayItems<string>(),
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
	PORT: 8880,
	CUSTOM_PLAYLIST_TYPES: new ArrayItems<string>(),
	CUSTOM_AUDIO_TYPES: new ArrayItems<string>(),
	RECURSIVE_BROWSER: Recursive.ONCE,
	RESET_ALL_SETTINGS: ResetAllSettingsModal as ButtonSettingType<"resetAll">,
	DISABLE_UPDATE_NOTIFICATIONS: false,
	FIRST_TIME: true,
};

type SettingPropTypes = {
	[K in keyof typeof SettingsDefaults]: (typeof SettingsDefaults)[K];
};

export type ExtractArrayItem<T> = T extends ArrayItems<infer U> ? U : never;
export type SettingsMap = {
	[K in keyof SettingPropTypes]: K extends ButtonKeys
		? ActionSettingsProperty<
				AllModalProps,
				(props: AllModalProps) => React.JSX.Element
			>
		: SettingsProperty<SettingPropTypes[K]>;
};

class SettingProps {
	public static create(): SettingsMap {
		return {
			IP_ADDRESS: new SettingsProperty<ChoiceArrayItems<string>>(
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
			PORT: new SettingsProperty<number>("port", SettingsDefaults.PORT),
			CUSTOM_AUDIO_TYPES: new SettingsProperty<ArrayItems<string>>(
				"custom_audio_types",
				SettingsDefaults.CUSTOM_AUDIO_TYPES,
			),
			CUSTOM_PLAYLIST_TYPES: new SettingsProperty<ArrayItems<string>>(
				"custom_playlist_types",
				SettingsDefaults.CUSTOM_PLAYLIST_TYPES,
			),
			RECURSIVE_BROWSER: new SettingsProperty<Recursive>(
				"recursive_browser",
				SettingsDefaults.RECURSIVE_BROWSER,
			),
			RESET_ALL_SETTINGS: new ActionSettingsProperty<
				RASProps,
				typeof ResetAllSettingsModal
			>("", ResetAllSettingsModal, "AAA", RASActions),
			FIRST_TIME: new SettingsProperty<boolean>(
				"first_time",
				SettingsDefaults.FIRST_TIME,
			),
			DISABLE_UPDATE_NOTIFICATIONS: new SettingsProperty<boolean>(
				"disable_update_notifications",
				SettingsDefaults.DISABLE_UPDATE_NOTIFICATIONS,
			),
		};
	}
}
class SettingsProperty<T> {
	public readonly KEY: string;
	public readonly FALLBACK: T;
	protected readonly PREFIX = "@";

	constructor(key: string, fallback: T) {
		this.KEY = key;
		this.FALLBACK = fallback;
	}

	protected getKey(): string {
		return this.PREFIX + this.KEY;
	}

	public async set(value?: T) {
		if (value == null || value == undefined) return;
		try {
			const json = JSON.stringify(value);
			await AsyncStorage.setItem(this.getKey(), json);
		} catch (e) {
			Logger.error(
				"Settings",
				`Error setting item with key "${this.getKey()}"`,
				{},
				e,
			);
		}
	}

	protected async getHelper<T>(fallback: T): Promise<T>;
	protected async getHelper<T>(fallback: null): Promise<T | null>;
	protected async getHelper(fallback: T | null): Promise<T | null> {
		try {
			const jsonValue = await AsyncStorage.getItem(this.getKey());
			return jsonValue != null ? (JSON.parse(jsonValue) as T) : fallback;
		} catch (e) {
			Logger.error(
				"Settings",
				`Error retrieving item with key "${this.getKey()}"`,
				{},
				e,
			);
			return fallback;
		}
	}

	public async get(): Promise<T> {
		return await this.getHelper(this.FALLBACK);
	}
	public async getNullable(): Promise<T | null> {
		return await this.getHelper(null);
	}
	public async reset() {
		this.set(this.FALLBACK);
	}
}

class EncryptedSettingsProperty extends SettingsProperty<string> {
	public override async set(value?: string) {
		if (value == null || value == undefined) return;
		try {
			await setItemAsync(this.KEY, value);
		} catch (e) {
			Logger.error(
				"Settings",
				`Failed to set encrypted setting with key ${this.KEY}`,
				{},
				e,
			);
		}
	}
	protected override async getHelper(fallback: string): Promise<string>;
	protected override async getHelper(fallback: null): Promise<string | null>;
	protected override async getHelper(
		fallback: string | null,
	): Promise<string | null> {
		try {
			return getItemAsync(this.KEY);
		} catch (e) {
			Logger.error(
				"Settings",
				`Error retrieving encrypted item with key "${this.KEY}":`,
				{},
				e,
			);
			return fallback;
		}
	}
}
class ActionSettingsProperty<
	P extends AllModalProps,
	R extends (props: P) => React.JSX.Element,
> extends SettingsProperty<R> {
	public readonly BUTTON_TEXT: string;
	public readonly ACTIONS: P["action"];

	constructor(
		key: string,
		fallback: R,
		buttonText: string,
		actions: P["action"],
	) {
		super(key, fallback);
		this.BUTTON_TEXT = buttonText;
		this.ACTIONS = actions;
	}
	public override get(): Promise<R> {
		return Promise.resolve(this.FALLBACK);
	}

	public override set(value: R): Promise<void> {
		void value;
		return Promise.resolve();
	}
}

export default new Settings();
export {
	ActionSettingsProperty,
	AppTheme,
	SettingProps,
	SettingPropTypes,
	Settings as SettingsClass,
	SettingsDefaults,
	SettingsProperty,
	StyleProps,
	themes,
};
