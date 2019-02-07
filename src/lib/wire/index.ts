import { RenderElement } from 'lib/render';
import { abPlus, distanceAB } from 'lib/utils';

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
	private fixedPoint: Pos = [0, 0];
	private movingPoint: Pos = [0, 0];
	private isChange = false;
	private preContextConfig: ContextConfig = create(null);
	private wireContextConfig: ContextConfig;

	private minWireWidth: number = 30;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
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

	public setFixedPoint = (point: Pos) => {
		this.fixedPoint = point;
		this.movingPoint = point;
		this.changeState();
	}

	public move = (movingPoint: Pos) => {
		this.movingPoint = movingPoint;
		this.changeState();
	}

	public getLineSegment = (): LineSegment => [this.fixedPoint, this.movingPoint];

	public destory = () => {
		this.fixedPoint = [0, 0];
		this.movingPoint = [0, 0];
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
		if (this.minWireWidth < distanceAB(this.fixedPoint, this.movingPoint)) {
			const capturePath2d = new Path2D();
			const [cX, cY] = abPlus(this.fixedPoint, this.movingPoint).map(p => p / 2);
			capturePath2d.arc(cX, cY, 10, 0, 2 * Math.PI);
			path2d.addPath(capturePath2d);
		}
		path2d.moveTo(...this.fixedPoint);
		path2d.lineTo(...this.movingPoint);
		this.path2d = path2d;
	}
}
