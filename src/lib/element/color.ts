export class Color {
	public get r() {
		return this.pR;
	}
	public set r(value) {
		this.pR = value;
		this.changeState();
	}

	public get g() {
		return this.pG;
	}
	public set g(value) {
		this.pG = value;
		this.changeState();
	}

	public get b() {
		return this.pB;
	}
	public set b(value) {
		this.pB = value;
		this.changeState();
	}

	public get a() {
		return this.pA;
	}
	public set a(value) {
		this.pA = value;
		this.changeState();
	}

	private pR: number;
	private pG: number;
	private pB: number;
	private pA: number;
	private color: string;
	private isChange = true;

	constructor(r: number, g: number, b: number, a: number = 1) {
		this.pR = r;
		this.pG = g;
		this.pB = b;
		this.pA = a;
		this.color = `rgba(${r},${g},${b},${a})`;
	}

	public setColor = (r: number, g: number, b: number, a: number = 1) => {
		this.pR = r;
		this.pG = g;
		this.pB = b;
		this.pA = a;
		this.color = `rgba(${r},${g},${b},${a})`;
	}

	private changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	public get string() {
		if (this.isChange) {
			this.updateColor();
			this.isChange = false;
		}
		return this.color;
	}

	private updateColor = () => {
		const { pR, pG, pB, pA } = this;
		this.color = `rgba(${pR},${pG},${pB},${pA})`;
	}
}
