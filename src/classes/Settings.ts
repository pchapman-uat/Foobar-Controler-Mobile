import AsyncStorage from "@react-native-async-storage/async-storage";
import { Screen } from "enum/Screens";
import Themes, { CustomTheme, Theme, ThemeJSON } from "./Themes";
class Settings {
    readonly PROPS: { [K in keyof SettingPropTypes]: SettingsProperty<SettingPropTypes[K]> } = new SettingProps() as any;

    public async get<K extends keyof SettingPropTypes>(key: K): Promise<SettingPropTypes[K]> {
        const prop = this.PROPS[key];

        return await prop.get();
    }
    public getDefault<K extends keyof SettingPropTypes>(key: K): SettingPropTypes[K]{
        const prop = this.PROPS[key];
        return prop.fallback;
    }

    public set<K extends keyof SettingPropTypes>(key:K, value?: SettingPropTypes[K]){
        this.PROPS[key].set(value);
    }
    setOnlyNew<K extends keyof SettingPropTypes>(key:K, value: SettingPropTypes[K]) {
        this.PROPS[key].setOnlyNew(value)
    }
}


enum AppTheme {
    Light,
    Dark,
    LightRed,
    DarkRed,
    Custom
}
const themes = Object.keys(AppTheme).filter(k => isNaN(Number(k))) as (keyof typeof AppTheme)[];

const SettingsDefaults = {
    IP_ADDRESS: "",
    REMEMBER_IP: false,
    THEME: AppTheme.Light,
    DYNAMIC_BACKGROUND: false,
    AUTOMATIC_UPDATES: true,
    UPDATE_FREQUENCY: 1000,
    DEFAULT_SCREEN: Screen.Connection,
    CUSTOM_THEME: new CustomTheme()
}

interface SettingPropTypes {
    IP_ADDRESS: string;
    REMEMBER_IP: boolean;
    THEME: AppTheme;
    DYNAMIC_BACKGROUND: boolean;
    AUTOMATIC_UPDATES: boolean;
    UPDATE_FREQUENCY: number;
    DEFAULT_SCREEN: Screen
    CUSTOM_THEME: Theme
}


class SettingProps {
    readonly IP_ADDRESS = new SettingsProperty<string>("ip_address", SettingsDefaults.IP_ADDRESS);
    readonly REMEMBER_IP = new SettingsProperty<boolean>("remember_ip", SettingsDefaults.REMEMBER_IP);
    readonly THEME = new SettingsProperty<AppTheme>("app_theme", SettingsDefaults.THEME);
    readonly DYNAMIC_BACKGROUND = new SettingsProperty<boolean>("dynamic_background", SettingsDefaults.DYNAMIC_BACKGROUND);
    readonly AUTOMATIC_UPDATES = new SettingsProperty<boolean>("automatic_updates", SettingsDefaults.AUTOMATIC_UPDATES);
    readonly UPDATE_FREQUENCY = new SettingsProperty<number>('update_frequency', SettingsDefaults.UPDATE_FREQUENCY)
    readonly DEFAULT_SCREEN = new SettingsProperty<Screen>('default_screen', SettingsDefaults.DEFAULT_SCREEN)
    readonly CUSTOM_THEME = new SettingsProperty<Theme>('custom_theme', SettingsDefaults.CUSTOM_THEME)
}
class SettingsProperty<T> {
    readonly key: string;
    readonly fallback: T
    
    constructor(key: string,fallback: T){
        this.key = "@"+key
        this.fallback = fallback;
    }

    async set(value?: T){
        if(value == null || value == undefined) return
        try {
            const json = JSON.stringify(value);
            await AsyncStorage.setItem(this.key, json);
        } catch (e) {
            console.error(e)
        }
    }
    async setOnlyNew(value:T) {
        const current = await this.get();
        if(current == null) await this.set(value);
    }
    async getHelper<T>(fallback: T): Promise<T>;
    async getHelper<T>(fallback: null): Promise<T | null>;
    async getHelper(fallback: T | null):Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(this.key);
            return jsonValue !=null ? JSON.parse(jsonValue) as T : fallback 
        } catch (e){
            console.error(`Error retrieving item with key "${this.key}":`, e);
            return fallback;
        }
    }
    async get(): Promise<T>{
        return await this.getHelper(this.fallback);
    }
    async getNullable():Promise<T| null>{
        return await this.getHelper(null);
    }

}

export default new Settings()
export {AppTheme, SettingsDefaults, SettingProps, SettingsProperty, themes, Settings as SettingsClass, SettingPropTypes}
