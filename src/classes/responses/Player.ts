export type RawColumns = [
	boolean,
	boolean,
	string,
	string,
	string,
	string,
	number,
	number,
	number,
	string,
	number,
];
export type PlaybackState = "stopped" | "playing" | "paused" | undefined;
export class PlayerResponse {
	public info: PlayerInfo;
	public activeItem: ActiveItem;
	public volume: Volume;
	public playbackState: PlaybackState;
	public sameSong = false;
	constructor(
		info: PlayerInfo,
		activeItem: ActiveItem,
		volume: Volume,
		playbackState: PlaybackState,
	) {
		this.info = info;
		this.activeItem = activeItem;
		this.volume = volume;
		this.playbackState = playbackState;
	}

	public static fromJSON(json: FullPlayerResponseJSON): PlayerResponse {
		const rawActiveItem = json.player.activeItem;
		const rawColumns = rawActiveItem.columns;

		const activeItem: ActiveItem = {
			...rawActiveItem,
			columns: new Columns(rawColumns, rawActiveItem.playlistId),
		};

		return new PlayerResponse(
			json.player.info,
			activeItem,
			json.player.volume,
			json.player.playbackState,
		);
	}
	public compare(old: PlayerResponse) {
		const oldColumns = old.activeItem.columns;
		const newColumns = this.activeItem.columns;
		return newColumns.path == oldColumns.path;
	}
}
interface FullPlayerResponseJSON {
	player: PlayerResponseJSON;
}

interface PlayerResponseJSON {
	info: PlayerInfo;
	activeItem: RawActiveItem;
	volume: Volume;
	playbackState: PlaybackState;
}
export interface PlayerInfo {
	name: string;
	title: string;
	version: string;
	pluginVersion: string;
}
interface RawActiveItem {
	playlistId: string;
	playlistIndex: number;
	index: number;
	position: number;
	duration: number;
	columns: RawColumns;
}
export interface ActiveItem {
	playlistId: string;
	playlistIndex: number;
	index: number;
	position: number;
	duration: number;
	columns: Columns;
}

export class Columns {
	public isPlaying: boolean;
	public isPaused: boolean;
	public albumArtist: string;
	public album: string;
	public artist: string;
	public title: string;
	public trackNumber: number;
	public length: number;
	public elapsed: number;
	public path: string;
	public playlistId?: string;
	public songIndex?: number;
	public rating?: number;

	private static params = [
		"%isplaying%",
		"%ispaused%",
		"%album artist%",
		"%album%",
		"%artist%",
		"%title%",
		"%track number%",
		"%length_seconds%",
		"%playback_time_seconds%",
		"%path%",
		"%rating%",
	];

	constructor(columns: RawColumns, playlistId?: string, songIndex?: number) {
		this.isPlaying = columns[0];
		this.isPaused = columns[1];
		this.albumArtist = columns[2];
		this.album = columns[3];
		this.artist = columns[4];
		this.title = columns[5];
		this.trackNumber = columns[6];
		this.length = columns[7];
		this.elapsed = columns[8];
		this.path = columns[9];
		this.rating = columns[10];
		this.playlistId = playlistId;
		this.songIndex = songIndex;
	}
	public static get columnsQuery() {
		return "?columns=" + this.params.join(",");
	}
}

export interface Volume {
	isMuted: boolean;
	max: number;
	min: number;
	type: string;
	value: number;
}
