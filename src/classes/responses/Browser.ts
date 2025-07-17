import { Beefweb } from "classes/BeefWeb";

export enum BrowserItemType {
	DIRECTORY,
	FILE,
}
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
	abstract kind: BrowserItemType;
	parent?: BrowserDirectory;
	constructor(
		name: string,
		path: string,
		size: number,
		timestamp: number,
		parent?: BrowserDirectory,
	) {
		this.name = name;
		this.path = path;
		this.size = size;
		this.timestamp = timestamp;
		this.parent = parent;
	}
	isDirectory(): this is BrowserDirectory {
		return this.kind === BrowserItemType.DIRECTORY;
	}

	isFile(): this is BrowserFile {
		return this.kind === BrowserItemType.FILE;
	}
	getAncestors(): BrowserDirectory[] {
		const ancestors: BrowserDirectory[] = [];
		let current = this.parent;

		while (current) {
			ancestors.unshift(current);
			current = current.parent;
		}

		return ancestors;
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

export enum FileCategory {
	AUDIO,
	PLAYLIST,
	UNKNOWN,
}

const ExtensionToCategoryMap: Record<string, FileCategory> = {
	mp1: FileCategory.AUDIO,
	mp2: FileCategory.AUDIO,
	mp3: FileCategory.AUDIO,
	mp4: FileCategory.AUDIO,
	aac: FileCategory.AUDIO,
	alac: FileCategory.AUDIO,
	wma: FileCategory.AUDIO,
	wav: FileCategory.AUDIO,
	aiff: FileCategory.AUDIO,
	au: FileCategory.AUDIO,
	snd: FileCategory.AUDIO,
	cdxa: FileCategory.AUDIO,
	ogg: FileCategory.AUDIO,
	opus: FileCategory.AUDIO,
	flac: FileCategory.AUDIO,
	wv: FileCategory.AUDIO,
	tta: FileCategory.AUDIO,
	mpc: FileCategory.AUDIO,
	speex: FileCategory.AUDIO,
	ape: FileCategory.AUDIO,
	dsd: FileCategory.AUDIO,
	fpl: FileCategory.PLAYLIST,
	m3u8: FileCategory.PLAYLIST,
};

export class BrowserFile extends BrowserItem {
	kind = BrowserItemType.FILE;
	fileExtension: string;
	fileCategory: FileCategory;
	constructor(name: string, path: string, size: number, timestamp: number) {
		super(name, path, size, timestamp);

		this.fileExtension = this.extractExtension(name);
		this.fileCategory = this.detectFileCategory(this.fileExtension);
	}
	private extractExtension(name: string): string {
		const match = name.match(/\.([a-z0-9]+)$/i);
		return match ? match[1].toLowerCase() : "";
	}
	private detectFileCategory(ext: string): FileCategory {
		return ExtensionToCategoryMap[ext] ?? FileCategory.UNKNOWN;
	}

	static fromJSON(json: BrowserEntryItem) {
		return new BrowserFile(json.name, json.path, json.size, json.timestamp);
	}
}

export class BrowserDirectory extends BrowserItem {
	kind = BrowserItemType.DIRECTORY;
	children: (BrowserFile | BrowserDirectory)[] = [];

	public async init(beefweb: Beefweb) {
		console.log("Initializing: ", this.name);
		const response = await beefweb.getBrowserEntries(this.path);
		if (response) this.children = response.data.entries;
		for (const child of this.children) {
			child.parent = this;
		}
		if (this.children) {
			await Promise.all(
				this.children
					.filter((child) => child instanceof BrowserDirectory)
					.map((child) => (child as BrowserDirectory).init(beefweb)),
			);
		} else {
		}
	}
	public getFilteredCopy(): BrowserDirectory | null {
		const filtered = new BrowserDirectory(
			this.name,
			this.path,
			this.size,
			this.timestamp,
		);

		for (const child of this.children) {
			if (child.isDirectory()) {
				const subdir = (child as BrowserDirectory).getFilteredCopy();
				if (subdir) {
					subdir.parent = filtered;
					filtered.children.push(subdir);
				}
			} else if (
				child.isFile() &&
				(child.fileCategory === FileCategory.AUDIO ||
					child.fileCategory === FileCategory.PLAYLIST)
			) {
				const fileCopy = new BrowserFile(
					child.name,
					child.path,
					child.size,
					child.timestamp,
				);
				fileCopy.parent = filtered;
				filtered.children.push(fileCopy);
			}
		}

		if (filtered.children.length === 0) {
			return null;
		}

		return filtered;
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
