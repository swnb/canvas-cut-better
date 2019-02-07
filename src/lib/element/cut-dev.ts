import { createSamples } from 'lib/utils';

// getIntersections use dichotomies to find the intersection points;
export const getIntersections = (isPointInside: ([x, y]: Pos) => boolean, lineSegment: LineSegment): null | Pos[] => {
	const samples = createSamples(lineSegment, 10);

	const intersectons: Pos[] = [];
	let prePosInside = false;
	for (let i = 1; i < samples.length; i++) {
		const pos = samples[i];
		const isPosIn = isPointInside(pos);
		if ((prePosInside && !isPosIn) || (!prePosInside && isPosIn)) {
			const p = preciseGetIntersections(isPointInside, [samples[i - 1], samples[i]])
			if (p) intersectons.push(p);
			prePosInside = !prePosInside
		}
	}
	const length = intersectons.length;

	if (length === 0 || length % 2 !== 0) return null
	return intersectons;
}

const preciseGetIntersections = (isPointInside: (p: Pos) => boolean, lineSegment: LineSegment): Pos | null => {
	const samples = createSamples(lineSegment, 1);
	const prePosInside = isPointInside(samples[0]);
	for (let i = 1; i < samples.length; i++) {
		const pos = samples[i];
		const curPosInside = isPointInside(pos);
		if (curPosInside !== prePosInside) {
			return pos;
		}
	}
	return null;
}