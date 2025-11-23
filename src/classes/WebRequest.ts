import { AxiosResponse } from "axios";
import FromJSON from "interfaces/iFromJSON";

export enum RequestStatus {
	OK = 200,

	// Error
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
}

export class WebRequest<T> {
	public status: RequestStatus;
	public data: T;

	private constructor(status: number, data: T) {
		this.status = status;
		this.data = data;
	}

	public static async create<T>(
		response: AxiosResponse,
		type: FromJSON<T>,
	): Promise<WebRequest<T>> {
		const status = response.status;
		const json = await response.data;
		const data = type.fromJSON(json);
		return new WebRequest(status, data);
	}
}
