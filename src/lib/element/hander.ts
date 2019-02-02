import { BaseElement } from './base';
import { Color } from './color';
import { RenderElement } from 'lib/render';

type DrawMode = 'fill' | 'stroke';

export class Handler extends BaseElement implements RenderElement {
	private isChange = true;

	private drawMode: DrawMode = 'fill';
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

	public isPointerInside = (point: Pos) => this.ctx.isPointInPath(this.path2d, ...point)

	public changeState = () => {
		if (!this.isChange) this.isChange = true;
	}

	public render = () => {
		const { ctx, color, drawMode } = this;
		if (!ctx) return;

		// path2d will reclare when element is change
		let path2d = this.path2d
		if (this.isChange) {
			path2d = new Path2D();
			this.draw(path2d);
			this.path2d = path2d;
			this.isChange = false;
		}

		this.save();
		ctx.fillStyle = color.getColor();
		switch (drawMode) {
			case "fill":
				ctx.fill(path2d);
				break
			case 'stroke':
				ctx.stroke(path2d);
				break
		}
		this.reStore();
	}

	private save = () => {
		switch (this.drawMode) {
			case "fill":
				this.preDrawStyle = this.ctx.fillStyle;
				break
			case 'stroke':
				this.preDrawStyle = this.ctx.strokeStyle;
				break
		}
	}

	private reStore = () => {
		switch (this.drawMode) {
			case "fill":
				this.ctx.fillStyle = this.preDrawStyle;
				break
			case 'stroke':
				this.ctx.strokeStyle = this.preDrawStyle;
				break
		}
	}
}
