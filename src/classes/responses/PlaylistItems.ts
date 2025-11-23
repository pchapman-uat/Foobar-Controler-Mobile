import { Columns, RawColumns } from "./Player";

export class PlaylistItemsResponse {
	public items: Columns[];
	private offset: number;
	private totalCount: number;
	constructor(playlistItems: Columns[], offset: number, totalCount: number) {
		this.items = playlistItems;
		this.offset = offset;
		this.totalCount = totalCount;
	}
	public static fromJSON(
		json: FullPlaylistItemsResponseJSON,
	): PlaylistItemsResponse {
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
