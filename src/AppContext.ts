import React from "react";
import Beefweb from "./classes/BeefWeb";
import Settings, { AppTheme, SettingsClass } from "./classes/Settings";
import { Orientation } from "hooks/useOrientation";
import { AlertProps } from "elements/AlertModal";
import Logger, { LoggerClass } from "classes/Logger";

export interface AppContextType {
	BeefWeb: Beefweb;
	Settings: SettingsClass;
	theme: AppTheme;
	setTheme: (theme: AppTheme) => void;
	orientation: Orientation;
	alert: (props: AlertProps) => void;
	setModal: (element: React.JSX.Element) => void;
	Logger: LoggerClass;
}
const defaultContext: AppContextType = {
	BeefWeb: new Beefweb(Logger),
	Settings: Settings,
	theme: AppTheme.Light,
	setTheme: () => {},
	orientation: "unknown",
	setModal: () => {},
	alert: () => {},
	Logger,
};

export default React.createContext<AppContextType>(defaultContext);
