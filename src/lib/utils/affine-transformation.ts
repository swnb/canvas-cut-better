import { ab, aXb } from './matrix';

// distance get distance os two point;
export const distance = ([sx, sy]: Pos, [ex, ey]: Pos) => Math.sqrt(((ex - sx) ** 2) + ((ey - sy) ** 2));

export const getCosDeg = (aVector: Pos, bVector: Pos) => ab(aVector, bVector) / distance(aVector, bVector);

export const getSinDeg = (aVector: Pos, bVector: Pos) => aXb(aVector, bVector) / distance(aVector, bVector);

// implement affine-transformation with javascript
// (define newX (+ (* x (cos deg)) (* x (sin deg))))
// (define newY (- (* y (cos deg)) (* y (sin deg))))
export const affineTransformation = (cosDeg: number, sinDeg: number, [x, y]: Pos): Pos => [x * cosDeg + x * sinDeg, y * cosDeg - y * sinDeg];