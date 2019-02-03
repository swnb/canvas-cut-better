import { RenderElement } from 'lib/render';

const { MIN_SAFE_INTEGER } = Number;
const { assign, create } = Object;

interface ContextConfig {
	lineWidth?: number;
	lineCap?: CanvasLineCap;
	strokeStyle?: string | CanvasGradient | CanvasPattern;
}

export class Wire implements RenderElement {
	public key = Symbol();

	private context: CanvasRenderingContext2D;
	private path2d = new Path2D();
	private fixedPoint: Pos = [MIN_SAFE_INTEGER, MIN_SAFE_INTEGER];
	private movingPoint: Pos = [MIN_SAFE_INTEGER, MIN_SAFE_INTEGER];
	private isChange = false;
	private preContextConfig: ContextConfig = create(null);
	private wireContextConfig: ContextConfig;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
		this.wireContextConfig = {
			lineWidth: 3,
			lineCap: 'round',
			strokeStyle: 'red',
		}
	}

	public render = () => {
		if (this.isChange) {
			this.drawNewPaths();
			this.isChange = false;
		}
		const { context, path2d, save, restore, wireContextConfig } = this;
		save();
		assign(context, wireContextConfig);
		context.stroke(path2d);
		restore();
	}

	public setFixedPoint = (point: Pos) => {
		this.fixedPoint = point;
		this.changeState();
	}

	public move = (movingPoint: Pos) => {
		this.movingPoint = movingPoint;
		this.changeState();
	}

	public destory = () => {
		this.fixedPoint = [MIN_SAFE_INTEGER, MIN_SAFE_INTEGER];
		this.movingPoint = [MIN_SAFE_INTEGER, MIN_SAFE_INTEGER];
		this.changeState();
	}

	private save = () => {
		const { preContextConfig, context } = this;
		const { lineCap, lineWidth, strokeStyle } = context;
		preContextConfig.strokeStyle = strokeStyle;
		preContextConfig.lineCap = lineCap;
		preContextConfig.lineWidth = lineWidth
	}

	private restore = () => {
		assign(this.context, this.preContextConfig);
	}

	private changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	private drawNewPaths = () => {
		const path2d = new Path2D();
		path2d.moveTo(...this.fixedPoint);
		path2d.lineTo(...this.movingPoint);
		this.path2d = path2d;
	}
}
