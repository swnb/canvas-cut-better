// a * b
export const ab = ([ax, ay]: Pos, [bx, by]: Pos) => (ax * bx) + (ay * by);

// a X b
export const aXb = ([ax, ay]: Pos, [bx, by]: Pos) => (ax * by) - (ay * bx);

export const linearMove = ([x, y]: Pos, [offsetX, offsetY]: Pos): Pos => [x + offsetX, y + offsetY];

export const countCenterPointer = (paths: Paths): Pos => {
	const length = paths.length;
	if (length <= 2) return [Number.NaN, Number.NaN];

	return paths.reduce(([accX, accY]: Pos, [x, y]: Pos) => [accX + x, accY + y], [0, 0]).map(acc => acc / length) as Pos
}
