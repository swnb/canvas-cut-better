import { Render } from 'lib/render';
import { createGraphicsElement, Element, Sepatater, GraphicsElement, Color } from 'lib/element';
import { abVector, countDeg } from 'lib/utils';
import { Rotater } from 'lib/rotater';
import { Wire } from 'lib/wire';
import { Cutter } from 'lib/cutter';

enum OprateMode { move = 1, rotate, cut, none };

export class Core {
	protected key = Symbol();
	private context: CanvasRenderingContext2D;
	private render: Render
	private rotater: Rotater;
	private wire: Wire;
	private cutter: Cutter;
	private sepatater: Sepatater;
	private currenOprateMode: OprateMode = OprateMode.cut;
	private currentSelectedElement: Element | null = null;

	constructor(context: CanvasRenderingContext2D, render: Render, rotater: Rotater, wire: Wire, cutter: Cutter, sepatater: Sepatater) {
		this.context = context;
		this.render = render;
		this.rotater = rotater;
		this.wire = wire;
		this.cutter = cutter;
		this.sepatater = sepatater;
	}

	public createElement = (path: Path, color?: Color) => {
		const ele = createGraphicsElement(this.context, path);
		this.render.registRender(ele);
		if (color) ele.setColor(color);

		return (accessKey: symbol) => (accessKey === this.key) ? ele : null
	}

	public rmElement = (element: GraphicsElement) => {
		this.render.remove(element);
	}

	public startAnimation = () => {
		// TODO 写入开启的动画
	}

	public receivePointerDown = (point: Point) => {
		this.selectElement(point);
	}

	public receivePointerMove = (prePoint: Point, curPoint: Point) => {
		switch (this.currenOprateMode) {
			case OprateMode.move:
				this.moveElement(prePoint, curPoint);
				break;
			case OprateMode.rotate:
				this.rotateElement(prePoint, curPoint);
				break;
			case OprateMode.cut:
				this.wire.move(curPoint);
				break;
			case OprateMode.none:
				break;
		}
	}

	public receivePointerUp = () => {
		switch (this.currenOprateMode) {
			case OprateMode.move:
				break
			case OprateMode.rotate:
				break;
			case OprateMode.cut:
				this.searchCutElement()
				this.wire.destory();
				break;
		}
		this.currenOprateMode = OprateMode.none;
	}

	public destory = () => {
		this.rotater.destory();
		this.wire.destory();
		this.sepatater.clear();
		this.render.clear();
	}

	private selectElement = (pos: Point) => {
		// point at rotater
		if (this.rotater.isPointInside(pos)) {
			this.currenOprateMode = OprateMode.rotate;
			return
		}

		// point at render element
		for (const element of this.render.allElements()) {
			if (element.isPointInside(pos)) {
				this.currenOprateMode = OprateMode.move;
				this.currentSelectedElement = element;
				this.rotater.bindElement(element);
				return;
			}
		}

		// when no element is selected, clear state and set cut mode;
		this.currenOprateMode = OprateMode.cut;
		this.wire.setFixedPoint(pos);
		this.currentSelectedElement = null;
		this.rotater.destory();
	}

	private moveElement = (prePos: Point, currentPos: Point) => {
		if (!this.currentSelectedElement) return

		this.currentSelectedElement.move(abVector(prePos, currentPos));
	}

	private rotateElement = (prePos: Point, currentPos: Point) => {
		if (!this.currentSelectedElement) return;

		const { currentSelectedElement } = this;
		const originPos = currentSelectedElement.getCenterPiont();
		const [cosDeg, sinDeg] = countDeg(originPos, prePos, currentPos);
		currentSelectedElement.rotate(cosDeg, sinDeg);
	}

	private searchCutElement = () => {
		window.console.time("search")
		const { cutter, wire } = this;
		const lineSegment = wire.getLineSegment();
		cutter.setCutLine(lineSegment);
		for (const element of this.render.allElements()) {
			// cut element;
			const childrenPaths = cutter.cutElement(element);
			if (!childrenPaths) continue;

			this.render.remove(element);
			for (const path of childrenPaths) {
				this.createElement(path);
			}
		}
		window.console.timeEnd("search");
	}
}
