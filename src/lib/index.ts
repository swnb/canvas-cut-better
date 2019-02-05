import { Render } from './render';
import { createGraphicsElement, Element, Sepatater, Color, DrawMode } from './element';
import { abVector, countDeg, countSepatateVector } from './utils';
import { Rotater } from './rotater';
import { Wire } from './wire';

enum OprateMode { move = 1, rotate, cut, none };

export class CanvasCut {
	private context: CanvasRenderingContext2D;
	private render: Render
	private rotater: Rotater;
	private wire: Wire;
	private sepatater: Sepatater;
	private currenOprateMode: OprateMode = OprateMode.cut;
	private currentSelectedElement: Element | null = null;

	constructor(context: CanvasRenderingContext2D, render: Render, rotater: Rotater, wire: Wire, sepatater: Sepatater) {
		this.context = context;
		this.render = render;
		this.rotater = rotater;
		this.wire = wire;
		this.sepatater = sepatater;
	}

	public createElement = (paths: Paths) => {
		const ele = createGraphicsElement(this.context, paths);
		this.render.registRender(ele);
		return ele;
	}

	public startAnimation = () => {
		// TODO 写入开启的动画
	}

	public receivePointerDown = (point: Pos) => {
		this.selectElement(point);
	}

	public receivePointerMove = (prePoint: Pos, curPoint: Pos) => {
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

	private selectElement = (pos: Pos) => {
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

	private moveElement = (prePos: Pos, currentPos: Pos) => {
		if (!this.currentSelectedElement) return

		this.currentSelectedElement.move(abVector(prePos, currentPos));
	}

	private rotateElement = (prePos: Pos, currentPos: Pos) => {
		if (!this.currentSelectedElement) return;

		const { currentSelectedElement } = this;
		const originPos = currentSelectedElement.getCenterPiont();
		const [cosDeg, sinDeg] = countDeg(originPos, prePos, currentPos);
		currentSelectedElement.rotate(cosDeg, sinDeg);
	}

	private searchCutElement = () => {
		window.console.time("search")
		const lineSegment = this.wire.getLineSegment();
		for (const element of this.render.allElements()) {
			const intersections = element.getIntersections(lineSegment);
			if (!intersections) continue;
			// cut element;
			const twoPaths = element.cut(intersections);
			if (!twoPaths) continue;
			this.render.remove(element);
			for (const paths of twoPaths) {
				this.createChildElement(paths, intersections);
			}
		}
		window.console.timeEnd("search");
	}

	private createChildElement = (paths: Paths, intersections: LineSegment) => {
		const e = this.createElement(paths);
		const sepatateVector = countSepatateVector(e.getCenterPiont(), intersections);
		this.sepatater.addElement(e, sepatateVector);
		e.setColor(new Color(255, 100, 20));
		e.setDrawMode(DrawMode.fill);
		setTimeout(e.stretchBack, 3000);
	};
}

export const attachContext = (canvas: HTMLCanvasElement) => {
	const context = canvas.getContext('2d')
	if (!context) throw Error(`can't get context from html dom canvas => ${canvas}`);
	// render
	const render = Render.getInstance();
	// clear every render
	render.unshift(() => { context.clearRect(0, 0, canvas.width, canvas.height); });
	// rotater
	const rotater = new Rotater(context);
	render.push(rotater.render);
	// wire
	const wire = new Wire(context);
	render.push(wire.render);
	// sepatater
	const sepatater = Sepatater.getInstance();
	render.unshift(sepatater.render);
	return new CanvasCut(context, render, rotater, wire, sepatater);
}
