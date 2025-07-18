import { Columns, RawColumns } from "./Player";

export class PlaylistItemsResponse {
	items: Columns[];
	offset: number;
	totalCount: number;
	constructor(playlistItems: Columns[], offset: number, totalCount: number) {
		this.items = playlistItems;
		this.offset = offset;
		this.totalCount = totalCount;
	}
	static fromJSON(json: FullPlaylistItemsResponseJSON): PlaylistItemsResponse {
		console.log("Creating from JSON");
		const rawColumns: { columns: RawColumns }[] = json.playlistItems.items;
		const columns = rawColumns.map((item) => new Columns(item.columns));
		return new PlaylistItemsResponse(
			columns,
			json.playlistItems.offset,
			json.playlistItems.totalCount,
		);
	}
}

interface FullPlaylistItemsResponseJSON {
	playlistItems: PlaylistItemsResponseJSON;
}
interface PlaylistItemsResponseJSON {
	items: ColumnsContainerJSON[];
	offset: number;
	totalCount: number;
}
interface ColumnsContainerJSON {
	columns: RawColumns;
}
