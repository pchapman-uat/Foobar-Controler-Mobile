import AppContext from "AppContext";
import LottieView from "lottie-react-native";
import updateColors, { LottieLoading } from "managers/LottieManager";
import { useStyles } from "managers/StyleManager";
import { LogoSVG } from "managers/SVGManager";
import { getColor } from "managers/ThemeManager";
import { useContext, useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadingScreen() {
	const style = useStyles("Main");
	const ctx = useContext(AppContext);
	useEffect(() => {
		updateColors(LottieLoading, getColor(ctx.theme, "buttonPrimary"));
	}, [ctx]);
	return (
		<SafeAreaView style={style.Main.container}>
			<Text style={style.Main.header2}>Loading...</Text>
			<LogoSVG width={250} height={250} />
			<LottieView
				source={LottieLoading}
				autoPlay
				loop
				style={{ width: 100, height: 100 }}
			/>
		</SafeAreaView>
	);
}
