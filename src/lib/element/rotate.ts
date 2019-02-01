import { RenderElement } from 'lib/render';
import { BaseElement } from './base';

export class Rotater implements RenderElement {
	public key = Symbol();

	private context: CanvasRenderingContext2D;
	private path2d: Path2D | null = null;
	private centerPointer: Pos | null = null;
	private lastElementKey: symbol | null = null;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context
	}

	public render = () => {
		if (!this.lastElementKey) return;
		// TODO move by time
		this.context.fill(this.path2d);
	}

	public destory = () => {
		this.centerPointer = null;
	}

	public bindElement = (element: BaseElement) => {
		if (this.lastElementKey && this.lastElementKey === element.key) return;

		this.lastElementKey = element.key;
		this.centerPointer = element.getCenterPionter();
		//  TODO write paths
	}

	public isPointerInside = (pointer: Pos) => {
		if (!this.path2d) {
			// TODO make pointer is inside
		}
	}

	public rotate = () => {
		// TODO rotate
	}

	private draw = ([cx, cy]: Pos) => {
		this.path2d.ellipse(cx, cy - 100, 10, 10, 0, 0, 2 * Math.PI)
	}
}

