import AsyncStorage from "@react-native-async-storage/async-storage";
export default class Settings {
    readonly PROPS = new SettingProps();
}

enum AppTheme {
    Light,
    Dark,
    LightRed,
    DarkRed,
}
const themes = Object.keys(AppTheme).filter(k => isNaN(Number(k))) as (keyof typeof AppTheme)[];

const defaults = {
    IP_ADDRESS: "",
    REMEMBER_IP: false,
    THEME: AppTheme.Light,
}

class SettingProps {
    readonly IP_ADDRESS = new SettingsProperty<string>("ip_address", defaults.IP_ADDRESS);
    readonly REMEMBER_IP = new SettingsProperty<boolean>("remember_ip", defaults.REMEMBER_IP);
    readonly THEME = new SettingsProperty<AppTheme>("app_theme", defaults.THEME);
    readonly DYNAMIC_BACKGROUND = new SettingsProperty<boolean>("dynamic_background", false)
}
class SettingsProperty<T> {
    readonly key: string;
    readonly fallback: T
    
    constructor(key: string,fallback: T){
        this.key = "@"+key
        this.fallback = fallback;
    }

    async set(value: T){
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

export {AppTheme, defaults, SettingProps, SettingsProperty, themes}
