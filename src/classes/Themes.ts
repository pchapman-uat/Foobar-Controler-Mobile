export enum ThemeType {
	Light,
	Dark,
}

export class Color {
	private r: number;
	private g: number;
	private b: number;
	private a: number;
	constructor(r: number, g: number, b: number, a: number = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	toString() {
		return `rgba(${this.r},${this.g},${this.b},${this.a})`;
	}
	valueOf(): string {
		return this.toString();
	}
	toArgbInt() {
		return (
			((this.a & 0xff) << 24) |
			((this.r & 0xff) << 16) |
			((this.g & 0xff) << 8) |
			(this.b & 0xff)
		);
	}
	static stringToLottie(rgba: string): [number, number, number, number] {
		const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
		const match = rgba.match(regex);

		if (!match) {
			throw new Error(`Invalid RGBA string: ${rgba}`);
		}

		const r = parseInt(match[1], 10) / 255;
		const g = parseInt(match[2], 10) / 255;
		const b = parseInt(match[3], 10) / 255;
		const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

		return [r, g, b, a];
	}
	toHex(): string {
		const rHex = this.r.toString(16).padStart(2, "0");
		const gHex = this.g.toString(16).padStart(2, "0");
		const bHex = this.b.toString(16).padStart(2, "0");
		const aHex = Math.round(this.a * 255)
			.toString(16)
			.padStart(2, "0");

		return `#${rHex}${gHex}${bHex}${aHex}`;
	}

	toJSON() {
		return this.toHex();
	}

	isDark(): boolean {
		const luminance = 0.299 * this.r + 0.587 * this.g + 0.114 * this.b;
		return luminance < 128;
	}

	static fromHex(hex: string): Color {
		console.log("Look at me!", hex);

		hex = hex.replace(/^#/, "").toLowerCase();

		if (hex.length === 3 || hex.length === 4) {
			hex = hex
				.split("")
				.map((char) => char + char)
				.join("");
		}

		if (hex.length !== 6 && hex.length !== 8) {
			throw new Error(`Invalid hex color: ${hex}`);
		}

		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

		return new Color(r, g, b, a);
	}

	public getAlpha(a: number) {
		return new Color(this.r, this.g, this.b, a);
	}
}
export abstract class Theme {
	abstract name: string;

	abstract type: ThemeType;

	abstract primary: Color;
	abstract secondary: Color;
	abstract accent: Color;

	abstract background: Color;
	abstract backgroundAccent: Color;

	abstract textPrimary: Color;
	abstract textSecondary: Color;
	abstract textDisabled: Color;

	abstract buttonPrimary: Color;
	abstract buttonSecondary: Color;

	abstract border: Color;
	abstract shadow: Color;

	abstract rowEven: Color;
	abstract rowOdd: Color;

	get(val: keyof Theme, alpha?: number): string {
		if (alpha && val != "name") {
			const color = this[val];
			if (color instanceof Color) return color.getAlpha(alpha).toString();
		}
		return this[val].toString();
	}
}
class Dark extends Theme {
	name = "Dark";
	type = ThemeType.Dark;
	primary = new Color(0, 0, 0);
	secondary = new Color(0, 0, 0);
	accent = new Color(103, 58, 183);
	background = new Color(0, 0, 0);
	textPrimary = new Color(255, 255, 255);
	textSecondary = new Color(255, 255, 255);
	textDisabled = new Color(100, 100, 100);
	buttonPrimary = new Color(103, 58, 183);
	buttonSecondary = new Color(0, 0, 0);
	border = new Color(255, 255, 255);
	shadow = new Color(255, 255, 255, 0.5);
	overlay = new Color(255, 255, 255);
	backgroundAccent = new Color(50, 50, 50);
	rowOdd = new Color(100, 100, 100);
	rowEven = new Color(75, 75, 75);
}
class Light extends Theme {
	name = "Light";
	type = ThemeType.Light;
	primary = new Color(255, 255, 255);
	secondary = new Color(255, 255, 255);
	accent = new Color(30, 144, 255);
	background = new Color(200, 200, 200);
	backgroundAccent = new Color(255, 255, 255);
	textPrimary = new Color(0, 0, 0);
	textSecondary = new Color(0, 0, 0);
	textDisabled = new Color(100, 100, 100);
	buttonPrimary = new Color(30, 144, 255);
	buttonSecondary = new Color(255, 255, 255);
	border = new Color(0, 0, 0);
	shadow = new Color(0, 0, 0, 0.5);
	overlay = new Color(0, 0, 0);
	rowOdd = new Color(225, 225, 225);
	rowEven = new Color(200, 200, 200);
}

class DarkRed extends Dark {
	name = "Dark Red";
	accent = new Color(194, 6, 47);
	buttonPrimary = new Color(194, 6, 47);
}

class LightRed extends Light {
	name = "Light Red";
	accent = new Color(194, 6, 47);
	buttonPrimary = new Color(194, 6, 47);
}
export type ThemeJSON = {
	name: string;
	type: ThemeType;

	primary: string;
	secondary: string;
	accent: string;

	background: string;
	backgroundAccent: string;

	textPrimary: string;
	textSecondary: string;
	textDisabled: string;

	buttonPrimary: string;
	buttonSecondary: string;

	border: string;
	shadow: string;

	rowEven: string;
	rowOdd: string;
};

export class CustomTheme extends Light {
	constructor() {
		super();
	}

	init(json: ThemeJSON) {
		console.warn(json);
		this.name = json.name;
		this.type = json.type;

		const parse = (item: string, key: string) => {
			if (item && typeof item === "string") {
				try {
					return Color.fromHex(item);
				} catch (e) {
					console.error(`Invalid hex value for "${key}":`, item);
					throw e;
				}
			}
			console.error(`Missing or invalid color for "${key}":`, item);
			throw new Error(`Color for "${key}" is invalid or missing.`);
		};

		this.primary = parse(json.primary, "primary");
		this.secondary = parse(json.secondary, "secondary");
		this.accent = parse(json.accent, "accent");

		this.background = parse(json.background, "background");
		this.backgroundAccent = parse(json.backgroundAccent, "backgroundAccent");

		this.textPrimary = parse(json.textPrimary, "textPrimary");
		this.textSecondary = parse(json.textSecondary, "textSecondary");
		this.textDisabled = parse(json.textDisabled, "textDisabled");

		this.buttonPrimary = parse(json.buttonPrimary, "buttonPrimary");
		this.buttonSecondary = parse(json.buttonSecondary, "buttonSecondary");

		this.border = parse(json.border, "border");
		this.shadow = parse(json.shadow, "shadow");

		this.rowEven = parse(json.rowEven, "rowEven");
		this.rowOdd = parse(json.rowOdd, "rowOdd");
	}

	set<K extends keyof this>(key: K, val: this[K]): void {
		this[key] = val;
	}

	reset<K extends keyof this>(key: K): void {
		this[key] = (custom_default as this)[key];
	}
}

const custom_default = new CustomTheme();

export default [
	new Light(),
	new Dark(),
	new LightRed(),
	new DarkRed(),
	new CustomTheme(),
];
