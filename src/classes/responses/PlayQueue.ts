import { Columns, RawColumns } from "./Player";

export default class PlayQueueResponse extends Array<QueueItem> {

    constructor(playQueue: QueueItem[]){
        super(...playQueue)
    }

    static fromJSON(json:any):PlayQueueResponse {
        const queue:any[] = json.playQueue
        const playQueue = queue.map(item => new QueueItem(item.columns, item.itemIndex, item.playlistId, item.playlistIndex))
        return new PlayQueueResponse(playQueue);
    }
}

export class QueueItem {
    columns: Columns;
    itemIndex: number;
    playlistId: string;
    playlistIndex: number;

    constructor(columnsRaw:RawColumns, itemIndex: number, playlistId: string, playlistIndex: number){
        this.columns = new Columns(columnsRaw);
        this.itemIndex = itemIndex;
        this.playlistId = playlistId;
        this.playlistIndex = playlistIndex;
    }
}