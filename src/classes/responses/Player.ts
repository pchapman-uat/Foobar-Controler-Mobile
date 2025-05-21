export type RawColumns = [boolean, boolean, string, string, string, string, number,number, number, string]

export class PlayerResponse {
    info: PlayerInfo;
    activeItem: ActiveItem;

    constructor(info: PlayerInfo, activeItem: ActiveItem, columns: RawColumns) {
        this.info = info;
        this.activeItem = activeItem;
        this.activeItem.columns = new Columns(columns)
    }

    static fromJSON(json: any): PlayerResponse {
        console.log("Creating from JSON")
        return new PlayerResponse(json.player.info, json.player.activeItem, json.player.activeItem.columns);
    }
}
export interface PlayerInfo {
    name: string;
    title: string;
    version: string;
    pluginVersion: string;
}

export interface ActiveItem {
    playlistId: string;
    playlistIndex: number;
    index: number;
    position: number,
    duration: number,
    columns: Columns,
}

export class Columns {
    isPlaying: boolean;
    isPaused: boolean;
    albumArtist: string;
    album: string;
    artist: string;
    title: string;
    trackNumber: number;
    length: number;
    elapsed: number;
    path: string;

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
    ]

    constructor(columns: RawColumns){
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
    }
    static get columnsQuery() {
        return "?columns="+this.params.join(",")
    }
}