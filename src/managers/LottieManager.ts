import LottieLoading from "assets/lottie/loading.lottie.json";
import { Color } from "classes/Themes";
export { LottieLoading };

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function updateColors(
	obj: Record<string, any>,
	color: string | [number, number, number, number],
): Record<string, unknown> {
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
