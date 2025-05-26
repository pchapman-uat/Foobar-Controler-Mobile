import { AppTheme } from "classes/Settings";
import { getColor, getTheme } from "managers/ThemeManager";
import { StyleSheet } from "react-native";

export default (theme: AppTheme) => StyleSheet.create({
    StatusBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: getColor(theme, 'background'),
        padding: 5,
    },
    StatusCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    StatusText: {
        verticalAlign: 'middle',
        paddingLeft: '1%',
        color: getColor(theme, 'textPrimary'),
        flex: 1,
        flexShrink: 1,
    },
    MenuIcon: {
        width: 40
    }
})