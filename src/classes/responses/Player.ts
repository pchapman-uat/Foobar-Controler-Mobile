export type RawColumns = [boolean, boolean, string, string, string, string, number,number, number, string]

export class PlayerResponse {
    info: PlayerInfo;
    activeItem: ActiveItem;
    volume:Volume;
    sameSong = false;
        constructor(info: PlayerInfo, activeItem: ActiveItem, columns: RawColumns, volume:Volume) {
        this.info = info;
        this.activeItem = activeItem;
        this.activeItem.columns = new Columns(columns, activeItem.playlistId)
        this.volume = volume;
    }

    static fromJSON(json: any): PlayerResponse {
        console.log("Creating from JSON")
        return new PlayerResponse(json.player.info, json.player.activeItem, json.player.activeItem.columns, json.player.volume);
    }
    compare(old:PlayerResponse){
        const oldColumns = old.activeItem.columns;
        const newColumns = this.activeItem.columns;
        return newColumns.path == oldColumns.path;
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
    playlistId?: string;
    songIndex?: number

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

    constructor(columns: RawColumns, playlistId?: string, songIndex?: number){
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
        this.playlistId = playlistId;
        this.songIndex = songIndex
    }
    static get columnsQuery() {
        return "?columns="+this.params.join(",")
    }
}

export interface Volume {
    isMuted: boolean;
    max: number;
    min:number;
    type:string;
    value:number;
}