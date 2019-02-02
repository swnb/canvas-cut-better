import { Render } from './render';
import { Handler, Rotater } from './element';
import { getCosDeg, getSinDeg, abVector } from './utils';

export class CanvasCut {
	private context: CanvasRenderingContext2D;
	private render: Render
	private elements: Handler[] = [];
	private rotater: Rotater;
	private currenOprateMode: 'move' | 'rotate' | 'cut' | 'none' = 'cut';
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
			case 'move':
				this.moveElement(prePoint, curPoint);
				break;
			case 'rotate':
				this.rotateElement(prePoint, curPoint);
				break;
			case 'cut':
				// todo:  这里需要写入 cut 的逻辑结构
				break;
			case 'none':
				break;
		}
	}

	public receivePointerUp = () => {
		this.currenOprateMode = 'none';
	}

	public destory = () => {
		this.elements = [];
		this.render.clear();
	}

	private selectElement = (pos: Pos) => {
		if (this.rotater.isPointInside(pos)) {
			this.currenOprateMode = 'rotate';
			return
		}

		for (const element of this.elements) {
			if (element.isPointInside(pos)) {
				this.currenOprateMode = 'move';
				this.currentSelectedElement = element;
				this.rotater.bindElement(element);
				return;
			}
		}

		// when no element is selected, clear state and set cut mode;
		this.currenOprateMode = 'cut';
		this.currentSelectedElement = null;
		this.rotater.destory();
	}

	private moveElement = (prePos: Pos, currentPos: Pos) => {
		if (!this.currentSelectedElement) return

		this.currentSelectedElement.changeState();
		this.currentSelectedElement.move(abVector(prePos, currentPos));
	}

	private rotateElement = (prePos: Pos, currentPos: Pos) => {
		if (!this.currentSelectedElement) return;

		this.currentSelectedElement.changeState();
		const originPos = this.currentSelectedElement.getCenterPionter();
		const preVector: Vector = abVector(originPos, prePos);
		const currentVector: Vector = abVector(originPos, currentPos);
		const cosDeg = getCosDeg(preVector, currentVector);
		const sinDeg = getSinDeg(preVector, currentVector);
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