import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

type ListProps = {
	type: "ordered" | "unordered";
	items: string[];
	containerStyle?: ViewStyle;
	textStyle?: TextStyle;
};
export default function List({
	type,
	items,
	containerStyle,
	textStyle,
}: ListProps) {
	const format = (item: string, index: number) => {
		if (type == "ordered") return `${index + 1}. ${item}`;
		else return "• " + item;
	};
	return (
		<View style={containerStyle}>
			{items.map((item, index) => (
				<View key={index}>
					<Text style={textStyle}>{format(item, index)}</Text>
				</View>
			))}
		</View>
	);
}
