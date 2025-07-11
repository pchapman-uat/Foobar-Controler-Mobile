export default interface FromJSON<T> {
	fromJSON(json: unknown): T;
}
