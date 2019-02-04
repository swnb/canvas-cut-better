import { RenderElement } from 'lib/render';
import { BaseElement } from 'lib/element';
import { distanceAB, abVector } from 'lib/utils';

interface SepatatingElement {
	distance2end: number;
	vector: Vector;
	move(v: Vector): void;
}

const baseDistance = 20;
const vectorSize = 0.8;

const reduceVectorSize = ([x, y]: Vector, size: number): Vector => {
	const ratio = Math.sqrt((x ** 2) + (y ** 2)) / size;
	return [x / ratio, y / ratio];
}

const countSepatateVector = (centerPoint: Pos, [startPoint, endPoint]: LineSegment): Vector => {
	const segmentLength1 = distanceAB(startPoint, centerPoint);
	const segmentLength2 = distanceAB(centerPoint, endPoint);
	const ratio = segmentLength1 / (segmentLength1 + segmentLength2)
	const vector = abVector([(endPoint[0] - startPoint[0]) * ratio + startPoint[0], (endPoint[1] - startPoint[1]) * ratio + startPoint[1]], centerPoint);
	return reduceVectorSize(vector, vectorSize);
}

export class Sepatater implements RenderElement {
	public key = Symbol();

	public elements: Map<symbol, SepatatingElement> = new Map();

	public addElement = (element: BaseElement, lineSegment: LineSegment) => {
		const { key, move } = element;
		const vector = countSepatateVector(element.getCenterPiont(), lineSegment);
		this.elements.set(key, { distance2end: baseDistance, move, vector });
	}

	public render = () => {
		const { elements } = this;
		elements.forEach((element, key) => {
			const { move, vector, distance2end } = element;
			if (distance2end <= 0) {
				elements.delete(key);
			} else {
				move(vector);
				element.distance2end = distance2end - vectorSize;
			}
		})
	}
}
