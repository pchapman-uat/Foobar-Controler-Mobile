import { AlertProps } from "elements/AlertModal";
import { Orientation } from "hooks/useOrientation";
import React from "react";
import Beefweb from "./classes/BeefWeb";
import Settings, { AppTheme, SettingsClass } from "./classes/Settings";

export interface AppContextType {
	BeefWeb: Beefweb;
	Settings: SettingsClass;
	theme: AppTheme;
	setTheme: (theme: AppTheme) => void;
	orientation: Orientation;
	alert: (props: AlertProps) => void;
	setModal: (element: React.JSX.Element) => void;
}
const defaultContext: AppContextType = {
	BeefWeb: new Beefweb(),
	Settings: Settings,
	theme: AppTheme.Light,
	setTheme: () => {},
	orientation: "unknown",
	setModal: () => {},
	alert: () => {},
};

export default React.createContext<AppContextType>(defaultContext);
