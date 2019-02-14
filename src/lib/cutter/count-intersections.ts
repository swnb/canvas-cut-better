import { createSamples } from 'lib/utils';

export const preciseGetIntersections = (isPointInside: (p: Point) => boolean, lineSegment: LineSegment): Point | null => {
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
