import { Picker } from "@react-native-picker/picker";

export function renderPicker<T extends Record<string, string | number>>(
	keys: (keyof T)[],
	values: T,
) {
	return keys.map((key) => (
		<Picker.Item
			key={`item-${String(key)}`}
			label={String(key)}
			value={values[key]}
		/>
	));
}
