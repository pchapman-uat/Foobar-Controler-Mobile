import { StyleSheet } from "react-native";
import { AppTheme } from "classes/Settings";
import { getColor, getTheme } from "managers/ThemeManager";

export default (theme: AppTheme) => StyleSheet.create({
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
    justifyContent: 'center'},
}); 