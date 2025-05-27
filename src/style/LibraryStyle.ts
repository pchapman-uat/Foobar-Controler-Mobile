import { StyleSheet } from "react-native";
import { AppTheme } from "classes/Settings";
import { getColor } from "managers/ThemeManager";

export default (theme: AppTheme) => StyleSheet.create({
    item: {
        margin: 5
    },
    itemText: {
        color: getColor(theme, 'textPrimary')
    },
    gridItemContainer: {
        width: 100,
        margin: 10
    },
    gridItemImage: {
        width: 100,
        height: 100
    },
    gridContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    }, 
    gridItemText: {
        color: getColor(theme, 'textPrimary'),
        textAlign: 'center'
    }
})