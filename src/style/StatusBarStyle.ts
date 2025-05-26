import { StyleSheet } from "react-native";

export default StyleSheet.create({
    StatusBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    StatusCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    StatusText: {
        verticalAlign: 'middle',
        paddingLeft: '1%'
    },
    MenuIcon: {
        width: 40
    }
})