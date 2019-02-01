import * as React from 'react';
import { attachContext, CanvasCut } from 'lib';

type ReactEvent = React.PointerEvent<HTMLCanvasElement>;

const getPointer = ({ clientX, clientY }: ReactEvent): Pos => [
	clientX,
	clientY
];

export class CanvasCutComponent extends React.PureComponent {
	public ref = React.createRef<HTMLCanvasElement>();

	private startOprate = false;
	private prePointer: Pos = [0, 0];
	private cc: CanvasCut | null = null;

	public componentDidMount = () => {
		this.setSize();
		const canvas = (this.ref.current as HTMLCanvasElement) as HTMLCanvasElement;
		this.cc = attachContext(canvas);
		this.cc.createElement();
		this.cc.init();
		window.addEventListener('resize', this.setSize);
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
		if (this.cc) {
			this.cc.destory();
			this.cc = null;
		}
		window.removeEventListener('resize', this.setSize);
	};

	private onPointerDown = (event: ReactEvent) => {
		if (!this.cc) return;
		this.startOprate = true;
		this.prePointer = getPointer(event);
		this.cc.receivePointerDown(this.prePointer);
	};

	private onPointerMove = (event: ReactEvent) => {
		if (!this.startOprate || !this.cc) return;
		const nextPointer = getPointer(event);
		this.cc.receivePointerMove(this.prePointer, nextPointer);
		this.prePointer = nextPointer;
	};

	private onPointerUp = () => {
		if (!this.cc) return;
		this.cc.receivePointerUp();
		this.startOprate = false;
	};

	private setSize = () => {
		const canvas = this.ref.current as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
}
