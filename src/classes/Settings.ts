import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Settings {
    readonly PROPS = new SettingProps();
}

export class SettingProps {
    readonly IP_ADDRESS = new SettingsProperty<string>("ip_address");
    readonly REMEMBER_IP = new SettingsProperty<boolean>("remember_ip");
}

export class SettingsProperty<T> {
    readonly key: string;
    
    constructor(key: string){
        this.key = "@"+key
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
        if(current) await this.set(value);
    }
    async get():Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(this.key);
            return jsonValue !=null ? JSON.parse(jsonValue) as T : null;; 
        } catch (e){
            console.error(`Error retrieving item with key "${this.key}":`, e);
            return null;
        }
    }

}
