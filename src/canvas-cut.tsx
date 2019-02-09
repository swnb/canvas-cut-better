import * as React from 'react';
import { attachCanvas, CanvasCut } from 'lib';
import { Irregular, Triangle, Parallelogram } from 'lib/species';
import { randomMove } from 'lib/tag/random';

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

		const canvas = this.ref.current as HTMLCanvasElement;
		const canvasCut = attachCanvas(canvas);
		randomMove(canvasCut.createElement(Triangle.create(Triangle.Type.t1)));
		randomMove(canvasCut.createElement(Triangle.create(Triangle.Type.t2)));
		randomMove(canvasCut.createElement(Triangle.create(Triangle.Type.t3)));
		randomMove(canvasCut.createElement(Irregular.create(Irregular.Type.t1)));
		randomMove(canvasCut.createElement(Irregular.create(Irregular.Type.t2)));
		randomMove(canvasCut.createElement(Irregular.create(Irregular.Type.t3)));
		randomMove(
			canvasCut.createElement(Parallelogram.create(Parallelogram.Type.t1))
		);
		randomMove(
			canvasCut.createElement(Parallelogram.create(Parallelogram.Type.t2))
		);
		randomMove(
			canvasCut.createElement(Parallelogram.create(Parallelogram.Type.t3))
		);
		this.cc = canvasCut;
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

	private onPointerUp = (event: ReactEvent) => {
		if (!this.startOprate || !this.cc) return;
		this.cc.receivePointerUp();
		this.startOprate = false;
	};

	private setSize = () => {
		const canvas = this.ref.current as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
}
