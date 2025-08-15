import React from "react";
import Beefweb, { BeefwebClass } from "./classes/BeefWeb";
import Settings, { AppTheme, SettingsClass } from "./classes/Settings";
import { Orientation } from "hooks/useOrientation";

export interface AlertProps {
	title: string;
	message: string;
}
export interface AppContextType {
	BeefWeb: BeefwebClass;
	Settings: SettingsClass;
	theme: AppTheme;
	setTheme: (theme: AppTheme) => void;
	orientation: Orientation;
	alert: (props: AlertProps) => void;
	setModal: (element: React.JSX.Element) => void;
}
const defaultContext: AppContextType = {
	BeefWeb: Beefweb,
	Settings: Settings,
	theme: AppTheme.Light,
	setTheme: () => {},
	orientation: "unknown",
	setModal: () => {},
	alert: () => {},
};

export default React.createContext<AppContextType>(defaultContext);
