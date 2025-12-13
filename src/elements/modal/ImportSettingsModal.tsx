import { AppContextType } from "AppContext";
import { requestConfigPermissions } from "managers/PermissionsManager";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import RNRestart from "react-native-restart";
import ModalTypes from "./ModalTypes";
export type ISProps = ModalTypes<"importSettings">;

const importSettings = async (ctx: AppContextType) => {
	await requestConfigPermissions();
	await ctx.Settings.importAndLoad();
	RNRestart.restart();
};

export const ISActions: ISProps["action"] = {
	importSettings: importSettings,
};

export function ImportSettingsModal(props: ISProps): React.JSX.Element {
	const { Styles, action, ctx } = props;
	return (
		<View>
			<Text>
				Are you sure you want to import your settings? Make sure the file was not
				modified and is from a trusted source.
			</Text>
			<Button
				buttonStyle={Styles.Main.button}
				title={"Import"}
				onPress={() => action.importSettings(ctx)}
			/>
		</View>
	);
}
