import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from "react-native";
import { AppTheme } from "classes/Settings";

import MainStyle from "../style/MainStyle";
import NowPlayingStyle from "../style/NowPlayingStyle";
import ModalStyle from "../style/ModalStyle";
import NavBarStyle from "../style/NavBarStyle";
import StatusBarStyle from "../style/StatusBarStyle";
import LibraryStyle from "../style/LibraryStyle";
import { useContext, useMemo } from "react";
import ThemeContext from "ThemeContext";

type Styles = 'Main' | 'NowPlaying' | 'Modal' | 'Navbar' | 'StatusBar' | 'Library';

// Infer the types from each module
type StyleMapType = {
  Main: ReturnType<typeof MainStyle>;
  NowPlaying: ReturnType<typeof NowPlayingStyle>;
  Modal: ReturnType<typeof ModalStyle>;
  Navbar: ReturnType<typeof NavBarStyle>;
  StatusBar: ReturnType<typeof StatusBarStyle>;
  Library: ReturnType<typeof LibraryStyle>;
};

const styleMap: { [K in Styles]: (theme: AppTheme) => StyleMapType[K] } = {
  Main: MainStyle,
  NowPlaying: NowPlayingStyle,
  Modal: ModalStyle,
  Navbar: NavBarStyle,
  StatusBar: StatusBarStyle,
  Library: LibraryStyle,
};

export function createStyle<T extends Styles>(
  theme: AppTheme,
  ...styles: T[]
): Pick<StyleMapType, T> {
  console.log("updating style")
  const result = {} as Pick<StyleMapType, T>;
  for (const style of styles) {
    result[style] = styleMap[style](theme);
  }
  return result;
}

export function useStyles<T extends Styles>(...styles: T[]) {
  const { theme } = useContext(ThemeContext);
  return useMemo(() => createStyle(theme, ...styles), [theme]);
}
