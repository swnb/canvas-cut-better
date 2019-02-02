import { BaseElement } from './base';
import { Color } from './color';
import { RenderElement } from 'lib/render';

export enum DrawMode { fill = 1, stroke };

export class Handler extends BaseElement implements RenderElement {
	private isChange = true;

	private drawMode: DrawMode = DrawMode.fill;
	private color: Color = new Color(107, 185, 240);
	private preDrawStyle: string | CanvasGradient | CanvasPattern = "";
	private ctx: CanvasRenderingContext2D;
	private path2d = new Path2D();

	public attachContext = (context: CanvasRenderingContext2D) => {
		this.ctx = context;
	}

	public setColor = (color: Color) => {
		this.color = color
	}

	public setDrawMode = (mode: DrawMode) => {
		this.drawMode = mode
	}

	public isPointInside = (point: Pos) => this.ctx.isPointInPath(this.path2d, ...point)

	public render = () => {
		const { ctx, color, drawMode } = this;
		if (!ctx) return;

		// path2d will reclare when element is change
		if (this.isChange) {
			this.path2d = this.drawPath2d();
			this.isChange = false;
		}
		const { path2d } = this;

		this.save();
		ctx.fillStyle = color.getColor();
		switch (drawMode) {
			case DrawMode.fill:
				ctx.fill(path2d);
				break
			case DrawMode.stroke:
				ctx.stroke(path2d);
				break
		}
		this.reStore();
	}

	protected changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	protected save = () => {
		switch (this.drawMode) {
			case DrawMode.fill:
				this.preDrawStyle = this.ctx.fillStyle;
				break
			case DrawMode.stroke:
				this.preDrawStyle = this.ctx.strokeStyle;
				break
		}
	}

	protected reStore = () => {
		switch (this.drawMode) {
			case DrawMode.fill:
				this.ctx.fillStyle = this.preDrawStyle;
				break
			case DrawMode.stroke:
				this.ctx.strokeStyle = this.preDrawStyle;
				break
		}
	}
}
