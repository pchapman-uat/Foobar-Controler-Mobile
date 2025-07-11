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
