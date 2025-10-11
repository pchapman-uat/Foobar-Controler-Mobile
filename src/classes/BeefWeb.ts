import { NetworkInfo } from "react-native-network-info";
import {
	AsyncWebPlayerResponse,
	WebPlayerResponse,
} from "../managers/TypeManager";
import { AddPlaylistResponse } from "./responses/AddPlaylist";
import { Columns, PlayerResponse } from "./responses/Player";
import { PlaylistItemsResponse } from "./responses/PlaylistItems";
import { Playlist, PlaylistsResponse } from "./responses/Playlists";
import PlayQueueResponse from "./responses/PlayQueue";
import { RequestStatus, WebRequest } from "./WebRequest";
import axios, { AxiosResponse } from "axios";
import {
	AudioPro,
	AudioProContentType,
	AudioProEvent,
	AudioProEventType,
} from "react-native-audio-pro";
import { SettingsDefaults } from "./Settings";
import FromJSON from "interfaces/iFromJSON";
import {
	BrowserEntriesResponse,
	BrowserRootsResponse,
} from "./responses/Browser";
import Listener, { EventHandler } from "./Listener";
import { LoggerBaseClass, LoggerClass, LoggerEvents } from "./Logger";
import { ChoiceArrayItems } from "./ArrayItems";

type AudioProTrack = {
	id: string;
	url: string | number;
	title: string;
	artwork: string;
	album: string;
	artist: string;
};
export enum Status {
	Offline,
	Online,
	Error,
}

export enum State {
	Running,
	Stopped,
	Disconnected,
}
export class Connection {
	protected ip?: string;
	protected port?: number;
	valid() {
		return !!this.ip && !!this.port;
	}
	set(ip: string, port: number) {
		this.setIp(ip);
		this.setPort(port);
	}
	setIp(ip: string) {
		this.ip = ip;
	}
	setPort(port: number) {
		this.port = port;
	}
	getUrl(): string | null {
		if (this.valid()) return `http://${this.ip}:${this.port}/api`;
		return null;
	}

	getIp() {
		return this.ip;
	}
	getPort() {
		return this.port;
	}
}

export type BeefWebEvents = {
	update: WebPlayerResponse;
	songChange: WebPlayerResponse;
};
export class Beefweb extends LoggerBaseClass<BeefWebEvents> {
	protected SOURCE: string = "BeefWeb";
	/**
	 * Status for the Beefweb server, defining if it is online/offline or similar
	 * @see {@link Status}
	 */
	public status = Status.Offline;
	/**
	 * The connection manager for Beefweb, this generates the URL and manages the IP and Port
	 * @see {@link Connection}
	 */
	private con = new Connection();
	/**
	 * The active state of Beefweb connection, if it is connected, disconnected, or having an error
	 * @see {@link State}
	 */
	public state = State.Disconnected;

	/**
	 * The duration in milliseconds that Axios will time out when fetching or posting
	 * @see {@link axios}
	 */
	private readonly TIMEOUT = 500;
	/**
	 * The frequency that which the client will update in milliseconds
	 * - NOTE: Currently only uses the default {@link SettingsDefaults.UPDATE_FREQUENCY} and does not use the actual setting
	 *
	 */
	private updateFrequency = SettingsDefaults.UPDATE_FREQUENCY;
	/**
	 * The most recent player response, updated ever {@link Beefweb.getPlayer}
	 */
	lastPlayer?: PlayerResponse;

	readonly MOBILE_PLAYLIST_TITLE = "Mobile Playlist";

	/**
	 * Authentication object to handle Username and Password
	 */
	private authentication = {
		enabled: false,
		username: "",
		password: "",
	};

	/**
	 * The interval in which updates the client from the server
	 */
	private mainInterval?: ReturnType<typeof setInterval>;

	constructor(logger: LoggerClass) {
		super(logger);
		this.init();
	}

