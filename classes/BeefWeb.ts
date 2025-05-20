import { Columns, PlayerResponse } from "./responses/Player";
import { WebRequest } from "./WebRequest";
import axios from "axios";

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

    async getPlayer(){
        const response = await this._fetch(this.combineUrl("player")+Columns.columnsQuery)
        console.log("done")
        if(response) {
            const playerResponse = await WebRequest.create<PlayerResponse>(response, PlayerResponse);
            return playerResponse;
        }
    }
    get albumArtiURI() {
        const url = this.con.getUrl()
        return url ? this.combineUrl(url, "artwork", "current")+`?d=${Date.now()}` : ""
    }
    setConnection(ip: string, port:number){
        this.con.set(ip, port);
    }

    private async _fetch(path: string){
        const url = this.con.getUrl();
        if(url){
            try {
                const response = await axios.get(this.con.getUrl()+"/"+path, {timeout: 5000})
                return response;
            } catch {
                return null
            }
            
        }
        return null;
    }

    private _post(){
        throw new Error("Uniplimented Method")
    }

    private combineUrl(...paths: string[]){
        return paths.join("/")
    }
}