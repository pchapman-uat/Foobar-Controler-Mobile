import { Picker } from "@react-native-picker/picker";
import { AppContext } from "AppContext";
import { AppTheme, themes } from "classes/Settings";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeContext from "ThemeContext";
import { Button, Switch } from "react-native-elements";

export default function SettingsScreen() {
    const [theme, setTheme] = useState<AppTheme>()
    const [dynamicBackground, setDynamicBackground] = useState<boolean>()
    const Theme = useContext(ThemeContext);
    const Styles = useStyles('Main')
    const ctx = useContext(AppContext);

    const onSave = () => {
        console.log("saving", theme)
        const PROPS = ctx.Settings.PROPS;
        if(theme == null) return;
        PROPS.THEME.set(theme)
        Theme.setTheme(theme);
        if(dynamicBackground == null) return
        PROPS.DYNAMIC_BACKGROUND.set(dynamicBackground)

    }
    useEffect(() => {
        ctx.Settings.PROPS.THEME.get().then(val => setTheme(val));
        ctx.Settings.PROPS.DYNAMIC_BACKGROUND.get().then(setDynamicBackground)
    }, []);

    return (
        <SafeAreaView style={Styles.Main.container}>
            <View>
                <Picker style={Styles.Main.picker} onValueChange={setTheme} dropdownIconColor={getColor(Theme.theme, 'textPrimary')} mode='dropdown' selectedValue={theme}>
                    {themes.map((item, index) => (
                        <Picker.Item key={'themes-'+item} label={item} value={index as AppTheme} />
                    ))}
                </Picker>
                <View style={Styles.Main.switchContainer}>
                    <Text style={Styles.Main.swtichLable}>Dynamic Background</Text>
                    <Switch
                        thumbColor={getColor(Theme.theme, 'buttonPrimary')}
                        value={dynamicBackground}
                        onValueChange={setDynamicBackground}
                        trackColor={{true: getColor(Theme.theme, 'buttonPrimary')}}
                    />
                </View>
               
            </View>
            <Button buttonStyle={Styles.Main.button} title='Save' onPress={onSave}/>
        </SafeAreaView>
    )
}