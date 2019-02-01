import { Render } from './render';

// this is index ts

class CanvasCut {
	private context: CanvasRenderingContext2D;
	private render: Render = Render.getInstance();

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
	}

	public create() {
		this.render.registRender({ key: Symbol(), render() { void (0) } });
	}

}

export const attachContext = (context: CanvasRenderingContext2D) => {
	const handler = new CanvasCut(context)
}