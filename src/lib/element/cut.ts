import { findPointInsideLineSegment } from 'lib/utils/line-analysis';

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
