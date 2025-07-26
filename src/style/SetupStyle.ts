import { StyleSheet } from "react-native";
import { StyleProps } from "classes/Settings";
import { getColor } from "managers/ThemeManager";

export default ({ theme }: StyleProps) =>
	StyleSheet.create({
		header: {},
		headerText: {
			textAlign: "center",
		},
		spacer: {
			height: 5,
			backgroundColor: getColor(theme, "buttonPrimary"),
			margin: 5,
			borderRadius: 5,
		},
		container: {
			padding: 10,
		},
	});
