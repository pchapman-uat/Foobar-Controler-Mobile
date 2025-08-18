import { StyleMapType } from "managers/StyleManager";
import React from "react";
import { View, Text, Modal, ModalProps } from "react-native";
import { Button } from "react-native-elements";
export interface AlertProps {
	title: string;
	message: string;
	options?: AlertModalOptions[];
}
export type AlertModalProps = {
	alertData: AlertProps | undefined;
	Styles: Pick<StyleMapType, "Main" | "Modal">;
} & ModalProps;

export interface AlertModalOptions {
	optionText: string;
	onPress: () => void;
}
export default function AlertModal({
	alertData,
	Styles,
	...modalProps
}: AlertModalProps) {
	if (!alertData) return;
	const { title, message, options } = alertData;
	console.log(options?.length);
	const optionOnPress = (func: () => void) => {
		func();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		modalProps.onRequestClose?.({} as any);
	};
	return (
		<Modal {...modalProps}>
			<View style={Styles.Modal.modalOverlay}>
				<View style={Styles.Modal.menu}>
					<Text style={Styles.Main.header1}>{title}</Text>
					<Text>{message}</Text>
					<View>
						<Button
							buttonStyle={Styles.Main.button}
							title={"Close"}
							onPress={modalProps.onRequestClose}
						/>
						{options?.map(({ optionText, onPress }, index) => (
							<Button
								key={index}
								buttonStyle={Styles.Main.button}
								title={optionText}
								onPress={() => optionOnPress(onPress)}
							/>
						))}
					</View>
				</View>
			</View>
		</Modal>
	);
}
