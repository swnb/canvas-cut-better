import * as React from 'react';
import { attachCanvas, EnhanceCore } from 'lib';

import Event from 'power-event';

type ReactEvent = React.PointerEvent<HTMLCanvasElement>;

const getPointerPos = ({ clientX, clientY }: ReactEvent): Point => [
	clientX,
	clientY
];

export class CanvasCutComponent extends React.PureComponent {
	public ref = React.createRef<HTMLCanvasElement>();

	private startOprate = false;
	private prePos: Point = [0, 0];
	private CCC: EnhanceCore | undefined;

	private eC = Event.space('menu');
	private unSubscribe: () => any | undefined;

	public componentDidMount = () => {
		const { setSize, eC } = this;
		setSize();

		const canvas = this.ref.current as HTMLCanvasElement;
		const canvasCutCore = attachCanvas(canvas);
		this.unSubscribe = eC.on('create-graph', (path: Path) => {
			canvasCutCore.enhanceCreateElement(path);
		});
		this.CCC = canvasCutCore;
		window.addEventListener('resize', setSize);
	};

	public render = () => (
		<canvas
			ref={this.ref}
			onPointerDown={this.onPointerDown}
			onPointerMove={this.onPointerMove}
			onPointerUp={this.onPointerUp}
			onPointerLeave={this.onPointerUp}
		/>
	);

	public componentWillUnmount = () => {
		if (this.CCC) this.CCC.destory();

		this.unSubscribe();
		window.removeEventListener('resize', this.setSize);
	};

	private onPointerDown = (event: ReactEvent) => {
		if (!this.CCC) return;
		this.startOprate = true;
		this.prePos = getPointerPos(event);
		this.CCC.receivePointerDown(this.prePos);
	};

	private onPointerMove = (event: ReactEvent) => {
		if (!this.startOprate || !this.CCC) return;
		const nextPos = getPointerPos(event);
		this.CCC.receivePointerMove(this.prePos, nextPos);
		this.prePos = nextPos;
	};

	private onPointerUp = (event: ReactEvent) => {
		if (!this.startOprate || !this.CCC) return;
		this.CCC.receivePointerUp();
		this.startOprate = false;
	};

	private setSize = () => {
		const canvas = this.ref.current as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
}
