import { AppTheme, StyleProps } from "classes/Settings";
import MainStyle from "../style/MainStyle";
import NowPlayingStyle from "../style/NowPlayingStyle";
import ModalStyle from "../style/ModalStyle";
import NavBarStyle from "../style/NavBarStyle";
import StatusBarStyle from "../style/StatusBarStyle";
import LibraryStyle from "../style/LibraryStyle";
import { useContext, useMemo } from "react";
import AppContext from "AppContext";
import { Orientation } from "hooks/useOrientation";
import SettingsStyle from "style/SettingsStyle";
import ColorPickerStyle from "style/ColorPickerStyle";

type Styles =
	| "Main"
	| "NowPlaying"
	| "Modal"
	| "Navbar"
	| "StatusBar"
	| "Library"
	| "Settings"
	| "ColorPicker";

export type StyleMapType = {
	Main: ReturnType<typeof MainStyle>;
	NowPlaying: ReturnType<typeof NowPlayingStyle>;
	Modal: ReturnType<typeof ModalStyle>;
	Navbar: ReturnType<typeof NavBarStyle>;
	StatusBar: ReturnType<typeof StatusBarStyle>;
	Library: ReturnType<typeof LibraryStyle>;
	Settings: ReturnType<typeof SettingsStyle>;
	ColorPicker: ReturnType<typeof ColorPickerStyle>;
};

const styleMap: {
	[K in Styles]: (props: StyleProps) => StyleMapType[K];
} = {
	Main: MainStyle,
	NowPlaying: NowPlayingStyle,
	Modal: ModalStyle,
	Navbar: NavBarStyle,
	StatusBar: StatusBarStyle,
	Library: LibraryStyle,
	Settings: SettingsStyle,
	ColorPicker: ColorPickerStyle,
};

export function createStyle<T extends Styles>(
	theme: AppTheme,
	ori: Orientation,
	...styles: T[]
): Pick<StyleMapType, T> {
	console.log("updating style");
	const result = {} as Pick<StyleMapType, T>;
	for (const style of styles) {
		result[style] = styleMap[style]({ theme, ori });
	}
	return result;
}

export function useStyles<T extends Styles>(...styles: T[]) {
	const { theme, orientation } = useContext(AppContext);
	return useMemo(
		() => createStyle(theme, orientation, ...styles),
		[theme, orientation],
	);
}
