import { affineTransformation, linearMove, countCenterPointer } from 'lib/utils';

export class BaseElement {
	public key = Symbol();

	private centerPoint: Pos;
	// private originPaths: Paths;
	private recordPathsQueue: Paths[] = [];
	private currentPaths: Paths;

	constructor(paths: Pos[]) {
		this.centerPoint = countCenterPointer(paths)
		// this.originPaths = [...paths];
		this.currentPaths = [...paths];
	}

	public getCenterPionter = () => [...this.centerPoint] as Pos;

	public draw = (path2d: Path2D) => {
		const { currentPaths } = this;
		path2d.moveTo(...currentPaths[0]);
		for (let i = 1; i < currentPaths.length; i++) {
			path2d.lineTo(...currentPaths[i]);
		}
		path2d.closePath();
	}

	public move = (vector: Pos) => {
		this.currentPaths = this.currentPaths.map(pos => linearMove(pos, vector));
		this.centerPoint = linearMove(this.centerPoint, vector)
	}

	public rotate = (cosDeg: number, sinDeg: number) => {
		this.currentPaths = this.currentPaths.map(pos => affineTransformation(cosDeg, sinDeg, pos, this.centerPoint));
	}

	public record = () => {
		this.recordPathsQueue.push([...this.currentPaths]);
	}

	public cut = (vector: Pos) => {
		return void (0);
	}
}