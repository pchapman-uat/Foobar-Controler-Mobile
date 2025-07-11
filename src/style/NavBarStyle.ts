import { StyleSheet } from "react-native";
import { StyleProps } from "classes/Settings";

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
