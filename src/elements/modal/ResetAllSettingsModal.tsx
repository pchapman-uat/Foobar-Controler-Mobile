import { AppContextType } from "AppContext";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import RNRestart from "react-native-restart";
import ModalTypes from "./ModalTypes";
export type RASProps = ModalTypes<"resetAll">;

const resetAll = (ctx: AppContextType) => {
	// TODO: Close Application
	ctx.Settings.resetAll();
	RNRestart.restart();
};

export const RASActions: RASProps["action"] = {
	resetAll: resetAll,
};

export function ResetAllSettingsModal(props: RASProps): React.JSX.Element {
	const { Styles, action, ctx } = props;
	return (
		<View>
			<Text>Are you sure you want to reset all settings?</Text>
			<Button
				buttonStyle={Styles.Main.button}
				title={"Reset All"}
				onPress={() => action.resetAll(ctx)}
			/>
		</View>
	);
}
