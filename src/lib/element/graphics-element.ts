import { Element } from './element';
import { Color } from './color';
import { RenderElement } from 'lib/render';
import { abVector, countCenterPos, distanceAB } from 'lib/utils';
import { Sepatater } from './separate';

export class GraphicsElement extends Element implements RenderElement {
	private isChange = true;

	private color: Color = new Color(228, 241, 254, 1);
	private borderWidth: number = 1;
	private borderColor: Color = new Color(44, 130, 201, 1);
	private context: CanvasRenderingContext2D;
	private path2d = new Path2D();

	constructor(context: CanvasRenderingContext2D, paths: Pos[]) {
		super(paths);
		this.context = context;
	}

	public setColor = (color: Color) => {
		this.color = color
	}

	public setBorder = (width: number, color: Color) => {
		this.borderWidth = width;
		this.borderColor = color;
	}

	public isPointInside = (point: Pos) => this.context.isPointInPath(this.path2d, ...point)

	public render = () => {
		const { context, } = this;
		if (!context) return;

		const { color, borderWidth, borderColor, } = this;
		// path2d will reclare when element is change
		if (this.isChange) {
			this.path2d = this.drawPath2d();
			this.isChange = false;
		}
		const { path2d } = this;

		context.lineWidth = borderWidth;
		context.strokeStyle = borderColor.string;
		context.fillStyle = color.string;
		context.fill(path2d);
		context.stroke(path2d);
	}

	public stretchBack = () => {
		const { originPaths, centerPoint } = this;
		const originCenterPoint = countCenterPos(originPaths);
		const vector = abVector(centerPoint, originCenterPoint);
		Sepatater.getInstance().addElement(this, vector, distanceAB(centerPoint, originCenterPoint));
	};

	protected changeState = () => {
		if (!this.isChange) this.isChange = true;
	}
}

export const createGraphicsElement = (context: CanvasRenderingContext2D, paths: Paths) => new GraphicsElement(context, paths);
