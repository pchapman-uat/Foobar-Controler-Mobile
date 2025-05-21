import { Columns, PlayerResponse } from "./responses/Player";
import { PlaylistItemsResponse } from "./responses/PlaylistItems";
import { PlaylistsResponse } from "./responses/Playlists";
import PlayQueueResponse from "./responses/PlayQueue";
import { WebRequest } from "./WebRequest";
import axios, { AxiosResponse } from "axios";

enum Status {
    Offline,
    Online
}

class Connection {
    protected ip?: string;
    protected port?: number;
    valid(){
        return !!this.ip && !!this.port
    }
    set(ip:string, port: number){

        this.ip = ip;
        this.port = port;
    }
    getUrl(): string | null {
        if (this.valid()) return `http://${this.ip}:${this.port}/api`;
        return null;
    }

    getIp(){
        return this.ip;
    }
    getPort() {
        return this.port;
    }
}

export default class Beefweb {
    status = Status.Offline
    con = new Connection();
    readonly timeout = {timeout: 5000};

    async getPlayer(){
        const response = await this._fetch(this.combineUrl("player")+Columns.columnsQuery)
        console.log("done")
        if(response) {
            const playerResponse = await WebRequest.create<PlayerResponse>(response, PlayerResponse);
            return playerResponse;
        }
    }

    async getPlaylists(){
        const response = await this._fetch(this.combineUrl("playlists"));
        if(response){
            const playlistsResponse = await WebRequest.create<PlaylistsResponse>(response, PlaylistsResponse);
            return playlistsResponse;
        }
    }

    async getPlaylistItems(playlistId:string){
        const playlistInfo = await this._fetch(this.combineUrl("playlists", playlistId));
        if(playlistInfo && playlistInfo.data.itemCount){
            const response = await this._fetch(this.combineUrl("playlists", playlistId, "items", `0:${playlistInfo.data.itemCount}`)+Columns.columnsQuery)
            if(response){
                return await WebRequest.create<PlaylistItemsResponse>(response, PlaylistItemsResponse)
            }
        }
    }

    async getPlaybackQueue(){
        const response = await this._fetch(this.combineUrl("playqueue")+Columns.columnsQuery);
        if(response){
            return await WebRequest.create<PlayQueueResponse>(response, PlayQueueResponse);
        }
    }
    async playSong(playlistId:string, songId:number){
        await this._post(this.combineUrl("player", "play", playlistId,songId.toString()))
    }

    async queueSong(playlistId:string, songId:number){
       await this._post(this.combineUrl("playqueue", "add"), {plref: playlistId, itemIndex: songId})
    }

    async toggle(){
       await this._post(this.combineUrl("player", "pause", "toggle"));
    }

    async skip(){
        await this._post(this.combineUrl("player", "next"))
    }
    get albumArtiURI() {
        const url = this.con.getUrl()
        return url ? this.combineUrl(url, "artwork", "current")+`?d=${Date.now()}` : ""
    }
    setConnection(ip: string, port:number){
        this.con.set(ip, port);
    }

    private async _fetch(path: string): Promise<AxiosResponse<any, any> | null>{
        const url = this.con.getUrl();
        if(url){
            const fullUrl = this.combineUrl(url,path)
            try {
                const response = await axios.get(fullUrl, this.timeout)
                return response;
            } catch {
                console.warn("Fetch Failed!")
                console.log(fullUrl)
                return null
            }
            
        }
        return null;
    }

    private async _post(path: string, body?:object): Promise<AxiosResponse<any, any> | null>{
        const url = this.con.getUrl();
        if(url){
            try {
                console.log(this.combineUrl(url, path), this.timeout)
                return await axios.post(this.combineUrl(url, path), body, this.timeout)
            } catch (error) {
                console.warn("Post Failed!")
                console.error(error)
                return null;
            }
        }
        return null;
    }

    private combineUrl(...paths: string[]){
        return paths.join("/")
    }
}