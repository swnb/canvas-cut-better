export class Color {
	private color: string;

	constructor(r: number, g: number, b: number, a?: number) {
		this.setColor(r, g, b, a);
	}

	public setColor = (r: number, g: number, b: number, a: number = 1) => {
		this.color = `rgba(${r},${g},${b},${a})`;
	}

	public getColor = () => this.color;
}
