import { StyleSheet } from "react-native";
import { AppTheme } from "classes/Settings";
import { getColor, getTheme } from "managers/ThemeManager";

export default (theme: AppTheme) => {
  const primaryText =  {
    color: getColor(theme, 'textPrimary')
  }
  return StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: getColor(theme, 'background')
    },
    container: {
      flex: 1,
      backgroundColor: getColor(theme, 'backgroundAccent'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerBlock: {
      height: '100%',
      width: '100%'
    },
    statusItem: {
      textAlign: 'center',
      color: getColor(theme, 'textPrimary')
    },
    textInput: {
      borderWidth: 1,
      margin: 5,
      borderColor: getColor(theme,'border'),
      color: getColor(theme, 'textPrimary')
    },
    checkBox: {
      backgroundColor: getColor(theme, 'buttonSecondary'),
      color: getColor(theme, 'textPrimary'),
      borderWidth: 0
    },
    button:{
      backgroundColor: getColor(theme, 'buttonPrimary')
    },
    picker: {
      width: 200,
      backgroundColor: getColor(theme, 'buttonSecondary'),
      color: getColor(theme, 'textPrimary')
    },

    swtichLable: {
      fontSize: 18, 
      verticalAlign: 'middle',
      color: getColor(theme, 'textPrimary')
    },
    switchContainer: {
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'center'
    },
    primaryText,
    centeredText: {
      ...primaryText,
      textAlign: 'center'
    },
    header1: {
      ...primaryText,
      fontSize: 50,
      textAlign: 'center'
    },
    header2: {
      ...primaryText,
      fontSize: 25,
      textAlign: 'center'
    },
    header3: {
      ...primaryText,
      fontSize: 15,
      textAlign: 'center'
    },
    hyperlink: {
      ...primaryText,
      textDecorationLine: 'underline',
      color: getColor(theme, 'buttonPrimary')
    },
  }); 
}