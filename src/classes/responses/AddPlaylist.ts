export class AddPlaylistResponse {
	public id: string;
	public index: number;
	public title: string;
	public isCurrent: boolean;
	public itemCount: number;
	public totalTime: number;
	constructor(
		id: string,
		index: number,
		title: string,
		isCurrent: boolean,
		itemCount: number,
		totalTime: number,
	) {
		this.id = id;
		this.index = index;
		this.title = title;
		this.isCurrent = isCurrent;
		this.itemCount = itemCount;
		this.totalTime = totalTime;
	}
	public static fromJSON(json: AddPlaylistResponseJSON): AddPlaylistResponse {
		return new AddPlaylistResponse(
			json.id,
			json.index,
			json.title,
			json.isCurrent,
			json.itemCount,
			json.totalTime,
		);
	}
}
interface AddPlaylistResponseJSON {
	id: string;
	index: number;
	title: string;
	isCurrent: boolean;
	itemCount: number;
	totalTime: number;
}
