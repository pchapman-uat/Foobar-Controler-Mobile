import AppContext from "AppContext";
import { AppTheme, StyleProps } from "classes/Settings";
import { Orientation } from "hooks/useOrientation";
import { useContext, useMemo } from "react";
import ColorPickerStyle from "style/ColorPickerStyle";
import SettingsStyle from "style/SettingsStyle";
import SetupStyle from "style/SetupStyle";
import LibraryStyle from "../style/LibraryStyle";
import MainStyle from "../style/MainStyle";
import ModalStyle from "../style/ModalStyle";
import NavBarStyle from "../style/NavBarStyle";
import NowPlayingStyle from "../style/NowPlayingStyle";
import StatusBarStyle from "../style/StatusBarStyle";

type Styles =
	| "Main"
	| "NowPlaying"
	| "Modal"
	| "Navbar"
	| "StatusBar"
	| "Library"
	| "Settings"
	| "ColorPicker"
	| "Setup";

export type StyleMapType = {
	Main: ReturnType<typeof MainStyle>;
	NowPlaying: ReturnType<typeof NowPlayingStyle>;
	Modal: ReturnType<typeof ModalStyle>;
	Navbar: ReturnType<typeof NavBarStyle>;
	StatusBar: ReturnType<typeof StatusBarStyle>;
	Library: ReturnType<typeof LibraryStyle>;
	Settings: ReturnType<typeof SettingsStyle>;
	ColorPicker: ReturnType<typeof ColorPickerStyle>;
	Setup: ReturnType<typeof SetupStyle>;
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
	Setup: SetupStyle,
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
