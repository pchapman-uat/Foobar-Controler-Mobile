export class Color {
    private r: number;
    private g: number;
    private b: number;
    private a: number;
    constructor(r:number, g:number, b:number, a:number = 1){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toString(){
        return `rgba(${this.r},${this.g},${this.b},${this.a})`
    }
    valueOf(): string {
        return this.toString();
    }
    toArgbInt(){
        return ((this.a & 0xff) << 24) | ((this.r & 0xff) << 16) | ((this.g & 0xff) << 8) | (this.b & 0xff);
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

}

export abstract class Theme {
    abstract name: string;

    abstract primary: Color;
    abstract secondary: Color;
    abstract accent: Color;

    abstract background: Color;
    abstract backgroundAccent: Color

    abstract textPrimary: Color;
    abstract textSecondary: Color;
    abstract textDisabled: Color;

    abstract buttonPrimary: Color;
    abstract buttonSecondary: Color;

    abstract border: Color;
    abstract shadow: Color;

    get(val: keyof Theme){
        return this[val].toString();
    }
}
class Dark extends Theme{
    name = "Dark";
    primary = new Color(0,0,0);
    secondary= new Color(0,0,0);
    accent = new Color(103,58,183);
    background = new Color(0,0,0);
    textPrimary = new Color(255,255,255);
    textSecondary = new Color(255,255,255);
    textDisabled = new Color(100,100,100);
    buttonPrimary = new Color(103,58,183);;
    buttonSecondary = new Color(0,0,0);
    border = new Color(255,255,255);
    shadow = new Color(255,255,255,0.5);
    overlay = new Color(255,255,255);
    backgroundAccent = new Color(50,50,50);
}
class Light extends Theme{
    name = "Light";
    primary = new Color(255,255,255);
    secondary= new Color(255,255,255);
    accent = new Color(30,144,255);
    background = new Color(200,200,200);
    backgroundAccent = new Color(255,255,255);
    textPrimary = new Color(0,0,0);
    textSecondary = new Color(0,0,0);
    textDisabled = new Color(100,100,100);
    buttonPrimary = new Color(30,144,255);
    buttonSecondary = new Color(255,255,255);
    border = new Color(0,0,0);
    shadow = new Color(0,0,0,0.5);
    overlay = new Color(0,0,0);
}

class DarkRed extends Theme{
    name = "Dark";
    primary = new Color(0,0,0);
    secondary= new Color(0,0,0);
    accent = new Color(194,6,47);
    background = new Color(0,0,0);
    textPrimary = new Color(255,255,255);
    textSecondary = new Color(255,255,255);
    textDisabled = new Color(100,100,100);
    buttonPrimary = new Color(194,6,47);
    buttonSecondary = new Color(0,0,0);
    border = new Color(255,255,255);
    shadow = new Color(255,255,255,0.5);
    overlay = new Color(255,255,255);
    backgroundAccent = new Color(50,50,50);
}

class LightRed extends Theme{
    name = "Light";
    primary = new Color(255,255,255);
    secondary= new Color(255,255,255);
    accent = new Color(194,6,47);
    background = new Color(200,200,200);
    backgroundAccent = new Color(255,255,255);
    textPrimary = new Color(0,0,0);
    textSecondary = new Color(0,0,0);
    textDisabled = new Color(100,100,100);
    buttonPrimary = new Color(194,6,47);
    buttonSecondary = new Color(255,255,255);
    border = new Color(0,0,0);
    shadow = new Color(0,0,0,0.5);
    overlay = new Color(0,0,0);
}

export default [new Light(), new Dark(), new LightRed(), new DarkRed()]