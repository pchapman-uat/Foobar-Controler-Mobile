import { Beefweb } from "classes/BeefWeb";
import Validator from "classes/Validated";

export enum BrowserItemType {
	DIRECTORY,
	FILE,
}
export class BrowserRootsResponse {
	public pathSeparator: string;
	public roots: BrowserDirectory[];

	constructor(pathSeparator: string, roots: BrowserDirectory[]) {
		this.pathSeparator = pathSeparator;
		this.roots = roots;
	}
	public static fromJSON(json: BrowserRootsResponseJSON) {
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
	public name: string;
	public path: string;
	public size: number;
	public timestamp: number;
	public abstract kind: BrowserItemType;
	public parent?: BrowserDirectory;
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
	public isDirectory(): this is BrowserDirectory {
		return this.kind === BrowserItemType.DIRECTORY;
	}

	public isFile(): this is BrowserFile {
		return this.kind === BrowserItemType.FILE;
	}

	public getAncestors(): BrowserDirectory[] {
		const ancestors: BrowserDirectory[] = [];
		let current = this.parent;

		while (current) {
			ancestors.unshift(current);
			current = current.parent;
		}

		return ancestors;
	}
	public abstract filter(): boolean;
}

export class BrowserEntriesResponse {
	public entries: (BrowserFile | BrowserDirectory)[];

	constructor(entries: (BrowserFile | BrowserDirectory)[]) {
		this.entries = entries;
	}
	public static fromJSON(json: BrowserEntriesResponseJSON) {
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
	public kind = BrowserItemType.FILE;
	private fileExtension: string;
	public fileCategory: FileCategory;
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
	public checkCustomCategory(custom: Record<string, FileCategory>) {
		const ext = this.fileExtension;
		if (this.fileCategory == FileCategory.UNKNOWN)
			this.fileCategory = custom[ext] ?? FileCategory.UNKNOWN;
	}
	public static fromJSON(json: BrowserEntryItem) {
		return new BrowserFile(json.name, json.path, json.size, json.timestamp);
	}
	public filter(): boolean {
		return this.fileCategory !== FileCategory.UNKNOWN;
	}
}
export enum Recursive {
	NONE,
	ONCE,
	ALL,
}
export class BrowserDirectory extends BrowserItem {
	public kind = BrowserItemType.DIRECTORY;
	public children: (BrowserFile | BrowserDirectory)[] = [];
	public initialized = false;
	public async init(
		beefweb: Beefweb,
		custom: Record<string, FileCategory>,
		recursive: Recursive,
	) {
		console.log("Initializing: ", this.name);
		const validPath = Validator.validate(this.path);
		if (!validPath.isValid()) return this;
		const response = await beefweb.getBrowserEntries(validPath);
		if (response) this.children = response.data.entries;
		for (const child of this.children) {
			child.parent = this;
			if (child instanceof BrowserFile) child.checkCustomCategory(custom);
		}
		if (this.children && recursive) {
			switch (recursive) {
				case Recursive.ONCE:
					await Promise.all(
						this.children
							.filter((child) => child instanceof BrowserDirectory)
							.map((child) => child.init(beefweb, custom, Recursive.NONE)),
					);
					break;
				case Recursive.ALL:
					await Promise.all(
						this.children
							.filter((child) => child instanceof BrowserDirectory)
							.map((child) => child.init(beefweb, custom, recursive)),
					);
					break;
			}
			this.initialized = true;
		} else {
		}

		return this;
	}

	public static fromJSON(json: BrowserEntryItem) {
		return new BrowserDirectory(json.name, json.path, json.size, json.timestamp);
	}
	public filter(): boolean {
		this.children = this.children.filter((child) => {
			const keep = child.filter() || child instanceof BrowserDirectory;
			if (keep) child.parent = this;
			return keep;
		});

		return this.children.length > 0;
	}
}

interface BrowserEntryItem {
	name: string;
	path: string;
	size: number;
	timestamp: number;
	type: "F" | "D";
}
