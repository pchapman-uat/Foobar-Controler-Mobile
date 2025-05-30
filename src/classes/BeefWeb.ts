import { AsyncWebPlayerResponse, WebPlayerResponse } from "../managers/TypeManager";
import { items } from "./NavBar";
import { AddPlaylistResponse } from "./responses/AddPlaylist";
import { Columns, PlayerResponse } from "./responses/Player";
import { PlaylistItemsResponse } from "./responses/PlaylistItems";
import { PlaylistsResponse } from "./responses/Playlists";
import PlayQueueResponse from "./responses/PlayQueue";
import { RequestStatus, WebRequest } from "./WebRequest";
import axios, { AxiosResponse } from "axios";

export enum Status {
    Offline,
    Online,
    Error
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
type EventHandler<T = any> = (data: T) => void;

export type BeefWebEvents = {
    update: AsyncWebPlayerResponse
}

export default class Beefweb {
    status = Status.Offline;
    con = new Connection();
    readonly timeout = { timeout: 5000 };
    lastPlayer?: PlayerResponse;
    readonly mobilePlaylistTitle = "Mobile Playlist"

    private listeners: {
        [K in keyof BeefWebEvents]?: Array<EventHandler<BeefWebEvents[K]>>;
    } = {};

    private mainInterval?:number;

    constructor(){
        // this.start()
    }

    addEventListener<K extends keyof BeefWebEvents>(
        event: K,
        handler: EventHandler<BeefWebEvents[K]>
    ): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(handler);
    }

    removeEventListener<K extends keyof BeefWebEvents>(
        event: K,
        handler: EventHandler<BeefWebEvents[K]>
    ): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event]!.filter(h => h !== handler);
    }

    private dispatchEvent<K extends keyof BeefWebEvents>(
        event: K,
        data: BeefWebEvents[K]
    ): void {
        if (!this.listeners[event]) return;
        this.listeners[event]!.forEach(handler => handler(data));
    }

    public start(){
        if(!this.mainInterval) this.mainInterval = setInterval(() => this.onUpdate(), 1000) 
    }   

    private onUpdate(){
        this.dispatchEvent("update", this.getPlayer())
    }

    private fromRequestStatus(status: RequestStatus){
        if(status == RequestStatus.OK) this.status = Status.Online;
        else this.status = Status.Offline
    }
    private async createWebRequest<T>(response:AxiosResponse<any,any>, type: any):Promise<WebRequest<T>>{
        const _response = await WebRequest.create<T>(response, type);
        this.fromRequestStatus(_response.status);
        return _response;
    }
    async getPlayer(): AsyncWebPlayerResponse{
        const response = await this._fetch(this.combineUrl("player")+Columns.columnsQuery)
        console.log("done")
        if(response) {
            const playerResponse = await this.createWebRequest<PlayerResponse>(response, PlayerResponse);
            if(this.lastPlayer) {
                playerResponse.data.sameSong = playerResponse.data.compare(this.lastPlayer)
            }
            this.lastPlayer = playerResponse.data;
            
            return playerResponse;
        }
    }

    async getPlaylists(){
        const response = await this._fetch(this.combineUrl("playlists"));
        if(response){
            const playlistsResponse = await this.createWebRequest<PlaylistsResponse>(response, PlaylistsResponse);
            return playlistsResponse;
        }
    }

    async getPlaylistItems(playlistId:string){
        const playlistInfo = await this._fetch(this.combineUrl("playlists", playlistId));
        if(playlistInfo && playlistInfo.data.itemCount){
            const response = await this._fetch(this.combineUrl("playlists", playlistId, "items", `0:${playlistInfo.data.itemCount}`)+Columns.columnsQuery)
            if(response){
                return await this.createWebRequest<PlaylistItemsResponse>(response, PlaylistItemsResponse)
            }
        }
    }

    async getPlaybackQueue(){
        const response = await this._fetch(this.combineUrl("playqueue")+Columns.columnsQuery);
        if(response){
            return await this.createWebRequest<PlayQueueResponse>(response, PlayQueueResponse);
        }
    }

    async getAllSongs(): Promise<Columns[]> {
        const playlists = await this.getPlaylists();
        if (!playlists) return [];

        const totalItems: Columns[] = [];

        for (const playlist of playlists.data) {
            const response = await this.getPlaylistItems(playlist.id);
            if (!response) continue;
            response.data.items.forEach((item, index) => {
                item.playlistId = playlist.id;
                item.songIndex = index; 
            }
         
            )
            totalItems.push(...response.data.items);
        }

        return totalItems;
    }

    async getUniqueSongs() {
       return this.getUnique('path')
    }

    async getUniqueArtists(){
        return this.getUnique('artist')
    }

    async getUnique(key: keyof Columns){
        const songs = await this.getAllSongs();
        return {
            songs,
            unique: [...new Map(songs.map(item => [item[key], item])).values()]
        };
    }

    async getArtwork(playlistId: string, index:number){
        const url = this.con.getUrl()
        return url ? this.combineUrl(url, "artwork", playlistId, index.toString()) : null
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
    
    async removeFromQueue(plref: string|number, itemIndex: number, queueIndex: number){
        await this._post(this.combineUrl("playqueue", "remove"), {plref, itemIndex, queueIndex})
    }

    async setVolume(volume: number) {
        await this._post(this.combineUrl("player"), {volume})
    }

    async setPosition(position: number){
        await this._post(this.combineUrl("player"), {position} )
    }

    async addPlaylist(title: string, setCurrent: boolean, index:number, columns?:Columns[]){
        const response = await this._post(this.combineUrl("playlists", "add"), {title, index, setCurrent})
        if(response && columns){
            const result = await this.createWebRequest<AddPlaylistResponse>(response, AddPlaylistResponse)
            this.addItemsToPlaylist(columns.map(item => item.path),result.data.id, false, true)
            return result
        }
    }

    async addItemsToPlaylist(items:string[], playlistId:string, replace = true, play = true){
        await this._post(this.combineUrl('playlists', playlistId, 'items', 'add'), {index: 0, async:true, replace, play, items})
    }

    async addToMobilePlaylist(items: string[], replace = true, play = true){
        const playlists = await this.getPlaylists();
        if(playlists){
            let id:string|null = null;
           for(let item of playlists.data) {
                if(item.title == this.mobilePlaylistTitle) {
                    console.log("Found it!", item)
                    id = item.id
                    break;
                }
            }
            if(!id){
                const result = await this.addPlaylist(this.mobilePlaylistTitle, true, 999)
                if(result){
                    id = result.data.id
                }
            }
            if(id){
                this.addItemsToPlaylist(items, id)
            }
        }
    }

    async playPlaylist(playlistId: string, index=0){
        await this._post(this.combineUrl('player', 'play', playlistId, index.toString()))
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
            } catch (error) {
                console.warn("Fetch Failed!")
                console.error(error)
                this.status = Status.Error;
                return null
            }
            
        }
        this.status = Status.Error;
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
                this.status = Status.Error;
                return null;
            }
        }
        this.status = Status.Error;
        return null;
    }

    private combineUrl(...paths: string[]){
        return paths.join("/")
    }
}