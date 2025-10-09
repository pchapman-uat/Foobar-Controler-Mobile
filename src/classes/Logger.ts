import Listener from "./Listener";

export enum LogType {
	MESSAGE,
	WARNING,
	ERROR,
}
export class LogMessage<T extends LogType = LogType> {
	readonly TYPE: T;
	readonly DATA: string;
	readonly SOURCE: string;
	readonly PROPS: LoggerProps | undefined;
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
class Logger extends Listener<LoggerEvents> {
	private send(
		kind: LogType,
		message: string,
		source: string,
		props?: LoggerProps,
	) {
		switch (kind) {
			case LogType.MESSAGE:
				console.log("BeefWeb: " + message);
				break;
			case LogType.WARNING:
				console.warn("BeefWeb: " + message);
				break;
			case LogType.ERROR:
				console.error("BeefWeb: " + message);
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
	public error(source: string, message: string, props?: LoggerProps) {
		this.send(LogType.ERROR, message, source, props);
	}
}

interface LoggerProps {
	internal?: boolean;
}

export abstract class LoggerBaseClass<
	E extends Record<string, unknown>,
> extends Listener<E> {
	private readonly LOGGER: Logger;
	protected abstract readonly SOURCE: string;
	constructor(logger: Logger) {
		super();
		this.LOGGER = logger;
	}

	log(message: string, props?: LoggerProps) {
		this.LOGGER.log(this.SOURCE, message, props);
	}
	warn(message: string, props?: LoggerProps) {
		this.LOGGER.warn(this.SOURCE, message, props);
	}
	error(message: string, props?: LoggerProps) {
		this.LOGGER.error(this.SOURCE, message, props);
	}
}

export default new Logger();
export { Logger as LoggerClass };
