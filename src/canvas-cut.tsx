import * as React from 'react';
import { attachContext, CanvasCut } from 'lib';

type ReactEvent = React.PointerEvent<HTMLCanvasElement>;

const getPointerPos = ({ clientX, clientY }: ReactEvent): Pos => [
	clientX,
	clientY
];

export class CanvasCutComponent extends React.PureComponent {
	public ref = React.createRef<HTMLCanvasElement>();

	private startOprate = false;
	private prePos: Pos = [0, 0];
	private cc: CanvasCut | null = null;

	public componentDidMount = () => {
		this.setSize();
		const canvas = (this.ref.current as HTMLCanvasElement) as HTMLCanvasElement;
		this.cc = attachContext(canvas);
		for (let i = 0; i < 10; i++) {
			this.cc.createElement([[25, 25], [75, 25], [25, 75]]);
		}
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
		this.prePos = getPointerPos(event);
		this.cc.receivePointerDown(this.prePos);
	};

	private onPointerMove = (event: ReactEvent) => {
		if (!this.startOprate || !this.cc) return;
		const nextPos = getPointerPos(event);
		this.cc.receivePointerMove(this.prePos, nextPos);
		this.prePos = nextPos;
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
