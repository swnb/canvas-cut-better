import { Render } from './render';
import { Handler } from './element';
import { abVector, countDeg, analysis } from './utils';
import { Rotater } from './rotater';
import { Wire } from './wire';
import { Color } from './element/color';

enum OprateMode { move = 1, rotate, cut, none };

export class CanvasCut {
	private context: CanvasRenderingContext2D;
	private render: Render
	private elements: Handler[] = [];
	private rotater: Rotater;
	private wire: Wire;
	private currenOprateMode: OprateMode = OprateMode.cut;
	private currentSelectedElement: Handler | null = null;

	constructor(context: CanvasRenderingContext2D, render: Render, rotater: Rotater, wire: Wire) {
		this.context = context;
		this.render = render;
		this.rotater = rotater;
		this.wire = wire;
	}

	public createElement = (paths: Paths) => {
		const ele = new Handler(paths);
		ele.attachContext(this.context);
		this.elements.push(ele);
		this.render.registRender(ele);
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
				// TODO  这里需要写入 cut 的逻辑结构
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
		this.elements = [];
		this.rotater.destory();
		this.wire.destory();
		this.render.clear();
	}

	private selectElement = (pos: Pos) => {
		// point at rotater
		if (this.rotater.isPointInside(pos)) {
			this.currenOprateMode = OprateMode.rotate;
			return
		}

		// point at render element
		for (const element of this.elements) {
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
		const originPos = currentSelectedElement.getCenterPionter();
		const [cosDeg, sinDeg] = countDeg(originPos, prePos, currentPos);
		currentSelectedElement.rotate(cosDeg, sinDeg);
	}

	private searchCutElement = () => {
		const result: Handler[] = [];
		window.console.time("search")
		const lineSegment = this.wire.getLineSegment();
		for (const sample of analysis(lineSegment)) {
			for (const element of this.elements) {
				if (element.isPointInside(sample)) {
					result.push(element);
					element.setColor(new Color(200, 200, 100));
				}
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

	const wire = new Wire(context);
	render.push(wire.render);

	return new CanvasCut(context, render, rotater, wire);
}