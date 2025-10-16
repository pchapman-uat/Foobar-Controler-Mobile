export class PlaylistsResponse extends Array<Playlist> {
	constructor(items: Playlist[]) {
		super(...items);
	}
	public static fromJSON(json: PlaylistResponseJSON): PlaylistsResponse {
		return new PlaylistsResponse(json.playlists);
	}
}

export interface Playlist {
	id: string;
	index: number;
	title: string;
	isCurrent: boolean;
	itemCount: number;
	totaltime: 0;
}

interface PlaylistResponseJSON {
	playlists: Playlist[];
}
