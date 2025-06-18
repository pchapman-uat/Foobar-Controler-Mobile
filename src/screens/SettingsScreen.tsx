import { Picker } from "@react-native-picker/picker";
import AppContext from "AppContext";
import { AppTheme, themes } from "classes/Settings";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Switch } from "react-native-elements";

export default function SettingsScreen() {
    const [theme, setTheme] = useState<AppTheme>()
    const [dynamicBackground, setDynamicBackground] = useState<boolean>()
    const [automaticUpdates, setAutomaticUpdates] = useState<boolean>()
    const [updateFrequency, setUpdateFrequency] = useState<string>()

    const Styles = useStyles('Main')
    const ctx = useContext(AppContext);

    const onSave = () => {
        console.log("saving", theme)
        const PROPS = ctx.Settings.PROPS;
        if(theme == null) return;
        PROPS.THEME.set(theme)
        ctx.setTheme(theme);
        if(dynamicBackground == null) return
        PROPS.DYNAMIC_BACKGROUND.set(dynamicBackground)
        ctx.BeefWeb.setState(automaticUpdates??ctx.Settings.getDefault('AUTOMATIC_UPDATES'))
        PROPS.AUTOMATIC_UPDATES.set(automaticUpdates)
        console.warn("Look at this!", updateFrequency)
        if(updateFrequency){
            const freq = Number.parseInt(updateFrequency)
            if (!isNaN(freq)) {
                const cappedValue = Math.max(freq, 100);
                if(cappedValue >= 0) PROPS.UPDATE_FREQUENCY.set(cappedValue);
                ctx.BeefWeb.restart()
            }
        }
    }

    useEffect(() => {
        ctx.Settings.get('THEME').then(setTheme);
        ctx.Settings.get('DYNAMIC_BACKGROUND').then(setDynamicBackground)
        ctx.Settings.get('AUTOMATIC_UPDATES').then(setAutomaticUpdates)
        ctx.Settings.get('UPDATE_FREQUENCY').then((e)=> setUpdateFrequency(e.toString()))
    }, []);

    return (
        <SafeAreaView style={Styles.Main.container}>
            <View>
                <Picker style={Styles.Main.picker} onValueChange={setTheme} dropdownIconColor={getColor(ctx.theme, 'textPrimary')} mode='dropdown' selectedValue={theme}>
                    {themes.map((item, index) => (
                        <Picker.Item key={'themes-'+item} label={item} value={index as AppTheme} />
                    ))}
                </Picker>
                <View style={Styles.Main.switchContainer}>
                    <Text style={Styles.Main.swtichLable}>Dynamic Background</Text>
                    <Switch
                        thumbColor={getColor(ctx.theme, 'buttonPrimary')}
                        value={dynamicBackground}
                        onValueChange={setDynamicBackground}
                        trackColor={{true: getColor(ctx.theme, 'buttonPrimary')}}
                    />
                </View>
                <View style={Styles.Main.switchContainer}>
                    <Text style={Styles.Main.swtichLable}>Automatic Updates</Text>
                    <Switch
                        thumbColor={getColor(ctx.theme, 'buttonPrimary')}
                        value={automaticUpdates}
                        onValueChange={setAutomaticUpdates}
                        trackColor={{true: getColor(ctx.theme, 'buttonPrimary')}}
                    />
                </View>
                <TextInput style={{...Styles.Main.textInput, width: 200}} keyboardType='number-pad' value={updateFrequency?.toString()} placeholder={ctx.Settings.getDefault('UPDATE_FREQUENCY').toString()} onChangeText={setUpdateFrequency}/>
            </View>
            <Button buttonStyle={Styles.Main.button} title='Save' onPress={onSave}/>
        </SafeAreaView>
    )
}