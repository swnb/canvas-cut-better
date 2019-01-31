// a * b
export const ab = ([ax, ay]: Pos, [bx, by]: Pos) => ax * bx + ay * by;

// a X b
export const aXb = ([ax, ay]: Pos, [bx, by]: Pos) => ax * by - ay * bx;

export const linearMove = ([x, y]: Pos, [offsetX, offsetY]: Pos): Pos => [x + offsetX, y + offsetY];

export const getMiddle = (paths: Paths): Pos => {
	if (paths.length === 0) return [0, 0]

	return paths.reduce(([averagex, averagey]: Pos, [x, y]: Pos, ) => [(x + averagex) / 2, (y + averagey) / 2], paths[0]);
}
