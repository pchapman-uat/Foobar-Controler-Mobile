import { Picker } from "@react-native-picker/picker";
import AppContext from "AppContext";
import { AppTheme, SettingPropTypes, SettingsDefaults, themes } from "classes/Settings";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Switch } from "react-native-elements";
import { Screen, screens } from "enum/Screens";
import SettingGroups, { GroupItem } from "classes/SettingGroups";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>
type SettingsProps = {
  navigation: SettingsNavigationProp
}
export default function SettingsScreen({navigation}: SettingsProps) {
    const [theme, setTheme] = useState<AppTheme>()
    const Styles = useStyles('Main', 'Settings', 'Library')
    const ctx = useContext(AppContext);

    type renderItemProps = {
        item: GroupItem<keyof SettingPropTypes>,
        index: number
    }
    
    const [values, setValues] = useState<Partial<SettingPropTypes>>({});

    const onSave = async () => {
        const entries = Object.entries(values) as [keyof SettingPropTypes, SettingPropTypes[keyof SettingPropTypes]][];
     
        await Promise.all(
            entries.map(([key, value]) => {
                console.log('Setting: ', key, " To: ", value)
                return ctx.Settings.set(key, value)
            })
        );
   
        if(values.THEME != null){
            ctx.setTheme(values.THEME);
            setTheme(values.THEME)
        }
        navigation.goBack()
    };

    useEffect(() => {
        (async () => {
            const entries = await Promise.all(
                (Object.keys(SettingsDefaults) as (keyof SettingPropTypes)[]).map(async key => {
                    const value = await ctx.Settings.get(key);
                    return [key, value] as const;
                })
            );

            setValues(Object.fromEntries(entries));
        })();
    }, []);
    const SettingsControl = ({ item }: renderItemProps) => {
        const value = values[item.key];
        console.warn("Current Value for key: ",item.key, "is: ", value)
        const updateValue = (newValue: SettingPropTypes[typeof item.key]) => {
            setValues(prev => ({ ...prev, [item.key]: newValue }));
        };

        switch (item.type){
            case "string":
                return (<View></View>)
            case "number":{
                const typedValue = (value ?? "").toString();
                return (
                    <TextInput style={{...Styles.Main.textInput, width: 200}} keyboardType='number-pad' value={typedValue} onChangeText={text => updateValue(text)} placeholder={item.getDefault(ctx.Settings).toString()}/>
                )
            }
            case "boolean":{
                const typedValue = (value as boolean) ?? false;
                return (<Switch
                    thumbColor={getColor(ctx.theme, 'buttonPrimary')}
                    value={typedValue}
                    onValueChange={text => updateValue(text)}
                    trackColor={{true: getColor(ctx.theme, 'buttonPrimary')}}
                />)
            }
            case "AppTheme":
            case "Screens":{
                var thing: any[];
                if(item.type == 'AppTheme') thing = themes;
                else if(item.type == 'Screens') thing = screens;
                else thing = []
                return (
                <Picker style={Styles.Main.picker} onValueChange={updateValue} dropdownIconColor={getColor(ctx.theme, 'textPrimary')} mode='dropdown' selectedValue={value}>
                    {thing.map((item, index) => (
                        <Picker.Item key={'item-'+item} label={item} value={index} />
                    ))}
                </Picker>)
                
            }
            default: throw new Error("Unhandled Setting Type of: " + item.type)
        }
    }

    const renderItem = useCallback(({ item, index }:renderItemProps) => (
        <View style={[Styles.Library[index % 2 === 0 ? 'rowEven' : 'rowOdd'], Styles.Settings.itemView]} key={index} >
            <Text style={Styles.Settings.itemLabel}>{item.name}</Text>
            <SettingsControl item={item} index={index}/>
        </View>
    ), [values, ctx.theme, Styles.Main]);

    return (
        <SafeAreaView style={Styles.Main.container}>
            <ScrollView style={Styles.Settings.list}>
                {SettingGroups.groups[0].items.map((item, index) => renderItem({item, index}))}
            </ScrollView>
            <View>
                <Button buttonStyle={Styles.Main.button} title='Save' onPress={onSave}/>    
            </View>
        </SafeAreaView>
    )
}