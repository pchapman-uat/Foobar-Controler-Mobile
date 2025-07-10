import { AppTheme, SettingsDefaults } from "classes/Settings";
import Themes, {CustomTheme, Theme, ThemeJSON} from "classes/Themes";

export function getTheme(theme: AppTheme): Theme{
    if(theme >= Themes.length || theme <0) return Themes[SettingsDefaults.THEME];
    return Themes[theme]
}

export function getColor(theme: AppTheme, property: keyof Theme, alpha?:number) : string{
    if(alpha && property !== 'name') return getTheme(theme).get(property, 0.5)
    return getTheme(theme)[property].toString();
}

export function initCustomTheme(customTheme: Theme){
    const theme = getCustomTheme()
    console.warn("Hello?",theme)
    if(theme instanceof CustomTheme){
        console.warn("Custom Theme")
        if(!customTheme) return
        let data = JSON.parse(JSON.stringify(customTheme)) as ThemeJSON
        theme.init(data)
    }
}

export function getCustomTheme(){
    return Themes[Themes.length-1] as CustomTheme
}