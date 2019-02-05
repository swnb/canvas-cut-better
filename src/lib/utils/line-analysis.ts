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

export const reduceVectorSize = ([x, y]: Vector, size: number): Vector => {
	const distance = Math.sqrt((x ** 2) + (y ** 2))
	return [x * size / distance, y * size / distance];
}

export const countSepatateVector = (centerPoint: Pos, [startPoint, endPoint]: LineSegment): Vector => {
	const segmentLength1 = distanceAB(startPoint, centerPoint);
	const segmentLength2 = distanceAB(centerPoint, endPoint);
	const ratio = segmentLength1 / (segmentLength1 + segmentLength2)
	return abVector([(endPoint[0] - startPoint[0]) * ratio + startPoint[0], (endPoint[1] - startPoint[1]) * ratio + startPoint[1]], centerPoint);
}
