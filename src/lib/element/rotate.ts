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
	private point: Pos | null = null
	private currentElement: Handler | null = null;
	private prePoint: Pos | null = null;
	private isChange = false;

	constructor(context: CanvasRenderingContext2D, options: Options = {}) {
		this.context = context
		this.color = options.color || new Color(255, 155, 100);
	}

	public render = () => {
		if (!this.currentElement || !this.point) return;

		const elementRelPos = this.relPos(this.currentElement.getCenterPionter());

		if (this.prePoint && !isSamePos(elementRelPos, this.prePoint)) {
			// element moved
			const abV = abVector(this.prePoint, elementRelPos);
			this.setNewPaths(abPlus(this.point, abV));
			this.prePoint = elementRelPos;
		}

		if (this.isChange) {
			this.path2d = new Path2D()
			const [x, y] = this.point;
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
		this.prePoint = this.relPos(element.getCenterPionter());
		this.setNewPaths(this.prePoint);
	}

	public isPointInside = (point: Pos) => {
		if (this.path2d) {
			return this.context.isPointInPath(this.path2d, ...point);
		}
		return false;
	}

	public rotate = (cosDeg: number, sinDeg: number) => {
		if (!this.currentElement || !this.point) return;

		const centerPoint = this.currentElement.getCenterPionter();
		this.setNewPaths(affineTransformation(cosDeg, sinDeg, this.point, centerPoint));
	}

	public changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	private relPos = ([x, y]: Pos): Pos => [x, y - 30];

	private setNewPaths = (pos: Pos) => {
		this.point = pos;

		this.changeState();
	}
}

