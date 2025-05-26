import { StyleSheet } from "react-native";
import { AppTheme } from "classes/Settings";
import { getColor } from "managers/ThemeManager";

export default (theme: AppTheme) =>  StyleSheet.create({
    nowPlayingContainer: {
       
    },
    alubmArt: {
        height: 300,
        width: 300,
        alignSelf: 'center'
    },
    npText: {
        textAlign: 'center',
        color: getColor(theme, 'textPrimary')
    },
    controlsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
})