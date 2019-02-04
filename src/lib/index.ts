import { Render } from './render';
import { Handler, BaseElement } from './element';
import { abVector, countDeg } from './utils';
import { Rotater } from './rotater';
import { Wire } from './wire';
import { getIntersections, Sepatater } from './cutter';
import { Color } from './element/color';

enum OprateMode { move = 1, rotate, cut, none };

export class CanvasCut {
	private context: CanvasRenderingContext2D;
	private render: Render
	private rotater: Rotater;
	private wire: Wire;
	private sepatater: Sepatater;
	private currenOprateMode: OprateMode = OprateMode.cut;
	private currentSelectedElement: BaseElement | null = null;

	constructor(context: CanvasRenderingContext2D, render: Render, rotater: Rotater, wire: Wire, sepatater: Sepatater) {
		this.context = context;
		this.render = render;
		this.rotater = rotater;
		this.wire = wire;
		this.sepatater = sepatater;
	}

	public createElement = (paths: Paths) => {
		const ele = new Handler(paths);
		ele.attachContext(this.context);
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
		const result: Handler[] = [];
		window.console.time("search")
		const lineSegment = this.wire.getLineSegment();
		for (const element of this.render.allElements()) {
			const intersections = getIntersections(element, lineSegment)
			if (!intersections) continue;
			// cut element;
			const twoPaths = element.cut(intersections);
			if (!twoPaths) continue;
			this.render.remove(element);
			for (const paths of twoPaths) {
				const e = this.createElement(paths);
				this.sepatater.addElement(e, intersections);
				e.setColor(new Color(25, 100, 255));
			}
		}
		window.console.timeEnd("search");
		return result;
	}
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
	const sepatater = new Sepatater();
	render.unshift(sepatater.render);
	return new CanvasCut(context, render, rotater, wire, sepatater);
}