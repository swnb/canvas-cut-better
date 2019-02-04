import { affineTransformation, linearMove, countCenterPos, createSamples } from 'lib/utils';
import { totalDegPlus } from 'lib/utils';
import { cut } from 'lib/element/cut';

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

	public getCenterPiont = () => [...this.centerPoint] as Pos;

	public getPaths = () => [...this.currentPaths] as Paths;

	public getTotalCosSinDeg = () => [...this.totalCosSinDeg] as [number, number];

	// getIntersections use dichotomies to find the intersection points;
	public getIntersections = (lineSegment: LineSegment): null | [Pos, Pos] => {
		const { isPointInside } = this;
		const samples = createSamples(lineSegment, 20);
		let intersectionInterval1: LineSegment | undefined;
		let intersectionInterval2: LineSegment | undefined;
		let searchFirstIntersection1 = true;
		for (let i = 1; i < samples.length; i++) {
			const pos = samples[i];
			if (searchFirstIntersection1) {
				if (isPointInside(pos)) {
					intersectionInterval1 = [samples[i - 1], pos];
					// change search mode to search second intersection
					searchFirstIntersection1 = false;
				}
			} else {
				if (!isPointInside(pos)) {
					intersectionInterval2 = [samples[i - 1], pos];
					// when secon is found break all;
					break;
				}
			}
		}
		if (!intersectionInterval1 || !intersectionInterval2) return null;

		let firstIntersection: Pos = intersectionInterval1[0];
		for (const pos of createSamples(intersectionInterval1, 1)) {
			if (isPointInside(pos)) {
				firstIntersection = pos;
				break
			}
		}

		let secondIntersection: Pos = intersectionInterval2[0];
		for (const pos of createSamples(intersectionInterval2, 1)) {
			if (!isPointInside(pos)) {
				secondIntersection = pos;
				break
			}
		}
		return [firstIntersection, secondIntersection];
	}

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

	public cut = (intersections: LineSegment): [Paths, Paths] | null => cut(this.currentPaths, intersections);

	public record = () => {
		this.recordPathsQueue.push([...this.currentPaths]);
	}

	public abstract isPointInside(point: Pos): boolean;

	public abstract render(): void;

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
