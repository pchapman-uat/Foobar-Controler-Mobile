import { StyleSheet } from "react-native";
import { StyleProps } from "classes/Settings";
import { getColor } from "managers/ThemeManager";

export default ({ theme }: StyleProps) =>
	StyleSheet.create({
		itemLabel: {
			color: getColor(theme, "textPrimary"),
			textAlignVertical: "center",
		},
		itemView: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			padding: 10,
		},
		list: {
			flex: 1,
			width: "100%",
		},
		buttonsView: {
			display: "flex",
			flexDirection: "row",
		},
		button: {
			margin: 10,
		},
	});
