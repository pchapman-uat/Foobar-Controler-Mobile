import { StyleSheet } from "react-native";
import { AppTheme } from "classes/Settings";
import { getColor } from "managers/ThemeManager";

export default (theme: AppTheme) => StyleSheet.create({
    item: {
        margin: 5
    },
    itemText: {
        color: getColor(theme, 'textPrimary')
    }
})