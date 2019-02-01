import { Render } from './render';
import { Handler } from './element';
import { getCosDeg, getSinDeg } from './utils';

export class CanvasCut {
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private render: Render = Render.getInstance();
	private elements: Handler[] = [];
	private currenOprateMode: 'move' | 'rotate' | 'cut' | 'none' = 'cut';
	private currentSelectedElement: Handler | null = null;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const context = canvas.getContext('2d')
		if (!context) {
			throw Error(`can't get context from html dom canvas => ${canvas}`);
		} else {
			this.context = context;
		}
	}

	public init = () => {
		const { context, canvas } = this;
		this.render.unshift(() => {
			context.clearRect(0, 0, canvas.width, canvas.height)
		});
	}

	public createElement = () => {
		const ele = new Handler([50, 50], [[25, 25], [75, 25], [25, 75]]);
		ele.attachContext(this.context);
		this.elements.push(ele);
		this.render.registRender(ele);
	}

	public destory = () => {
		this.render.clear();
	}

	public selectElement = (pointer: Pos) => {
		this.currenOprateMode = 'cut';
		this.currentSelectedElement = null;

		for (const element of this.elements) {
			if (element.isPointerInside(pointer)) {
				this.currenOprateMode = 'move';
				this.currentSelectedElement = element;
				return;
			} else if (element.isPointerInsideRotateHandler(pointer)) {
				this.currenOprateMode = 'rotate';
				return;
			}
		}
	}

	public receivePointerDown = (pointer: Pos) => {
		this.selectElement(pointer);
	}

	public receivePointerMove = (prePointer: Pos, curPointer: Pos) => {
		switch (this.currenOprateMode) {
			case 'move':
				this.moveElement(prePointer, curPointer);
				break;
			case 'rotate':
				this.rotateElement(prePointer, curPointer);
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
		this.currentSelectedElement.move([cX - preX, cY - preY]);
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
	}
}

export const attachContext = (canvas: HTMLCanvasElement, ) => new CanvasCut(canvas);	