import { AppTheme, SettingsDefaults } from "classes/Settings";
import Themes, {Theme} from "classes/Themes";

export function getTheme(theme: AppTheme): Theme{
    if(theme >= Themes.length || theme <0) return Themes[SettingsDefaults.THEME];
    return Themes[theme]
}

export function getColor(theme: AppTheme, property: keyof Theme, alpha?:number) : string{
    if(alpha && property !== 'name') return getTheme(theme).get(property, 0.5)
    return getTheme(theme)[property].toString();
}
