import { RenderElement } from 'lib/render';
import { Color } from './color';
import { Handler } from './handler';
import { affineTransformation, isSamePos, abVector, abPlus } from 'lib/utils';

interface Options {
	color?: Color

}

export class Rotater implements RenderElement {
	public key = Symbol();

	private context: CanvasRenderingContext2D;
	private color: Color;
	private path2d: Path2D | null = null;
	private pointer: Pos | null = null
	private currentElement: Handler | null = null;
	private prePointer: Pos | null = null;
	private isChange = false;

	constructor(context: CanvasRenderingContext2D, options: Options = {}) {
		this.context = context
		this.color = options.color || new Color(255, 155, 100);
	}

	public render = () => {
		if (!this.currentElement || !this.pointer) return;

		const elementRelPos = this.relPos(this.currentElement.getCenterPionter());

		if (this.prePointer && !isSamePos(elementRelPos, this.prePointer)) {
			// element moved
			const abV = abVector(this.prePointer, elementRelPos);
			this.setNewPaths(abPlus(this.pointer, abV));
			this.prePointer = elementRelPos;
		}

		if (this.isChange) {
			this.path2d = new Path2D()
			const [x, y] = this.pointer;
			this.path2d.arc(x, y, 10, 0, 2 * Math.PI)
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
		if (this.currentElement && this.currentElement === element) return;

		this.currentElement = element;
		this.prePointer = this.relPos(element.getCenterPionter());
		this.setNewPaths(this.prePointer);
	}

	public isPointerInside = (pointer: Pos) => {
		if (this.path2d) {
			return this.context.isPointInPath(this.path2d, ...pointer);
		}
		return false;
	}

	public rotate = (cosDeg: number, sinDeg: number) => {
		if (!this.currentElement || !this.pointer) return;

		const centerPointer = this.currentElement.getCenterPionter();
		this.setNewPaths(affineTransformation(cosDeg, sinDeg, this.pointer, centerPointer));
	}

	public changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	private relPos = ([x, y]: Pos): Pos => [x, y - 30];

	private setNewPaths = (pos: Pos) => {
		this.pointer = pos;

		this.changeState();
	}
}

