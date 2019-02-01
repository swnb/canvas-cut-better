import * as React from 'react';

type ReactEvent = React.PointerEvent<HTMLCanvasElement>;

const getPointer = ({ clientX, clientY }: ReactEvent): Pos => [
	clientX,
	clientY
];

export class CanvasCut extends React.PureComponent {
	public ref = React.createRef<HTMLCanvasElement>();

	private startMove = false;

	private prePointer: Pos = [0, 0];

	public componentDidMount = () => {
		this.setSize();
		// const canvas = (this.ref.current as HTMLCanvasElement) as HTMLCanvasElement;
		// const context = canvas.getContext('2d');

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
		window.removeEventListener('resize', this.setSize);
	};

	private onPointerDown = (event: ReactEvent) => {
		this.startMove = true;
		this.prePointer = getPointer(event);
	};

	private onPointerMove = (event: ReactEvent) => {
		if (!this.startMove) return;
		const [preX, preY] = this.prePointer;
		const nextPointer = getPointer(event);
		this.prePointer = nextPointer;
		const vector: Pos = [nextPointer[0] - preX, nextPointer[1] - preY];
	};

	private onPointerUp = () => {
		this.startMove = false;
	};

	private setSize = () => {
		const canvas = this.ref.current as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
}
