import { ab, aXb } from './matrix';

// distance get distance os two point;
export const absAB = ([ax, ay]: Vector, [bx, by]: Vector) => Math.sqrt(((ax ** 2) + (ay ** 2)) * ((bx ** 2) + (by ** 2)));

export const getCosDeg = (aVector: Vector, bVector: Vector) => ab(aVector, bVector) / (absAB(aVector, bVector));

export const getSinDeg = (aVector: Vector, bVector: Vector) => aXb(aVector, bVector) / (absAB(aVector, bVector));

// implement affine-transformation with javascript
// (define newX (- (* x (cos deg)) (* y (sin deg))))
// (define newY (+ (* x (sin deg)) (* y (cos deg))))
export const affineTransformation = (cosDeg: number, sinDeg: number, [x, y]: Pos, [originX, originY]: Pos = [0, 0]): Vector => {
	const [relX, relY] = [x - originX, y - originY];
	const [nextX, nextY] = [relX * cosDeg - relY * sinDeg, relX * sinDeg + relY * cosDeg]
	return [nextX + originX, nextY + originY];
}