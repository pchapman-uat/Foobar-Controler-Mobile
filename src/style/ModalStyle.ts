import { StyleSheet } from "react-native";

export default StyleSheet.create({
     modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menu: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        elevation: 5,
        minWidth: 200,
    },
    menuItem: {
        paddingVertical: 10,
        fontSize: 16,
    },
})