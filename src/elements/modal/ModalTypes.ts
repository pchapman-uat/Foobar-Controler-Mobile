import { StyleMapType } from "managers/StyleManager";
import { RASProps } from "./ResetAllSettingsModal";
import { AppContextType } from "AppContext";

export type ActionMap = {
	resetAll: (ctx: AppContextType) => void;
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
export type AllModalProps = RASProps;
