import { RenderElement } from 'lib/render';

const { assign, create } = Object;

interface ContextConfig {
	lineWidth?: number;
	lineCap?: CanvasLineCap;
	strokeStyle?: string | CanvasGradient | CanvasPattern;
	fillStyle?: string | CanvasGradient | CanvasPattern;
}

export class Wire implements RenderElement {
	public key = Symbol();

	private context: CanvasRenderingContext2D;
	private path2d = new Path2D();
	private fixedPoint: Point = [0, 0];
	private movingPoint: Point = [0, 0];
	private isChange = false;
	private preContextConfig: ContextConfig = create(null);
	private wireContextConfig: ContextConfig;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
		// TODO make this config better
		this.wireContextConfig = {
			lineWidth: 3,
			lineCap: 'round',
			strokeStyle: 'red',
			fillStyle: 'rgba(255, 148, 120)'
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
		context.fill(path2d);
		restore();
	}

	public setFixedPoint = (point: Point) => {
		this.fixedPoint = point;
		this.movingPoint = point;
		this.changeState();
	}

	public move = (movingPoint: Point) => {
		this.movingPoint = movingPoint;
		this.changeState();
	}

	public getLineSegment = (): LineSegment => [this.fixedPoint, this.movingPoint];

	public destory = () => {
		this.fixedPoint = [-100, -100];
		this.movingPoint = [-100, -100];
		this.changeState();
	}

	private save = () => {
		const { preContextConfig, context } = this;
		const { lineCap, lineWidth, strokeStyle } = context;
		assign(preContextConfig, { strokeStyle, lineCap, lineWidth });
	}

	private restore = () => {
		assign(this.context, this.preContextConfig);
	}

	private changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	private drawNewPaths = () => {
		const path2d = new Path2D();
		const [sX, sY] = this.fixedPoint;
		const [eX, eY] = this.movingPoint;
		path2d.arc(sX, sY, 10, 0, 2 * Math.PI)
		path2d.moveTo(eX, eY);
		path2d.arc(eX, eY, 10, 0, 2 * Math.PI)
		path2d.moveTo(sX, sY);
		path2d.lineTo(eX, eY);
		this.path2d = path2d;
	}
}
