import { BaseElement } from './base';
import { Color } from './color';
import { RenderElement } from 'lib/render';

export class Handler extends BaseElement implements RenderElement {
	private color: Color = new Color(107, 185, 240);
	private ctx: CanvasRenderingContext2D;
	private path2d = new Path2D();

	public attachContext = (context: CanvasRenderingContext2D) => {
		this.ctx = context;
	}

	public isInside = (point: Pos) => this.ctx.isPointInPath(this.path2d, ...point)

	public render = () => {
		const { ctx } = this;
		if (!ctx) return;

		const prefillStyle = ctx.fillStyle;
		ctx.fillStyle = this.color.getColor();
		this.draw(this.path2d);
		ctx.fill(this.path2d);
		ctx.fillStyle = prefillStyle;
	}
}
