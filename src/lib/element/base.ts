import { Color } from "./color";
import { affineTransformation, getCosDeg, getSinDeg, linearMove } from 'lib/utils';

export interface BaseElement {
	move(vector: Pos): void;
	rotate(vector: Pos): void;
	record(): void;
}

export class BaseElement {
	public key = Symbol();

	private centerPoint: Pos;
	// private originPaths: Paths;
	private recordPathsQueue: Paths[] = [];
	private currentPaths: Paths;

	constructor(centerPoint: Pos, paths: Pos[], color: Color) {
		this.centerPoint = centerPoint;
		// this.originPaths = [...paths];
		this.currentPaths = [...paths];
		// this.color = color;
	}

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

	public rotate = (vector: Pos) => {
		const baseVector = [1, 1] as Pos;
		const movingVector = [2, 2] as Pos;
		const cosDeg = getCosDeg(baseVector, movingVector);
		const sinDeg = getSinDeg(baseVector, movingVector)
		this.currentPaths = this.currentPaths.map(pos => affineTransformation(cosDeg, sinDeg, pos));
	}

	public record = () => {
		this.recordPathsQueue.push([...this.currentPaths]);
	}

	public cut = (vector: Pos) => {
		return void (0);
	}
}