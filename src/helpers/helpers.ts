import { BrowserDirectory, BrowserItem } from "classes/responses/Browser";

export function formatTime(seconds: number = 0): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getEnumKeys<T extends Record<string, string | number>>(
	e: T,
): (keyof T)[] {
	return Object.keys(e).filter((k) => isNaN(Number(k))) as (keyof T)[];
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
