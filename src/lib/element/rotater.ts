import { RenderElement } from 'lib/render';
import { Color } from './color';
import { affineTransformation, isSamePos, } from 'lib/utils';
import { BaseElement } from './base';

interface Options {
	color?: Color

}

export class Rotater implements RenderElement {
	public key = Symbol();

	private context: CanvasRenderingContext2D;
	private color: Color;
	private preElementPoint: Pos = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
	private path2d: Path2D = new Path2D();
	private bindedElement: BaseElement | null = null;

	constructor(context: CanvasRenderingContext2D, options: Options = {}) {
		this.context = context
		this.color = options.color || new Color(255, 155, 100);
	}

	public render = () => {
		if (!this.bindedElement) return;

		const { bindedElement } = this;
		if (this.isBindedElementChange(bindedElement)) {
			this.setNewPath2d(bindedElement);
		}

		const preDrawStyle = this.context.fillStyle;
		this.context.fillStyle = this.color.getColor();
		this.context.fill(this.path2d);
		this.context.fillStyle = preDrawStyle;
	}

	public destory = () => {
		this.bindedElement = null;
	}

	public bindElement = (element: BaseElement) => {
		if (this.bindedElement && this.bindedElement === element) return;

		this.bindedElement = element;
		this.recordElement(element);
		this.setNewPath2d(element);
	}

	public isPointInside = (point: Pos) => this.context.isPointInPath(this.path2d, ...point);

	private recordElement = (element: BaseElement) => {
		this.preElementPoint = element.getPaths()[0];
	}

	private isBindedElementChange = (element: BaseElement) => !isSamePos(this.preElementPoint, element.getPaths()[0]);

	// TODO  better implement
	private relPos = ([x, y]: Pos): Pos => [x, y - 30];

	private drawPos = ([x, y]: Pos) => {
		const path2d = new Path2D();
		// TODO implement rotater here;
		path2d.arc(x, y, 10, 0, 2 * Math.PI)
		return path2d;
	}

	private setNewPath2d = (element: BaseElement) => {
		const [cosDeg, sinDeg] = element.getTotalCosSinDeg();
		const originPos = element.getCenterPionter();
		const point = affineTransformation(cosDeg, sinDeg, this.relPos(originPos), originPos);
		this.path2d = this.drawPos(point);
		this.recordElement(element);
	}
}

