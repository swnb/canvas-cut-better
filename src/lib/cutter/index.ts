import { createSamples } from 'lib/utils';
import { findPointInsideLineSegment } from 'lib/utils/line-analysis';
export { Sepatater } from './separate';

interface Element {
	isPointInside(pos: Pos): boolean;
}
// getIntersections use dichotomies to find the intersection points;
export const getIntersections = ({ isPointInside }: Element, lineSegment: LineSegment): null | [Pos, Pos] => {
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

export const cut = (paths: Paths, [intersection1, intersection2]: [Pos, Pos]): [Paths, Paths] | null => {
	// searchFlag false means first intersection found;
	// true means second intersection found;
	let isFirstIFound = false;
	const newPaths1: Paths = [];
	const newPaths2: Paths = [];
	const intersections = [intersection1, intersection2];
	for (let i = 0; i < paths.length; i++) {
		let nextIndex = i + 1;
		if (nextIndex === paths.length) nextIndex = 0;
		if (!isFirstIFound) {
			newPaths1.push(paths[i])
			const result = findPointInsideLineSegment(intersections, [paths[i], paths[nextIndex]]);
			if (result) {
				newPaths1.push(result);
				newPaths2.push(result);
				isFirstIFound = true;
			}
		} else {
			newPaths2.push(paths[i]);
			const result = findPointInsideLineSegment(intersections, [paths[i], paths[nextIndex]]);
			if (result) {
				newPaths1.push(result, ...paths.slice(i + 1));
				newPaths2.push(result);
				// break this lopp
				break
			}
		}
	}
	if (newPaths1.length < 3 || newPaths2.length < 3) return null;
	return [newPaths1, newPaths2];
}
