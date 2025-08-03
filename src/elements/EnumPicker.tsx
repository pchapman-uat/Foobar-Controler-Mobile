import React from "react";
import { Picker } from "@react-native-picker/picker";
type EnumPickerProps<T extends Record<string, string | number>> = {
	keys: string[];
	values: T;
};
export default function EnumPicker<T extends Record<string, string | number>>({
	keys,
	values,
}: EnumPickerProps<T>) {
	return keys.map((key) => (
		<Picker.Item
			key={`item-${String(key)}`}
			label={String(key)}
			value={values[key]}
		/>
	));
}
