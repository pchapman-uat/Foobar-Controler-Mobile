import { StyleProps } from "classes/Settings";
import { StyleSheet } from "react-native";

export default ({}: StyleProps) =>
	StyleSheet.create({
		navBarContainer: {
			display: "flex",
			justifyContent: "space-around",
			flexDirection: "row",
			width: "100%",
			padding: 5,
		},
		navBarItem: {
			width: 40,
			height: 40,
		},
	});
