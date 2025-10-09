export type EventHandler<T = unknown> = (data: T) => void;

export default class Listener<E extends Record<string, unknown>> {
	protected listeners: {
		[K in keyof E]?: Array<EventHandler<E[K]>>;
	} = {};

	public addEventListener<K extends keyof E>(
		event: K,
		handler: EventHandler<E[K]>,
	): void {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event]!.push(handler);
	}

	public removeEventListener<K extends keyof E>(
		event: K,
		handler: EventHandler<E[K]>,
	): void {
		const list = this.listeners[event];
		if (!list) return;

		const updated = list.filter((h): h is EventHandler<E[K]> => h !== handler);

		if (updated.length === 0) {
			delete this.listeners[event];
		} else {
			this.listeners[event] = updated as (typeof this.listeners)[typeof event];
		}
	}

	protected dispatchEvent<K extends keyof E>(event: K, data: E[K]): void {
		if (!this.listeners[event]) return;
		this.listeners[event]!.forEach((handler) => handler(data));
	}
}
