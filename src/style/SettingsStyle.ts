import { StyleSheet } from "react-native";
import { AppTheme } from "classes/Settings";
import { getColor } from "managers/ThemeManager";

export default (theme: AppTheme) => StyleSheet.create({
    itemLabel: {
        color: getColor(theme, 'textPrimary'),
        textAlignVertical: 'center'
    },
    itemView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    list: {
        flex: 1,
        width: '100%'
    },
    buttonsView: {
        display: 'flex',
        flexDirection: 'row'
    },
    button: {
        margin: 10
    }
})