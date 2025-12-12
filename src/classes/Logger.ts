/* eslint-disable no-console */ import Listener from "./Listener";

export enum LogType {
	MESSAGE,
	WARNING,
	ERROR,
}
export class LogMessage<T extends LogType = LogType> {
	public readonly TYPE: T;
	protected readonly DATA: string;
	protected readonly SOURCE: string;
	protected readonly PROPS: LoggerProps | undefined;
	constructor(type: T, data: string, source: string, props?: LoggerProps) {
		this.TYPE = type;
		this.DATA = data;
		this.SOURCE = source;
		this.PROPS = props;
	}

	public get message(): string {
		return `${this.SOURCE} - ${this.DATA}`;
	}
}
export type LoggerEvents = {
	logMessage: LogMessage<LogType>;
	warnMessage: LogMessage<LogType.WARNING | LogType.ERROR>;
	errorMessage: LogMessage<LogType.ERROR>;
};
class LoggerClass extends Listener<LoggerEvents> {
	private send(
		kind: LogType,
		message: string,
		source: string,
		props?: LoggerProps,
	) {
		switch (kind) {
			case LogType.MESSAGE:
				console.log(`${source}: ${message}`);
				break;
			case LogType.WARNING:
				console.warn(`${source}: ${message}`);
				break;
			case LogType.ERROR:
				console.error(`${source}: ${message}`);
				break;
		}
		if (!props?.internal)
			this.dispatchMultiple(new LogMessage(kind, message, source, props));
	}
	private getEvents(kind: LogType): (keyof LoggerEvents)[] {
		switch (kind) {
			case LogType.MESSAGE:
				return ["logMessage", "warnMessage", "errorMessage"];
			case LogType.WARNING:
				return ["warnMessage", "errorMessage"];
			case LogType.ERROR:
				return ["errorMessage"];
		}
	}
	private dispatchMultiple(message: LogMessage<LogType>) {
		const kind = message.TYPE;
		const events = this.getEvents(kind);
		for (const event of events) {
			this.dispatchEvent(event, message);
		}
	}
	public log(source: string, message: string, props?: LoggerProps) {
		this.send(LogType.MESSAGE, message, source, props);
	}
	public warn(source: string, message: string, props?: LoggerProps) {
		this.send(LogType.WARNING, message, source, props);
	}
	public error(
		source: string,
		message: string,
		props?: LoggerProps,
		e?: unknown,
	) {
		this.send(LogType.ERROR, message, source, props);
		console.error(e);
	}
}
export type Stringifiable = { toString(): string };
type LogMode = "Log" | "Warn" | "Error";
export interface LoggerProps {
	internal?: boolean;
}

export abstract class LoggerBaseClass<
	E extends Record<string, unknown> = {},
> extends Listener<E> {
	private readonly LOGGER: LoggerClass = Logger;
	protected abstract readonly SOURCE: string;
	constructor() {
		super();
	}
	private handleMessage(
		mode: LogMode,
		messageOrMessages: Stringifiable | Stringifiable[],
		propsOrNothing?: LoggerProps | Stringifiable,
		...rest: Stringifiable[]
	): void {
		let messages: Stringifiable[] = [];
		let props: LoggerProps | undefined = undefined;

		if (Array.isArray(messageOrMessages)) {
			messages = messageOrMessages;
			if (
				propsOrNothing &&
				typeof propsOrNothing === "object" &&
				"toString" in propsOrNothing === false
			) {
				props = propsOrNothing as LoggerProps;
			}
		} else if (rest.length > 0) {
			messages = [messageOrMessages, propsOrNothing as Stringifiable, ...rest];
		} else {
			messages = [messageOrMessages];
			if (
				propsOrNothing &&
				typeof propsOrNothing === "object" &&
				"toString" in propsOrNothing === false
			) {
				props = propsOrNothing as LoggerProps;
			}
		}
		const stringMessages = messages.map((m) => m.toString()).join(" ");
		switch (mode) {
			case "Log":
				this.LOGGER.log(this.SOURCE, stringMessages, props);
			case "Warn":
			case "Error":
		}
	}
	protected log(message: Stringifiable, props?: LoggerProps): void;
	protected log(message: Stringifiable[], props?: LoggerProps): void;
	protected log(...messages: Stringifiable[]): void;
	protected log(
		messageOrMessages: Stringifiable | Stringifiable[],
		propsOrNothing?: LoggerProps | Stringifiable,
		...rest: Stringifiable[]
	): void {
		this.handleMessage("Log", messageOrMessages, propsOrNothing, ...rest);
	}
	protected warn(message: Stringifiable, props?: LoggerProps): void;
	protected warn(message: Stringifiable[], props?: LoggerProps): void;
	protected warn(...messages: Stringifiable[]): void;
	protected warn(
		messageOrMessages: Stringifiable | Stringifiable[],
		propsOrNothing?: LoggerProps | Stringifiable,
		...rest: Stringifiable[]
	): void {
		this.handleMessage("Warn", messageOrMessages, propsOrNothing, ...rest);
	}
	protected error(
		message: Error | Stringifiable | unknown,
		props?: LoggerProps,
	): void;
	protected error(
		message: (Error | Stringifiable | unknown)[],
		props?: LoggerProps,
	): void;
	protected error(...messages: (Error | Stringifiable | unknown)[]): void;
	protected error(
		messageOrMessages:
			| Error
			| Stringifiable
			| unknown
			| (Error | Stringifiable | unknown)[],
		propsOrNothing?: LoggerProps | Stringifiable,
		...rest: (Error | Stringifiable | unknown)[]
	): void {
		const normalize = (msg: Error | Stringifiable | unknown): Stringifiable => {
			if (msg instanceof Error) return msg.message;
			if (typeof msg === "string") return msg;
			if (msg && typeof msg === "object" && "toString" in msg)
				return msg as Stringifiable;
			return { toString: () => "Unknown Error Occurred" };
		};

		if (Array.isArray(messageOrMessages)) {
			const normalized = messageOrMessages.map(normalize);
			return this.handleMessage("Error", normalized, propsOrNothing as any);
		}

		if (rest.length > 0) {
			const normalized = [
				normalize(messageOrMessages),
				...(propsOrNothing ? [normalize(propsOrNothing)] : []),
				...rest.map(normalize),
			];
			return this.handleMessage("Error", normalized);
		}

		const normalized = normalize(messageOrMessages);

		return this.handleMessage("Error", normalized, propsOrNothing as any);
	}
}

const Logger = new LoggerClass();
export default Logger;

export { LoggerClass as LoggerClass };
