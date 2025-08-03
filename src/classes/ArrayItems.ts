export type ArrayItemType = string | number;
export type ArrayItemTypeKeys = "string" | "number";

interface ArrayItemSettingsProps {
	enforceUnique: boolean;
	max: number;
	min: number;
}
const defaults: ArrayItemSettingsProps = {
	enforceUnique: false,
	max: 0,
	min: 0,
};
export class ArrayItems<T extends ArrayItemType> {
	readonly ITEMS: T[];
	selectedItems: number[] = [];
	limit = 0;
	readonly SETTINGS: ArrayItemSettingsProps;
	constructor(settings?: Partial<ArrayItemSettingsProps>, ...items: T[]) {
		this.ITEMS = items;
		this.SETTINGS = { ...defaults, ...settings };
	}

	getSelection(limit = this.limit) {
		const selection: T[] = [];
		for (const index of this.selectedItems) {
			if (index < 0 || index >= this.ITEMS.length) continue;
			if (limit !== 0 && selection.length >= limit) break;
			selection.push(this.ITEMS[index]);
		}
		return selection;
	}
}
