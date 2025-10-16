import { Columns, RawColumns } from "./Player";

export default class PlayQueueResponse extends Array<QueueItem> {
	constructor(playQueue: QueueItem[]) {
		super(...playQueue);
	}

	public static fromJSON(json: PlayQueueResponseJSON): PlayQueueResponse {
		const queue: PlayqueueResponseItemJSON[] = json.playQueue;
		const playQueue = queue.map(
			(item) =>
				new QueueItem(
					item.columns,
					item.itemIndex,
					item.playlistId,
					item.playlistIndex,
				),
		);
		return new PlayQueueResponse(playQueue);
	}
}

interface PlayQueueResponseJSON {
	playQueue: PlayqueueResponseItemJSON[];
}
interface PlayqueueResponseItemJSON {
	columns: RawColumns;
	itemIndex: number;
	playlistId: string;
	playlistIndex: number;
}
export class QueueItem {
	public columns: Columns;
	public itemIndex: number;
	public playlistId: string;
	public playlistIndex: number;

	constructor(
		columnsRaw: RawColumns,
		itemIndex: number,
		playlistId: string,
		playlistIndex: number,
	) {
		this.columns = new Columns(columnsRaw, playlistId);
		this.itemIndex = itemIndex;
		this.playlistId = playlistId;
		this.playlistIndex = playlistIndex;
	}
}
