import { findPointInsideLineSegment, createSamples } from 'lib/utils';
import { preciseGetIntersections } from './count-intersections';
import { Element } from 'lib/element';

export class Cutter {
	private cutLine: LineSegment | null = null;
	private cutLineSamples: Pos[] = [];

	public cutElement = (element: Element) => {
		if (!this.cutLine) return null;

		const intersectons = this.getIntersections(element);
		if (!intersectons) return null;

		const paths = element.getPaths();
		return this.cut(paths, intersectons);
	}

	public setCutLine = (lineSegment: LineSegment) => {
		this.cutLine = lineSegment;
		this.cutLineSamples = createSamples(this.cutLine, 10);
		return this;
	}

	public clear = () => {
		this.cutLine = null;
	}

	private getIntersections = ({ isPointInside }: Element): null | Pos[] => {
		const { cutLineSamples: samples } = this;
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

	private cut = (paths: Paths, intersections: Pos[]): Paths[] | null => {
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
}