import { StyleProps } from "classes/Settings";
import { getColor } from "managers/ThemeManager";
import { StyleSheet } from "react-native";

export default ({ theme }: StyleProps) =>
	StyleSheet.create({
		StatusBarContainer: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-around",
			backgroundColor: getColor(theme, "background"),
			padding: 5,
		},
		StatusCircle: {
			width: 40,
			height: 40,
			borderRadius: 20,
		},
		StatusText: {
			verticalAlign: "middle",
			paddingLeft: "1%",
			color: getColor(theme, "textPrimary"),
		},
		MenuIcon: {
			width: 40,
		},
		StatusTextContainer: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "center",
		},
	});
