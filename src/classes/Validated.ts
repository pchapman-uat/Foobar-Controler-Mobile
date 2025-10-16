export abstract class UnknownValidation<T> {
	public abstract isValid(): this is Valid<T>;
}

export class Valid<T> extends UnknownValidation<T> {
	protected readonly VALUE: T;

	constructor(value: T) {
		super();
		this.VALUE = value;
	}

	public isValid(): this is Valid<T> {
		return true;
	}

	public get(): T {
		return this.VALUE;
	}
}

export class Invalid<T> extends UnknownValidation<T> {
	protected readonly VALUE: T | null | undefined;

	constructor(value?: T | null) {
		super();
		this.VALUE = value;
	}

	public isValid(): this is Valid<T> {
		return false;
	}
}
type ValidatorFn<T> = (value: T) => boolean;

type ValidatorMap = {
	string: ValidatorFn<string>;
	number: ValidatorFn<number>;
	boolean: ValidatorFn<boolean>;
	object: ValidatorFn<Validatable>;
};

type SupportedTypes = {
	[K in keyof ValidatorMap]: ValidatorMap[K] extends ValidatorFn<infer T>
		? T
		: never;
}[keyof ValidatorMap];

export default class Validator {
	private static readonly VALIDATORS: ValidatorMap = {
		string: (v) => v.trim().length > 0,
		number: (v) => !isNaN(v),
		boolean: (v) => v === true,
		object: (v) => v.validate(), // expects Validatable
	};

	public static get<K extends keyof ValidatorMap>(type: K): ValidatorMap[K] {
		return this.VALIDATORS[type];
	}

	public static validate<T extends SupportedTypes>(
		value: T | null | undefined,
		customValidator?: ValidatorFn<T>,
	): UnknownValidation<T> {
		if (value === null || value === undefined) return new Invalid();

		const type = typeof value as keyof ValidatorMap;

		if (type === "object") {
			if (typeof (value as any).validate !== "function") {
				console.warn("Object lacks validate() method", value);
				return new Invalid(value);
			}
		}

		const validator = (customValidator ??
			this.VALIDATORS[type]) as ValidatorFn<T>;

		if (validator(value)) {
			return new Valid(value);
		}
		return new Invalid(value);
	}
}
export interface Validatable {
	validate(): boolean;
}
