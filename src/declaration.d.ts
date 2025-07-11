import type { AnimationObject } from "lottie-react-native";
declare module "*.svg" {
	import React from "react";
	import { SvgProps } from "react-native-svg";
	const content: React.FC<SvgProps>;
	export default content;
}
declare module "*.png" {
	const content: number;
	export default content;
}

declare module "*.jpg" {
	const content: number;
	export default content;
}

declare module "*.jpeg" {
	const content: number;
	export default content;
}

declare module "*.lottie.json" {
	const content: AnimationObject;
	export default content;
}
declare module "*.mp3" {
	const content: number;
	export default content;
}
