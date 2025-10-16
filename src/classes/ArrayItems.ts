import { Validatable } from "./Validated";

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
export class ArrayItems<T extends ArrayItemType> implements Validatable {
	public readonly ITEMS: T[];
	public selectedItems: number[] = [];
	public limit = 0;
	public readonly SETTINGS: ArrayItemSettingsProps;
	constructor(settings?: Partial<ArrayItemSettingsProps>, ...items: T[]) {
		this.ITEMS = items;
		this.SETTINGS = { ...defaults, ...settings };
	}

	public getSelection(limit = this.limit) {
		const selection: T[] = [];
		for (const index of this.selectedItems) {
			if (index < 0 || index >= this.ITEMS.length) continue;
			if (limit !== 0 && selection.length >= limit) break;
			selection.push(this.ITEMS[index]);
		}
		return selection;
	}
	public validate() {
		return this.limit >= 0 && this.selectedItems.length <= this.limit;
	}
}

export class ChoiceArrayItems<T extends ArrayItemType> implements Validatable {
	public readonly ITEMS: T[];
	public selectedIndex: number = 0;
	constructor(...items: T[]) {
		this.ITEMS = items;
	}
	public validate(): boolean {
		return this.selectedIndex > 0 && this.selectedIndex < this.ITEMS.length;
	}

	public getItem() {
		console.warn(this.ITEMS[this.selectedIndex]);
		return this.ITEMS[this.selectedIndex];
	}
	public static init(json: ChoiceArrayItemsJSON<ArrayItemType>) {
		const obj = new this(...json.ITEMS);
		obj.selectedIndex = json.selectedIndex;
		return obj;
	}
}

export interface ChoiceArrayItemsJSON<T extends ArrayItemType> {
	ITEMS: T[];
	selectedIndex: number;
}
