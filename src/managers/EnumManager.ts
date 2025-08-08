import { Recursive } from "classes/responses/Browser";
import { SettingType } from "classes/SettingGroups";
import { AppTheme } from "classes/Settings";
import { Screen } from "enum/Screens";

export type EnumTypeMap = {
	AppTheme: typeof AppTheme;
	Screen: typeof Screen;
	Recursive: typeof Recursive;
};
export function getEnumKeys<T extends Record<string, string | number>>(
	e: T,
): (keyof T)[] {
	return Object.keys(e).filter((k) => isNaN(Number(k))) as (keyof T)[];
}
export type EnumTypes = keyof EnumTypeMap;
const enumTypeRuntimeMap: { [K in EnumTypes]: EnumTypeMap[K] } = {
	AppTheme,
	Screen,
	Recursive,
};
export function getEnumValuesAndKeys<T extends EnumTypes>(
	enumType: T,
): {
	values: EnumTypeMap[T];
	keys: (keyof EnumTypeMap[T])[];
} {
	const runtimeMap: Record<EnumTypes, object> = {
		AppTheme,
		Screen,
		Recursive,
	};

	const val = runtimeMap[enumType] as EnumTypeMap[T];
	const keys = getEnumKeys(val);

	return { values: val, keys };
}
export function isEnumType(type: SettingType): type is EnumTypes {
	return Object.keys(enumTypeRuntimeMap).includes(type);
}
