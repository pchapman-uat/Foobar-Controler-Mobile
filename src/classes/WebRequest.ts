import { AxiosResponse } from "axios";
import FromJSON from "interfaces/iFromJSON";

export enum RequestStatus {
	// Sucess
	OK = 200,

	// Error
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
}

export class WebRequest<T> {
	status: RequestStatus;
	data: T;

	private constructor(status: number, data: T) {
		this.status = status;
		this.data = data;
	}

	static async create<T>(
		response: AxiosResponse,
		type: FromJSON<T>,
	): Promise<WebRequest<T>> {
		const status = response.status;
		const json = await response.data;
		console.log(json);
		const data = type.fromJSON(json);
		return new WebRequest(status, data);
	}
}
