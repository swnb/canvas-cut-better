import { BaseElement } from './base';
import { Color } from './color';
import { RenderElement } from 'lib/render';

type DrawMode = 'fill' | 'stroke';

export class Handler extends BaseElement implements RenderElement {
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

	// todo: 这里需要写入代码
	public isPointerInsideRotateHandler = (pointer: Pos) => false;

	public render = () => {
		const { ctx, color, path2d, drawMode } = this;
		if (!ctx) return;

		this.save();
		ctx.fillStyle = color.getColor();
		this.draw(path2d);
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
		this.preDrawStyle = this.ctx.fillStyle;
	}

	private reStore = () => {
		this.ctx.fillStyle = this.preDrawStyle;
	}
}