	private startInterval() {
		if (!this.mainInterval) {
			this.mainInterval = setInterval(() => this.onUpdate(), this.updateFrequency);
			this.state = State.Running;
		}
	}

	private stopInterval(
		interval?: ReturnType<typeof setInterval>,
		restart = false,
	) {
		if (interval) clearInterval(interval);
		this.state = State.Stopped;
		// this.onUpdate()
		if (restart) this.startInterval();
	}

	setState = (t: boolean) => {
		try {
			if (t) this.startInterval();
			else this.stopInterval(this.mainInterval);
		} catch (e) {}
	};

	setUsername = (username: string) => {
		this.authentication.username = username;
	};
	setPassword = (password: string) => {
		this.authentication.password = password;
	};
	setAuthenticationEnabled = (enabled: boolean) => {
		this.authentication.enabled = enabled;
	};
	setIp = (ip: ChoiceArrayItems<string>) => {
		console.log("HELLO!? ");
		this.con.setIp(ip.getItem());
	};
	setPort = (port: number) => {
		this.con.setPort(port);
	};
	restart = () => {
		this.stopInterval(this.mainInterval, true);
	};

	private init() {
		AudioPro.configure({
			contentType: AudioProContentType.SPEECH,
			debug: true,
		});
		this.addEventListener("songChange", (e) =>
			this.updateNotificationPannel(e, this.albumArtiURI),
		);
		AudioPro.addEventListener((event) => {
			switch (event.type) {
				case AudioProEventType.REMOTE_NEXT:
					this.onNotificationSkip(event);
				case AudioProEventType.REMOTE_PREV:
					this.onNotificationBack(event);
			}
		});
	}
	async findBeefwebServer(port = 8880) {
		const base = await this.getLocalSubnetBase();
		const ips = [];

		for (let i = 1; i <= 254; i++) {
			ips.push(`${base}.${i}`);
		}

		const checkPromises = ips.map((ip) => this.checkServer(ip, port));

		const results = await Promise.all(checkPromises);
		const found = results.filter((ip) => ip !== null);
		return found;
	}
	private async getLocalSubnetBase() {
		const ipAddress = await NetworkInfo.getIPV4Address();
		if (!ipAddress) throw new Error("Unable to get local IP address.");
		const base = ipAddress.split(".").slice(0, 3).join(".");
		return base;
	}
	private async checkServer(ip: string, port = 8880, timeout = 500) {
		try {
			const response = await axios.get(`http://${ip}:${port}/api/player`, {
				timeout,
			});
			if (response?.data?.player?.info?.name) {
				return ip;
			}
		} catch {}
		return null;
	}

	private async onUpdate() {
		const player = await this.getPlayer();
		if (!player) return;
		this.dispatchEvent("update", player);
	}
	private async updateNotificationPannel(
		player: WebPlayerResponse,
		albumArtiURI: string,
	) {
		if (!player) return;
		const activeItem = player.data.activeItem;
		const columns = activeItem.columns;
		const track = this.createTrackNotification({
			id: "track-" + activeItem.index,
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			url: require("../assets/audio/silence.mp3"), // NOTE: Currently I do not know how to use a module for an mp3 file
			title: columns.title,
			artwork: albumArtiURI,
			artist: columns.artist,
			album: columns.album,
		});
		if (track) {
			AudioPro.play(track, { autoPlay: false });
		} else this.warn("Invalid Track");
	}
	private createTrackNotification(track: AudioProTrack) {
		const validate = (value?: string | number) =>
			typeof value !== "undefined" && value !== null && value !== "";
		if (
			validate(track.album) &&
			validate(track.artist) &&
			validate(track.artwork) &&
			validate(track.id) &&
			validate(track.title) &&
			validate(track.url)
		)
			return track;
		return null;
	}

	private onNotificationSkip({}: AudioProEvent) {
		this.skip();
	}
	private onNotificationBack({}: AudioProEvent) {
		this.previous();
	}

