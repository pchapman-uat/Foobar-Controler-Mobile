import React from "react";
import { View, Text } from "react-native";
type CodeTextProps = {
	language?: "JSON";
	code: string;
};

export default function CodeText({ code }: CodeTextProps) {
	return (
		<View>
			<Text>{code}</Text>
		</View>
	);
}
