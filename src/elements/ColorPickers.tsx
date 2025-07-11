import React from "react";
import { useStyles } from "managers/StyleManager";
import { View, Text } from "react-native";
import ColorPicker, {
	BlueSlider,
	ColorFormatsObject,
	GreenSlider,
	OpacitySlider,
	PreviewText,
	RedSlider,
} from "reanimated-color-picker";

export enum ColorPickerOptions {
	Picker1,
}
type ColorPickersProps = {
	kind: ColorPickerOptions;
	currentColor: string;
	onColorPick: (color: ColorFormatsObject) => void;
};

export default function ColorPickers({
	kind,
	currentColor,
	onColorPick,
}: ColorPickersProps) {
	const Styles = useStyles("ColorPicker");
	const Picker1 = () => {
		return (
			<ColorPicker
				value={currentColor}
				sliderThickness={30}
				thumbSize={30}
				thumbShape="circle"
				onCompleteJS={onColorPick}
				thumbAnimationDuration={100}
				style={Styles.ColorPicker.picker}
				adaptSpectrum
				boundedThumb
			>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<View style={{ alignItems: "center" }}>
						<Text style={Styles.ColorPicker.sliderTitle}>R</Text>
						<RedSlider
							style={Styles.ColorPicker.sliderVerticalStyle}
							vertical
							reverse
						/>
					</View>

					<View style={{ alignItems: "center" }}>
						<Text style={Styles.ColorPicker.sliderTitle}>G</Text>
						<GreenSlider
							style={Styles.ColorPicker.sliderVerticalStyle}
							vertical
							reverse
						/>
					</View>

					<View style={{ alignItems: "center" }}>
						<Text style={Styles.ColorPicker.sliderTitle}>B</Text>
						<BlueSlider
							style={Styles.ColorPicker.sliderVerticalStyle}
							vertical
							reverse
						/>
					</View>

					<View style={{ alignItems: "center" }}>
						<Text style={Styles.ColorPicker.sliderTitle}>A</Text>
						<OpacitySlider
							style={Styles.ColorPicker.sliderVerticalStyle}
							vertical
							reverse
						/>
					</View>
				</View>
				<PreviewText style={Styles.ColorPicker.previewTxt} colorFormat="rgba" />
			</ColorPicker>
		);
	};
	return <Picker1 />;
}
