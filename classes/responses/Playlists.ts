export class PlaylistsResponse extends Array<Playlist>{
    constructor(items:Playlist[]){
       super(...items)
    }
    static fromJSON(json: any): PlaylistsResponse {
        return new PlaylistsResponse(json.playlists)
    }
}

export interface Playlist {
    id:string;
    inded:number;
    title:string;
    isCurrent:boolean;
    itemCount:number;
    totaltime:0;
}