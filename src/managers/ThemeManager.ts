import { AppTheme, defaults } from "classes/Settings";
import Themes, {Theme} from "classes/Themes";

export function getTheme(theme: AppTheme): Theme{
    if(theme >= Themes.length || theme <0) return Themes[defaults.THEME];
    return Themes[theme]
}

export function getColor(theme: AppTheme, property: keyof Theme){
    return getTheme(theme)[property].toString();
}
