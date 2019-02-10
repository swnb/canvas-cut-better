const { NaN, EPSILON } = Number;

// a * b
export const ab = ([ax, ay]: Point, [bx, by]: Point) => (ax * bx) + (ay * by);

// a X b
export const aXb = ([ax, ay]: Point, [bx, by]: Point) => (ax * by) - (ay * bx);

export const linearMove = ([x, y]: Point, [offsetX, offsetY]: Point): Point => [x + offsetX, y + offsetY];

export const countCenterPos = (paths: Path): Point => {
	const length = paths.length;
	if (length <= 2) return [NaN, NaN];

	return paths.reduce(([accX, accY]: Point, [x, y]: Point) => [accX + x, accY + y], [0, 0]).map(acc => acc / length) as Point;
}

export const isSamePos = (a: Point, b: Point) => Math.abs(a[0] - b[0]) <= EPSILON && Math.abs(a[1] - b[1]) <= EPSILON;

export const abVector = ([ax, ay]: Point, [bx, by]: Point): Point => [bx - ax, by - ay];

export const abPlus = ([ax, ay]: Point, [bx, by]: Point): Point => [ax + bx, ay + by];
