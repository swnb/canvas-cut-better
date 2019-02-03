import { affineTransformation, linearMove, countCenterPos } from 'lib/utils';
import { totalDegPlus } from 'lib/utils';

export abstract class BaseElement {
	public key = Symbol();

	private centerPoint: Pos;
	// private originPaths: Paths;
	private recordPathsQueue: Paths[] = [];
	private currentPaths: Paths;
	private totalCosSinDeg: [number, number] = [1, 0];

	constructor(paths: Pos[]) {
		this.centerPoint = countCenterPos(paths)
		// this.originPaths = [...paths];
		this.currentPaths = [...paths];
	}

	public getCenterPionter = () => [...this.centerPoint] as Pos;

	public getPaths = () => [...this.currentPaths] as Paths;

	public getTotalCosSinDeg = () => [...this.totalCosSinDeg] as [number, number];

	public move = (vector: Pos) => {
		const { centerPoint, currentPaths } = this;
		for (let i = 0; i < currentPaths.length; i++) {
			currentPaths[i] = linearMove(currentPaths[i], vector)
		}
		this.centerPoint = linearMove(centerPoint, vector)
		this.changeState();
	}

	public rotate = (cosDeg: number, sinDeg: number) => {
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

	public cut = (vector: Pos) => {
		// TODO write cut logic in here
		return void (0);
	}

	protected drawPath2d = () => {
		const path2d = new Path2D()
		const { currentPaths } = this;
		path2d.moveTo(...currentPaths[0]);
		for (let i = 1; i < currentPaths.length; i++) {
			path2d.lineTo(...currentPaths[i]);
		}
		path2d.closePath();
		return path2d;
	}

	protected abstract save(): void;

	protected abstract restore(): void;

	protected abstract changeState(): void;
}