	private fromRequestStatus(status: RequestStatus) {
		if (status == RequestStatus.OK) this.status = Status.Online;
		else this.status = Status.Offline;
	}
	private async createWebRequest<T>(
		response: AxiosResponse<T>,
		type: FromJSON<T>,
	): Promise<WebRequest<T>> {
		const _response = await WebRequest.create<T>(response, type);
		this.fromRequestStatus(_response.status);
		return _response;
	}
	async getPlayer(): AsyncWebPlayerResponse {
		const response = await this._fetch<PlayerResponse>(
			this.combineUrl("player") + Columns.columnsQuery,
		);
		if (response) {
			const playerResponse = await this.createWebRequest<PlayerResponse>(
				response,
				PlayerResponse,
			);
			if (this.lastPlayer) {
				playerResponse.data.sameSong = playerResponse.data.compare(this.lastPlayer);
				if (!playerResponse.data.sameSong)
					this.dispatchEvent("songChange", playerResponse);
			}
			this.lastPlayer = playerResponse.data;

			return playerResponse;
		}
	}

	async getPlaylists() {
		const response = await this._fetch<PlaylistsResponse>(
			this.combineUrl("playlists"),
		);
		if (response) {
			const playlistsResponse = await this.createWebRequest<PlaylistsResponse>(
				response,
				PlaylistsResponse,
			);
			return playlistsResponse;
		}
	}

	async getPlaylistItems(playlistId: string) {
		const playlistInfo = await this._fetch<Playlist>(
			this.combineUrl("playlists", playlistId),
		);
		if (playlistInfo && playlistInfo.data.itemCount) {
			const response = await this._fetch<PlaylistItemsResponse>(
				this.combineUrl(
					"playlists",
					playlistId,
					"items",
					`0:${playlistInfo.data.itemCount}`,
				) + Columns.columnsQuery,
			);
			if (response) {
				return await this.createWebRequest<PlaylistItemsResponse>(
					response,
					PlaylistItemsResponse,
				);
			}
		}
	}

