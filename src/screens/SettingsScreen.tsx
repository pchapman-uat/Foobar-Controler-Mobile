import { Picker } from "@react-native-picker/picker";
import { AppContext } from "AppContext";
import { AppTheme } from "classes/Settings";
import { createStyle, useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeContext from "ThemeContext";
import { Button } from "react-native-elements";

export default function SettingsScreen() {
    const [theme, setTheme] = useState<AppTheme>()
    const Theme = useContext(ThemeContext);
    const Styles = useStyles('Main')
    const ctx = useContext(AppContext);

    const onSave = () => {
        console.log("saving", theme)
        const PROPS = ctx.Settings.PROPS;
        if(theme == null) return;
        PROPS.THEME.set(theme).then()
        Theme.setTheme(theme);
    }
    useEffect(() => {
        ctx.Settings.PROPS.THEME.get().then(val => setTheme(val));
    }, []);

    return (
        <SafeAreaView style={Styles.Main.container}>
            <View>
                <Picker style={Styles.Main.picker} onValueChange={setTheme} dropdownIconColor={getColor(Theme.theme, 'textPrimary')} mode='dropdown' selectedValue={theme}>
                    <Picker.Item label="Light" value={AppTheme.Light} />
                    <Picker.Item label="Dark" value={AppTheme.Dark} />
                </Picker>
            </View>
            <Button buttonStyle={Styles.Main.button} title='Save' onPress={onSave}/>
        </SafeAreaView>
    )
}