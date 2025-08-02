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
	readonly items: T[];
	selectedItems: number[] = [];
	limit = 0;
	readonly settings: ArrayItemSettingsProps;
	constructor(settings?: Partial<ArrayItemSettingsProps>, ...items: T[]) {
		this.items = items;
		this.settings = { ...defaults, ...settings };
	}

	getSelection(limit = this.limit) {
		const selection: T[] = [];
		for (const index of this.selectedItems) {
			if (index < 0 || index >= this.items.length) continue;
			if (limit !== 0 && selection.length >= limit) break;
			selection.push(this.items[index]);
		}
		return selection;
	}
}
