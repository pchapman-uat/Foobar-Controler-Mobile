import { AppContextType } from "AppContext";
import { requestConfigPermissions } from "managers/PermissionsManager";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import ModalTypes from "./ModalTypes";
export type ESProps = ModalTypes<"exportSettings">;

const exportSettings = async (ctx: AppContextType) => {
	await requestConfigPermissions();
	await ctx.Settings.exportAndSave();
};

export const ESActions: ESProps["action"] = {
	exportSettings: exportSettings,
};

export function ExportSettingsModal(props: ESProps): React.JSX.Element {
	const { Styles, action, ctx } = props;
	return (
		<View>
			<Text>
				Are you sure you want to export your settings? This data is NOT encrypted!!
			</Text>
			<Button
				buttonStyle={Styles.Main.button}
				title={"Export"}
				onPress={() => action.exportSettings(ctx)}
			/>
		</View>
	);
}
