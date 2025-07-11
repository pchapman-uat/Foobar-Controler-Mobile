import { PlayerResponse } from "../classes/responses/Player";
import { WebRequest } from "../classes/WebRequest";

export type WebPlayerResponse = WebRequest<PlayerResponse> | undefined;
export type AsyncWebPlayerResponse = Promise<WebPlayerResponse>;
