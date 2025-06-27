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
import { renderPicker } from "elements/EnumPicker";
import { getEnumKeys } from "helpers/helpers";
type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>
type SettingsProps = {
  navigation: SettingsNavigationProp
}
 type renderItemProps = {
    item: GroupItem<keyof SettingPropTypes>,
    index: number,
}
export default function SettingsScreen({navigation}: SettingsProps) {
    const [theme, setTheme] = useState<AppTheme>()
    const Styles = useStyles('Main', 'Settings', 'Library')
    const ctx = useContext(AppContext);
    
    const [values, setValues] = useState<Partial<SettingPropTypes>>({});
    const [loaded, setLoaded] =useState(false)

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
            setLoaded(true)
        })();
    }, []);
    const SettingsControl = ({ item }: renderItemProps) => {
        const value = values[item.key];
        const [val, setVal] = useState<SettingPropTypes[typeof item.key] | undefined>(value);

        useEffect(() => {
            setVal(value);
        }, [value]);

        const set = (newVal: SettingPropTypes[typeof item.key]) => {
            setVal(newVal);
            setValues(prev => ({ ...prev, [item.key]: newVal }));
        };
        switch (item.type){
            case "string":
                return (<View></View>)
            case "number":{
                
                
                return (
                    <TextInput style={{...Styles.Main.textInput, width: 200}} keyboardType='number-pad' value={val?.toString() ?? ''} onChangeText={set} placeholder={item.getDefault(ctx.Settings).toString()}/>
                )
            }
            case "boolean":{
                console.log((val as boolean) ?? false)
                return (<Switch
                    thumbColor={getColor(ctx.theme, 'buttonPrimary')}
                    value={(val as boolean) ?? false}
                    onValueChange={set}
                    trackColor={{true: getColor(ctx.theme, 'buttonPrimary')}}
                />)
            }
            case "AppTheme":
            case "Screens":
                const values = item.type === "AppTheme" ? AppTheme :
                                item.type === "Screens" ? Screen :
                                (() => { throw new Error("This error should never happen"); })();

                const keys = getEnumKeys(values);

                return (
                <Picker
                    style={Styles.Main.picker}
                    onValueChange={set}
                    dropdownIconColor={getColor(ctx.theme, "textPrimary")}
                    mode="dropdown"
                    selectedValue={val}
                >
                    {renderPicker(keys, values)}
                </Picker>
                );


            default: throw new Error("Unhandled Setting Type of: " + item.type)
        }
    }

    const renderItem = useCallback((item:GroupItem<keyof SettingPropTypes>, index: number) => (
        <View style={[Styles.Library[index % 2 === 0 ? 'rowEven' : 'rowOdd'], Styles.Settings.itemView]} key={index} >
            <Text style={Styles.Settings.itemLabel}>{item.name}</Text>
            <SettingsControl item={item} index={index}/>
        </View>
    ), [loaded]);

    return (
        <SafeAreaView style={Styles.Main.container}>
            <ScrollView style={Styles.Settings.list}>
                {SettingGroups.groups[0].items.map((item, index) => renderItem(item, index))}
            </ScrollView>
            <View style={Styles.Settings.buttonsView}>
                <Button buttonStyle={[Styles.Main.button, Styles.Settings.button]} title='Save' onPress={onSave}/>   
                <Button buttonStyle={[Styles.Main.button, Styles.Settings.button]} title='Cancel' onPress={() => navigation.goBack()}/>    
            </View>
        </SafeAreaView>
    )
}