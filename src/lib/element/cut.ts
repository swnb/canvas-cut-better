import { findPointInsideLineSegment } from 'lib/utils/line-analysis';

export const cut = (paths: Paths, intersections: Pos[]): Paths[] | null => {
	// searchFlag false means first intersection found;
	// true means second intersection found;
	const originPaths: Paths = [];
	const newPaths: Paths[] = [originPaths];

	let findFirstInsection = false;
	let newPath = [];

	for (let i = 0; i < paths.length; i++) {
		const nextIndex = i + 1;
		if (nextIndex === paths.length) {
			const result = findPointInsideLineSegment(intersections, [paths[i], paths[0]]);
			if (findFirstInsection) {
				if (result) {
					newPath.push(paths[i], result);
					originPaths.push(result);
					newPaths.push(newPath);
					newPath = []
				} else {
					// 最后一个线段必须要连接不然无效;
					window.console.log("最后一个线段必须要连接不然无效");
					return null;
				}
			} else {
				if (result) {
					window.console.log("最后一个线段必须不能连接,不然无效");
					return null;
				} else {
					originPaths.push(paths[i]);
				}
			}
		} else {
			const result = findPointInsideLineSegment(intersections, [paths[i], paths[nextIndex]]);
			if (findFirstInsection) {
				newPath.push(paths[i]);
				if (result) {
					findFirstInsection = false;
					newPath.push(result);
					originPaths.push(result);

					newPaths.push(newPath);
					newPath = [];
				}
			} else {
				originPaths.push(paths[i])
				if (result) {
					findFirstInsection = true;
					newPath.push(result);
					originPaths.push(result);
				}
			}
		}
	}

	return newPaths;
}
