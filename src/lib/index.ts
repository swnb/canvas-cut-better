import { Render } from './render';
import { Handler, Rotater } from './element';
import { abVector, countDeg } from './utils';

enum OprateMode { move = 1, rotate, cut, none };

export class CanvasCut {
	private context: CanvasRenderingContext2D;
	private render: Render
	private elements: Handler[] = [];
	private rotater: Rotater;
	private currenOprateMode: OprateMode = OprateMode.cut;
	private currentSelectedElement: Handler | null = null;

	constructor(context: CanvasRenderingContext2D, render: Render, rotater: Rotater) {
		this.context = context;
		this.render = render;
		this.rotater = rotater;
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
				// TODO  这里需要写入 cut 的逻辑结构
				break;
			case OprateMode.none:
				break;
		}
	}

	public receivePointerUp = () => {
		this.currenOprateMode = OprateMode.none;
	}

	public destory = () => {
		this.elements = [];
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
		this.currentSelectedElement = null;
		this.rotater.destory();
	}

	private moveElement = (prePos: Pos, currentPos: Pos) => {
		if (!this.currentSelectedElement) return

		this.currentSelectedElement.move(abVector(prePos, currentPos));
	}

	private rotateElement = (prePos: Pos, currentPos: Pos) => {
		if (!this.currentSelectedElement) return;

		const originPos = this.currentSelectedElement.getCenterPionter();
		const [cosDeg, sinDeg] = countDeg(originPos, prePos, currentPos);
		this.currentSelectedElement.rotate(cosDeg, sinDeg);
		this.rotater.rotate(cosDeg, sinDeg);
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

	return new CanvasCut(context, render, rotater);
}