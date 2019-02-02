import { Render } from './render';
import { Handler, Rotater } from './element';
import { getCosDeg, getSinDeg } from './utils';

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

	public createElement = () => {
		const ele = new Handler([[25, 25], [75, 25], [25, 75]]);
		ele.attachContext(this.context);
		this.elements.push(ele);
		this.render.registRender(ele);
	}

	public destory = () => {
		this.render.clear();
	}

	public selectElement = (pos: Pos) => {
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

	public startAnimation = () => {
		// todo: 写入开启的动画
	}

	private moveElement = ([preX, preY]: Pos, [cX, cY]: Pos) => {
		if (!this.currentSelectedElement) return

		this.currentSelectedElement.changeState();
		const moveVector: Vector = [cX - preX, cY - preY]
		this.currentSelectedElement.move(moveVector);
	}

	private rotateElement = ([preX, preY]: Pos, [cX, cY]: Pos) => {
		if (!this.currentSelectedElement) return;

		this.currentSelectedElement.changeState();
		const [centerX, centerY] = this.currentSelectedElement.getCenterPionter();
		const baseVector: Vector = [preX - centerX, preY - centerY];
		const moveVector: Vector = [cX - centerX, cY - centerY];
		const cosDeg = getCosDeg(baseVector, moveVector);
		const sinDeg = getSinDeg(baseVector, moveVector);
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
	render.unshift(() => {
		context.clearRect(0, 0, canvas.width, canvas.height)
	});
	// rotater
	const rotater = new Rotater(context);
	render.push(rotater.render);

	return new CanvasCut(context, render, rotater);
}