import { affineTransformation, linearMove } from 'lib/utils';

export class BaseElement {
	public key = Symbol();

	public centerPoint: Pos;
	// private originPaths: Paths;
	private recordPathsQueue: Paths[] = [];
	private currentPaths: Paths;

	constructor(centerPoint: Pos, paths: Pos[]) {
		this.centerPoint = [...centerPoint] as Pos;
		// this.originPaths = [...paths];
		this.currentPaths = [...paths];
		// this.color = color;
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

	public rotate = (cosDeg: number, sinDeg: number, ) => {
		this.currentPaths = this.currentPaths.map(pos => affineTransformation(cosDeg, sinDeg, pos));
	}

	public record = () => {
		this.recordPathsQueue.push([...this.currentPaths]);
	}

	public cut = (vector: Pos) => {
		return void (0);
	}
}