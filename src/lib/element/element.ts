import { affineTransformation, linearMove, countCenterPos } from 'lib/utils';
import { totalDegPlus } from 'lib/utils';
import { cut } from 'lib/element/cut';
import { getIntersections } from './cut-dev';

export abstract class Element {

	public get locked() { return this.isLocked; }
	public key = Symbol();

	protected centerPoint: Pos;
	protected originPaths: Paths;
	protected recordPathsQueue: Paths[] = [];
	protected currentPaths: Paths;
	protected totalCosSinDeg: [number, number] = [1, 0];

	private isLocked = false;

	constructor(paths: Pos[]) {
		this.centerPoint = countCenterPos(paths)
		this.originPaths = [...paths];
		this.currentPaths = [...paths];
	}

	public getCenterPiont = () => [...this.centerPoint] as Pos;

	public getPaths = () => [...this.currentPaths] as Paths;

	public getTotalCosSinDeg = () => [...this.totalCosSinDeg] as [number, number];

	public lock = () => {
		if (!this.isLocked) this.isLocked = true;
	}

	public unLock = () => {
		if (this.isLocked) this.isLocked = false;
	}

	public move = (vector: Pos) => {
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

	public cut = (lineSegment: LineSegment): Paths[] | null => {
		if (this.isLocked) return null;

		const intersections = this.getIntersections(lineSegment);
		if (!intersections) return null;

		return cut(this.currentPaths, intersections);
	}

	public record = () => {
		this.recordPathsQueue.push([...this.currentPaths]);
	}

	public abstract isPointInside(point: Pos): boolean;

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

	// getIntersections use dichotomies to find the intersection points;
	private getIntersections = (lineSegment: LineSegment): null | Pos[] => {
		return getIntersections(this.isPointInside, lineSegment);
	}
}
