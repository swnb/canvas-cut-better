import { RenderElement } from 'lib/render';
import { Color } from './color';
import { Handler } from './hander';
import { affineTransformation } from 'lib/utils';

interface Options {
	color?: Color

}

export class Rotater implements RenderElement {
	public key = Symbol();

	private context: CanvasRenderingContext2D;
	private color: Color;
	private path2d: Path2D | null = null;
	private pointer: Pos = [0, 0];
	private currentElement: Handler | null = null;
	private isChange = false;

	constructor(context: CanvasRenderingContext2D, options: Options = {}) {
		this.context = context
		this.color = options.color || new Color(255, 155, 100);
	}

	public render = () => {
		if (!this.currentElement) return;

		if (this.isChange) {
			this.setNewPath()
			this.isChange = false;
		}

		const preDrawStyle = this.context.fillStyle;
		this.context.fillStyle = this.color.getColor();
		this.context.fill(this.path2d as Path2D);
		this.context.fillStyle = preDrawStyle;
	}

	public destory = () => {
		this.currentElement = null;
	}

	public bindElement = (element: Handler) => {
		if (this.currentElement && this.currentElement.key === element.key) return;

		this.currentElement = element;
		this.changeState();
	}

	public isPointerInside = (pointer: Pos) => {
		if (this.path2d) {
			return this.context.isPointInPath(this.path2d, ...pointer);
		}
		return false
	}

	public rotate = (cosDeg: number, sinDeg: number) => {
		if (!this.currentElement) return;

		const centerPointer = this.currentElement.getCenterPionter()
		this.pointer = affineTransformation(cosDeg, sinDeg, this.pointer, centerPointer);
	}

	public changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	private setNewPath = () => {
		this.path2d = this.drawPath2d((this.currentElement as Handler).getCenterPionter());
	}

	private drawPath2d = ([cx, cy]: Pos) => {
		const path2d = new Path2D();
		path2d.arc(cx, cy - 20, 10, 2 * Math.PI, 0);
		return path2d;
	}
}

