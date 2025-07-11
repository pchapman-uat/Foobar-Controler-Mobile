import LottieLoading from "assets/lottie/loading.lottie.json";
import { Color } from "classes/Themes";
import { color } from "react-native-elements/dist/helpers";

export { LottieLoading };

export default function updateColors(
	obj: Record<string, any>,
	color: string | [number, number, number, number],
): Record<string, any> {
	if (typeof color === "string") color = Color.stringToLottie(color);
	if (obj && typeof obj === "object") {
		for (const key in obj) {
			if (key === "c" && obj[key]?.k) {
				obj[key].k = color;
			} else if (typeof obj[key] === "object") {
				updateColors(obj[key], color);
			}
		}
	}

	return obj;
}
