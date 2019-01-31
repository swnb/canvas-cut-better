export interface RenderElement {
	key: symbol;
	render(): void
}

export class Render {
	public static getInstance = () => Render.instance;
	private static instance = new Render();

	private running = false;
	private renderTimeID: number | null = null;
	private renderElements: Map<symbol, RenderElement> = new Map();

	public registRender = (element: RenderElement) => {
		this.renderElements.set(element.key, element);
		// check if this engine is stop or not;
		if (!this.running) {
			this.running = true;
			this.start();
		}

		return () => this.remove(element);
	}


	public start = () => {
		// everytime start will check the renderElements length; and will stop when there is no render elements;
		if (this.renderElements.size === 0) {
			this.running = false;
			return
		}

		this.render();

		this.renderTimeID = window.requestAnimationFrame(this.start);
	}

	public remove = (element: RenderElement) => {
		this.renderElements.delete(element.key);
	}

	public stop = () => {
		if (this.renderTimeID) {
			window.cancelAnimationFrame(this.renderTimeID);
			this.renderTimeID = null;
			this.running = false;
		}
	}

	public isRunning = () => this.running;

	public clear = () => {
		this.renderElements.clear();
	}

	private render = () => {
		this.renderElements.forEach(ele => ele.render());
	}
}