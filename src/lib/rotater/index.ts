import { RenderElement } from 'lib/render';
import { affineTransformation, abVector, abPlus } from 'lib/utils';
import { Element, Color } from 'lib/element';

interface Options {
	color?: Color
}

interface Snapshot {
	relPos: Point;
	preCenterPos: Point;
	getTotalCosSinDeg(): [number, number];
	getCenterPiont(): Point;
}

export class Rotater implements RenderElement {
	public key = Symbol();

	private context: CanvasRenderingContext2D;
	private color: Color;
	private path2d: Path2D = new Path2D();
	private bindedElement: Element | null = null;
	private cacheElementSnapshot: Map<symbol, Snapshot> = new Map();

	constructor(context: CanvasRenderingContext2D, options: Options = {}) {
		this.context = context
		this.color = options.color || new Color(255, 155, 100);
	}

	public render = () => {
		if (!this.bindedElement) return;

		this.drawPath2d();
		const preDrawStyle = this.context.fillStyle;
		this.context.fillStyle = this.color.string;
		this.context.fill(this.path2d);
		this.context.fillStyle = preDrawStyle;
	}

	public destory = () => {
		this.bindedElement = null;
	}

	public bindElement = (element: Element) => {
		if (this.bindedElement && this.bindedElement === element) return;

		const { cacheElementSnapshot } = this;
		const { key } = element;
		if (!cacheElementSnapshot.has(key)) {
			const { getRelPos } = this;
			const { getCenterPiont, getTotalCosSinDeg } = element;
			cacheElementSnapshot.set(key, {
				relPos: getRelPos(element),
				preCenterPos: getCenterPiont(),
				getTotalCosSinDeg,
				getCenterPiont,
			});
		}
		this.bindedElement = element;
	}

	public isPointInside = (point: Point) => this.context.isPointInPath(this.path2d, ...point);

	private drawPath2d = () => {
		const snapshot = this.cacheElementSnapshot.get((this.bindedElement as Element).key) as Snapshot;
		const { getTotalCosSinDeg, relPos, preCenterPos, getCenterPiont } = snapshot;
		const [cosDeg, sinDeg] = getTotalCosSinDeg();
		const centerPoint = getCenterPiont();
		const nextRelPos = abPlus(relPos, abVector(preCenterPos, centerPoint))
		const point = affineTransformation(cosDeg, sinDeg, nextRelPos, centerPoint);
		this.createNewPath2d(point);
	}

	private getRelPos = (element: Element): Point => {
		const originPos = element.getCenterPiont();
		let minY = Number.MAX_SAFE_INTEGER;
		for (const [, y] of element.getPaths()) {
			if (y < minY) minY = y;
		}
		return [originPos[0], minY - 30];
	}

	private createNewPath2d = ([x, y]: Point) => {
		const path2d = new Path2D();
		path2d.arc(x, y, 10, 0, 2 * Math.PI)
		this.path2d = path2d;
	}
}

