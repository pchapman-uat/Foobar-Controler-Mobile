import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";

export type Orientation = "landscape" | "portrait" | "unknown";

export function check(current: Orientation, val: Orientation) {
	return current == val;
}
export function getOri<T, K>(
	current: Orientation,
	val: Orientation,
	_true: T,
	_false: K,
): T | K {
	const state = check(current, val);
	return state ? _true : _false;
}
export function useOrientation() {
	const [orientation, setOrientation] = useState<Orientation>("unknown");

	useEffect(() => {
		// Function to determine the orientation
		const detectOrientation = async () => {
			const current = await ScreenOrientation.getOrientationAsync();
			if (
				current === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
				current === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
			) {
				setOrientation("landscape");
			} else if (
				current === ScreenOrientation.Orientation.PORTRAIT_UP ||
				current === ScreenOrientation.Orientation.PORTRAIT_DOWN
			) {
				setOrientation("portrait");
			} else {
				setOrientation("unknown");
			}
		};

		detectOrientation();

		// Subscribe to orientation changes
		const subscription = ScreenOrientation.addOrientationChangeListener(
			(event) => {
				const orientationInfo = event.orientationInfo.orientation;
				if (
					orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
					orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
				) {
					setOrientation("landscape");
				} else if (
					orientationInfo === ScreenOrientation.Orientation.PORTRAIT_UP ||
					orientationInfo === ScreenOrientation.Orientation.PORTRAIT_DOWN
				) {
					setOrientation("portrait");
				} else {
					setOrientation("unknown");
				}
			},
		);

		return () => {
			ScreenOrientation.removeOrientationChangeListener(subscription);
		};
	}, []);

	return orientation;
}
