import { abVector, abPlus } from './matrix';
import { distanceAB } from './affine-transformation';

const reduceSize = (sampleSize: number) => (axis: number) => axis / sampleSize;

export const analysis = ([a, b]: LineSegment) => {
	const sampleSize = distanceAB(a, b) / 30;
	const abV = abVector(a, b).map(reduceSize(sampleSize)) as Vector;

	const samples = [a];
	for (let i = 0; i < sampleSize; i++) {
		a = abPlus(a, abV)
		samples.push(a);
	}
	return samples;
}
