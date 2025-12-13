import { AppContextType } from "AppContext";
import { StyleMapType } from "managers/StyleManager";
import { ESProps } from "./ExportSettingsModal";
import { ISProps } from "./ImportSettingsModal";
import { RASProps } from "./ResetAllSettingsModal";

export type ActionMap = {
	resetAll: (ctx: AppContextType) => void;
	exportSettings: (ctx: AppContextType) => void;
	importSettings: (ctx: AppContextType) => void;
};
export default interface ModalTypes<
	K extends keyof ActionMap = keyof ActionMap,
> {
	Styles: Pick<StyleMapType, "Main">;
	action: {
		[P in K]: ActionMap[P];
	};
	ctx: AppContextType;
}
export type AllModalProps = RASProps | ISProps | ESProps;
