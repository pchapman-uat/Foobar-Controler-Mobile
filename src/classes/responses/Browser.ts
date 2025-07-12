import { Beefweb } from "classes/BeefWeb";

export class BrowserRootsResponse {
	pathSeparator: string;
	roots: BrowserDirectory[];

	constructor(pathSeparator: string, roots: BrowserDirectory[]) {
		this.pathSeparator = pathSeparator;
		this.roots = roots;
	}
	static fromJSON(json: BrowserRootsResponseJSON) {
		return new BrowserRootsResponse(
			json.pathSeparator,
			json.roots.map(BrowserDirectory.fromJSON),
		);
	}
}
interface BrowserRootsResponseJSON {
	pathSeparator: string;
	roots: BrowserEntryItem[];
}

export abstract class BrowserItem {
	name: string;
	path: string;
	size: number;
	timestamp: number;

	constructor(name: string, path: string, size: number, timestamp: number) {
		this.name = name;
		this.path = path;
		this.size = size;
		this.timestamp = timestamp;
	}
}

export class BrowserEntriesResponse {
	entries: (BrowserFile | BrowserDirectory)[];

	constructor(entries: (BrowserFile | BrowserDirectory)[]) {
		this.entries = entries;
	}
	static fromJSON(json: BrowserEntriesResponseJSON) {
		const entries = json.entries.map((item) => {
			if (item.type == "D") {
				return BrowserDirectory.fromJSON(item);
			} else {
				return BrowserFile.fromJSON(item);
			}
		});

		return new BrowserEntriesResponse(entries);
	}
}

interface BrowserEntriesResponseJSON {
	entries: BrowserEntryItem[];
}

export class BrowserFile extends BrowserItem {
	static fromJSON(json: BrowserEntryItem) {
		return new BrowserFile(json.name, json.path, json.size, json.timestamp);
	}
}

export class BrowserDirectory extends BrowserItem {
	children: (BrowserFile | BrowserDirectory)[] = [];

	public async init(beefweb: Beefweb) {
		console.log("Initializing: ", this.name);
		const response = await beefweb.getBrowserEntries(this.path);
		if (response) this.children = response.data.entries;
		if (this.children) {
			await Promise.all(
				this.children
					.filter((child) => child instanceof BrowserDirectory)
					.map((child) => (child as BrowserDirectory).init(beefweb)),
			);
		} else {
		}
	}

	static fromJSON(json: BrowserEntryItem) {
		return new BrowserDirectory(json.name, json.path, json.size, json.timestamp);
	}
}

interface BrowserEntryItem {
	name: string;
	path: string;
	size: number;
	timestamp: number;
	type: "F" | "D";
}
