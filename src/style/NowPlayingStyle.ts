import { Dimensions, StyleSheet } from "react-native";
import { getColor } from "managers/ThemeManager";
import { getOri } from "hooks/useOrientation";
import { StyleProps } from "classes/Settings";

export default ({ theme, ori }: StyleProps) => {
	const { width, height } = Dimensions.get("window");
	const imageSize = getOri(ori, "landscape", height * 0.5, width * 0.75);
	return StyleSheet.create({
		nowPlayingContainer: {
			flex: 1,
			backgroundColor: getColor(theme, "background", 0.1),
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
			flexDirection: getOri(ori, "landscape", "row", "column"),
		},
		alubmArt: {
			height: imageSize,
			width: imageSize,
			alignSelf: "center",
		},
		npText: {
			textAlign: "center",
			color: getColor(theme, "textPrimary"),
		},
		buttonContainer: {
			width: "100%",
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-around",
		},
		controlsContainer: {},
		interfaceControler: {
			width: getOri(ori, "landscape", "45%", "100%"),
			padding: 10,
		},
		progressBarContainer: {
			display: "flex",
		},
		progressBarvalues: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
		},
		ratingContainer: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
		},
		ratingStar: {
			width: 30,
			height: 30,
		},
		controlsButton: {
			width: 50,
			height: 50,
		},
	});
};
