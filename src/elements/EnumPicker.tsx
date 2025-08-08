import React from "react";
import {
	Picker,
	PickerProps,
	PickerItemProps,
} from "@react-native-picker/picker";
type EnumPickerProps<T extends Record<string, string | number>> = {
	keys: string[];
	values: T;
	itemProps?: PickerItemProps;
} & PickerProps;
export default function EnumPicker<T extends Record<string, string | number>>({
	keys,
	values,
	...pickerProps
}: EnumPickerProps<T>) {
	return (
		<Picker {...pickerProps}>
			{keys.map((key) => (
				<Picker.Item
					key={`item-${String(key)}`}
					label={String(key)}
					value={values[key]}
				/>
			))}
		</Picker>
	);
}