	async getPlaybackQueue() {
		const response = await this._fetch<PlayQueueResponse>(
			this.combineUrl("playqueue") + Columns.columnsQuery,
		);
		if (response) {
			return await this.createWebRequest<PlayQueueResponse>(
				response,
				PlayQueueResponse,
			);
		}
	}
	async getBrowserRoots() {
		const response = await this._fetch<BrowserRootsResponse>(
			this.combineUrl("browser", "roots"),
		);
		if (response) {
			return await this.createWebRequest<BrowserRootsResponse>(
				response,
				BrowserRootsResponse,
			);
		}
	}
	async getBrowserEntries(path: string) {
		const url = this.combineUrl("browser", "entries") + "?path=" + path;
		const response = await this._fetch<BrowserEntriesResponse>(url);
		if (response) {
			return await this.createWebRequest<BrowserEntriesResponse>(
				response,
				BrowserEntriesResponse,
			);
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
			});
			totalItems.push(...response.data.items);
		}

		return totalItems;
	}

	async getUniqueSongs() {
		return this.getUnique("path");
	}

	async getUniqueArtists() {
		return this.getUnique("artist");
	}

	async getUnique(key: keyof Columns) {
		const songs = await this.getAllSongs();
		return {
			songs: [...new Map(songs.map((item) => [item.path, item])).values()],
			unique: [...new Map(songs.map((item) => [item[key], item])).values()],
		};
	}

	async getArtwork(playlistId: string, index: number) {
		const url = this.con.getUrl();
		return url
			? this.combineUrl(url, "artwork", playlistId, index.toString())
			: null;
	}
	async playSong(playlistId: string, songId: number) {
		await this._post(
			this.combineUrl("player", "play", playlistId, songId.toString()),
		);
	}

	async queueSong(playlistId: string, songId: number) {
		await this._post(this.combineUrl("playqueue", "add"), {
			plref: playlistId,
			itemIndex: songId,
		});
	}

	async toggle() {
		if (this.lastPlayer?.playbackState == "stopped") {
			this.play();
		} else {
			await this._post(this.combineUrl("player", "pause", "toggle"));
		}
	}

	async skip() {
		await this._post(this.combineUrl("player", "next"));
	}
	async play() {
		await this._post(this.combineUrl("player", "play"));
	}
	async stop() {
		await this._post(this.combineUrl("player", "stop"));
	}

	async previous() {
		await this._post(this.combineUrl("player", "previous"));
	}
	async removeFromQueue(
		plref: string | number,
		itemIndex: number,
		queueIndex: number,
	) {
		await this._post(this.combineUrl("playqueue", "remove"), {
			plref,
			itemIndex,
			queueIndex,
		});
	}

	async setVolume(volume: number) {
		await this._post(this.combineUrl("player"), { volume });
	}

	async setPosition(position: number) {
		await this._post(this.combineUrl("player"), { position });
	}

	async addPlaylist(
		title: string,
		setCurrent: boolean,
		index: number,
		columns?: Columns[],
	) {
		const response = await this._post<AddPlaylistResponse>(
			this.combineUrl("playlists", "add"),
			{
				title,
				index,
				setCurrent,
			},
		);
		if (response && columns) {
			const result = await this.createWebRequest<AddPlaylistResponse>(
				response,
				AddPlaylistResponse,
			);
			this.addItemsToPlaylist(
				columns.map((item) => item.path),
				result.data.id,
				false,
				true,
			);
			return result;
		}
	}

	async addItemsToPlaylist(
		items: string[],
		playlistId: string,
		replace = true,
		play = true,
	) {
		await this._post(this.combineUrl("playlists", playlistId, "items", "add"), {
			index: 0,
			async: true,
			replace,
			play,
			items,
		});
	}

	async addToMobilePlaylist(items: string[], replace = true, play = true) {
		const playlists = await this.getPlaylists();
		if (playlists) {
			let id: string | null = null;
			for (const item of playlists.data) {
				if (item.title == this.MOBILE_PLAYLIST_TITLE) {
					id = item.id;
					break;
				}
			}
			if (!id) {
				const result = await this.addPlaylist(
					this.MOBILE_PLAYLIST_TITLE,
					true,
					999,
				);
				if (result) {
					id = result.data.id;
				}
			}
			if (id) {
				this.addItemsToPlaylist(items, id, replace, play);
			}
		}
	}

	async playPlaylist(playlistId: string, index = 0) {
		await this._post(
			this.combineUrl("player", "play", playlistId, index.toString()),
		);
	}
	get albumArtiURI() {
		const url = this.con.getUrl();
		return url
			? this.combineUrl(url, "artwork", "current") + `?d=${Date.now()}`
			: "";
	}

	setConnection(ip: string, port: number) {
		this.con.set(ip, port);
	}
	private getAuth() {
		if (!this.authentication.enabled) return undefined;
		return {
			username: this.authentication.username,
			password: this.authentication.password,
		};
	}
	private async _fetch<T>(path: string): Promise<AxiosResponse<T> | null> {
		const url = this.con.getUrl();
		if (url) {
			const fullUrl = this.combineUrl(url, path);
			const auth = this.getAuth();
			try {
				const response = await axios.get(fullUrl, { timeout: this.TIMEOUT, auth });
				return response;
			} catch (error) {
				this.status = Status.Error;
				return null;
			}
		}
		this.status = Status.Error;
		return null;
	}

	private async _post<T>(
		path: string,
		body?: object,
	): Promise<AxiosResponse<T> | null> {
		const url = this.con.getUrl();
		if (url) {
			try {
				const auth = this.getAuth();
				return await axios.post(this.combineUrl(url, path), body, {
					timeout: this.TIMEOUT,
					auth,
				});
			} catch (error) {
				this.status = Status.Error;
				return null;
			}
		}
		this.status = Status.Error;
		return null;
	}

	private combineUrl(...paths: string[]) {
		return paths.join("/");
	}
}
export default Beefweb;
