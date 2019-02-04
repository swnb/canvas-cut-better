import { abVector, abPlus } from './matrix';
import { distanceAB } from './affine-transformation';

export const createSamples = ([a, b]: LineSegment, step: number) => {
	const sampleSize = distanceAB(a, b) / step;
	const abV = abVector(a, b).map(axis => axis / sampleSize) as Vector;

	const samples = [a];
	for (let i = 0; i < sampleSize; i++) {
		a = abPlus(a, abV)
		samples.push(a);
	}
	return samples;
}

export const isPointInsideLineSegment = (point: Pos, [startPoint, endPoint]: LineSegment) => {
	const segment1 = distanceAB(startPoint, point);
	const segment2 = distanceAB(point, endPoint);
	return Math.abs((segment1 + segment2) - distanceAB(startPoint, endPoint)) <= 0.1
}

export const findPointInsideLineSegment = (points: Pos[], [startPoint, endPoint]: LineSegment): null | Pos => {
	const length = distanceAB(startPoint, endPoint);
	for (const point of points) {
		const segment1 = distanceAB(startPoint, point);
		const segment2 = distanceAB(point, endPoint);
		if (Math.abs((segment1 + segment2) - length) <= 0.1) return point;
	}
	return null;
}
