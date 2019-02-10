import { affineTransformation, linearMove, countCenterPos } from 'lib/utils';
import { totalDegPlus } from 'lib/utils';

export abstract class Element {

	public get locked() { return this.isLocked; }
	public key = Symbol();

	protected centerPoint: Point;
	protected originPaths: Path;
	protected recordPathsQueue: Path[] = [];
	protected currentPaths: Path;
	protected totalCosSinDeg: [number, number] = [1, 0];

	private isLocked = false;

	constructor(paths: Point[]) {
		this.centerPoint = countCenterPos(paths)
		this.originPaths = [...paths];
		this.currentPaths = [...paths];
	}

	public getCenterPiont = () => [...this.centerPoint] as Point;

	public getPaths = () => [...this.currentPaths] as Path;

	public getTotalCosSinDeg = () => [...this.totalCosSinDeg] as [number, number];

	public lock = () => {
		if (!this.isLocked) this.isLocked = true;
	}

	public unLock = () => {
		if (this.isLocked) this.isLocked = false;
	}

	public move = (vector: Point) => {
		if (this.isLocked) return;

		const { centerPoint, currentPaths } = this;
		for (let i = 0; i < currentPaths.length; i++) {
			currentPaths[i] = linearMove(currentPaths[i], vector)
		}
		this.centerPoint = linearMove(centerPoint, vector)
		this.changeState();
	}

	public rotate = (cosDeg: number, sinDeg: number) => {
		if (this.isLocked) return;

		const { currentPaths } = this;
		for (let i = 0; i < currentPaths.length; i++) {
			currentPaths[i] = affineTransformation(cosDeg, sinDeg, currentPaths[i], this.centerPoint)
		}
		this.totalCosSinDeg = totalDegPlus(this.totalCosSinDeg, [cosDeg, sinDeg]);
		this.changeState();
	}

	public record = () => {
		this.recordPathsQueue.push([...this.currentPaths]);
	}

	public abstract isPointInside(point: Point): boolean;

	public abstract render(): void;

	protected drawPath2d = () => {
		const path2d = new Path2D();
		const { currentPaths } = this;
		path2d.moveTo(...currentPaths[0]);
		for (let i = 1; i < currentPaths.length; i++) path2d.lineTo(...currentPaths[i]);
		path2d.closePath();
		return path2d;
	}

	protected abstract changeState(): void;

	protected abstract stretchBack(): void;
}
