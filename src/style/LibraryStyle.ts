import { StyleSheet } from "react-native";
import { StyleProps } from "classes/Settings";
import { getColor } from "managers/ThemeManager";

export default ({ theme }: StyleProps) =>
	StyleSheet.create({
		item: {
			margin: 5,
		},
		itemText: {
			color: getColor(theme, "textPrimary"),
			verticalAlign: "middle",
		},
		gridItemContainer: {
			width: 100,
			margin: 10,
		},
		gridItemImage: {
			width: 100,
			height: 100,
		},
		gridContainer: {
			width: "auto",
		},
		gridItemText: {
			color: getColor(theme, "textPrimary"),
			textAlign: "center",
		},
		activeItem: {
			outlineColor: "yellow",
			outlineWidth: 3,
		},
		icon: {
			width: 40,
			height: 40,
			marginRight: 10,
		},
		itemRow: {
			display: "flex",
			flexDirection: "row",
		},
		rowEven: {
			backgroundColor: getColor(theme, "rowEven"),
		},
		rowOdd: {
			backgroundColor: getColor(theme, "rowOdd"),
		},
	});
