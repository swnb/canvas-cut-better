import { ab, aXb, abVector } from './matrix';

export const distanceAB = ([ax, ay]: Vector, [bx, by]: Vector) => Math.sqrt(((bx - ax) ** 2) + ((by - ay) ** 2));
// equal to |a||b|;
const absAB = ([ax, ay]: Vector, [bx, by]: Vector) => Math.sqrt(((ax ** 2) + (ay ** 2)) * ((bx ** 2) + (by ** 2)));

export const getCosDeg = (aVector: Vector, bVector: Vector) => ab(aVector, bVector) / (absAB(aVector, bVector));

export const getSinDeg = (aVector: Vector, bVector: Vector) => aXb(aVector, bVector) / (absAB(aVector, bVector));

export const countDeg = (originPos: Pos, prePos: Pos, currentPos: Pos): [number, number] => {
	const preVector: Vector = abVector(originPos, prePos);
	const currentVector: Vector = abVector(originPos, currentPos);
	return [getCosDeg(preVector, currentVector), getSinDeg(preVector, currentVector)];
}

// implement affine-transformation with javascript
// (define newX (- (* x (cos deg)) (* y (sin deg))))
// (define newY (+ (* x (sin deg)) (* y (cos deg))))
export const affineTransformation = (cosDeg: number, sinDeg: number, [x, y]: Pos, [originX, originY]: Pos = [0, 0]): Vector => {
	const [relX, relY] = [x - originX, y - originY];
	const [nextX, nextY] = [relX * cosDeg - relY * sinDeg, relX * sinDeg + relY * cosDeg]
	return [nextX + originX, nextY + originY];
}
