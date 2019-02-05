import { Element } from './element';
import { Color } from './color';
import { RenderElement } from 'lib/render';

export enum DrawMode { fill = 1, stroke };

export class GraphicsElement extends Element implements RenderElement {
	private isChange = true;

	private drawMode: DrawMode = DrawMode.fill;
	private color: Color = new Color(107, 185, 240);
	private preDrawStyle: string | CanvasGradient | CanvasPattern = "";
	private context: CanvasRenderingContext2D;
	private path2d = new Path2D();

	constructor(context: CanvasRenderingContext2D, paths: Pos[]) {
		super(paths);
		this.context = context;
	}

	public setColor = (color: Color) => {
		this.color = color
	}

	public setDrawMode = (mode: DrawMode) => {
		this.drawMode = mode
	}

	public isPointInside = (point: Pos) => this.context.isPointInPath(this.path2d, ...point)

	public render = () => {
		const { context, color, drawMode } = this;
		if (!context) return;

		// path2d will reclare when element is change
		if (this.isChange) {
			this.path2d = this.drawPath2d();
			this.isChange = false;
		}
		const { path2d } = this;

		this.save();
		switch (drawMode) {
			case DrawMode.fill:
				context.fillStyle = color.string;
				context.fill(path2d);
				break;
			case DrawMode.stroke:
				context.strokeStyle = color.string;
				context.stroke(path2d);
				break;
		}
		this.restore();
	}

	protected changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	protected save = () => {
		switch (this.drawMode) {
			case DrawMode.fill:
				this.preDrawStyle = this.context.fillStyle;
				break;
			case DrawMode.stroke:
				this.preDrawStyle = this.context.strokeStyle;
				break;
		}
	}

	protected restore = () => {
		switch (this.drawMode) {
			case DrawMode.fill:
				this.context.fillStyle = this.preDrawStyle;
				break;
			case DrawMode.stroke:
				this.context.strokeStyle = this.preDrawStyle;
				break;
		}
	}
}

export const createGraphicsElement = (context: CanvasRenderingContext2D, paths: Paths) => new GraphicsElement(context, paths);
