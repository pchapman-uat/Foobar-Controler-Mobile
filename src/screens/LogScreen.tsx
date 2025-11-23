import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import Logger, { LogMessage } from "classes/Logger";
import { useStyles } from "managers/StyleManager";
import { useState } from "react";
import React, { SafeAreaView, Text, View } from "react-native";

type LogNavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

type LogScreenProps = {
	navigation: LogNavigationProps;
};

export default function LogScreen({}: LogScreenProps) {
	const Styles = useStyles("Main");
	const [messages, setMessages] = useState<LogMessage[]>([]);
	const onMessage = (message: LogMessage) => [
		setMessages((messages) => [...messages, message]),
	];
	Logger.addEventListener("logMessage", onMessage);
	return (
		<SafeAreaView style={Styles.Main.container}>
			{messages.map((item, i) => (
				<LogMessageElement item={item} key={"message" + i} />
			))}
		</SafeAreaView>
	);
}

interface LogMessageElementProps {
	item: LogMessage;
	key: string;
}
function LogMessageElement({ item }: LogMessageElementProps) {
	return (
		<View>
			<Text>{item.message}</Text>
		</View>
	);
}
