export interface PlayerInfo {
    name: string;
    title: string;
    version: string;
    pluginVersion: string;
}

export class PlayerResponse {
    info: PlayerInfo;

    constructor(info: PlayerInfo) {
        this.info = info;
    }

    static fromJSON(json: any): PlayerResponse {
        console.log("Creating from JSON")
        
        return new PlayerResponse(json.player.info);
    }
}