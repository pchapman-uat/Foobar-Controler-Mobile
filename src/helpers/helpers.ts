import { BrowserDirectory, BrowserItem } from "classes/responses/Browser";

export function formatTime(seconds: number = 0): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function printTree(
	item: BrowserItem,
	prefix: string = "",
	isLast: boolean = true,
): void {
	const connector = isLast ? "└── " : "├── ";
	console.log(prefix + connector + item.name);

	if (item instanceof BrowserDirectory && item.children.length > 0) {
		const newPrefix = prefix + (isLast ? "    " : "│   ");
		const lastIndex = item.children.length - 1;

		item.children.forEach((child, index) => {
			const isChildLast = index === lastIndex;
			printTree(child, newPrefix, isChildLast);
		});
	}
}
export function isPrimitive(val: unknown): val is string | number | boolean {
	return (
		typeof val === "string" || typeof val === "number" || typeof val === "boolean"
	);
}
export function keyToIndex<
	T extends Record<string, unknown>,
	K extends keyof T & string,
>(obj: T, key: K): number {
	const keys = Object.keys(obj) as K[];
	return keys.indexOf(key);
}

export function indexToKey<
	T extends Record<string, unknown>,
	K extends keyof T & string,
>(obj: T, index: number): K {
	const keys = Object.keys(obj) as K[];
	return keys[index];
}
