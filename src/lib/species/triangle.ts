import { base, sqrt3, sqrt2 } from "./base-var";

export enum Type {
	Triangle1 = 1,
	Triangle2,
	Triangle3
}

export const Triangle = (type: Type): Paths => {
	const { size: baseSize } = base;
	switch (type) {
		case Type.Triangle1: return [[sqrt3 * baseSize / 2, 0], [0, 3 * baseSize / 2], [sqrt3 * baseSize, 3 * baseSize / 2]];
		case Type.Triangle2: return [[baseSize * sqrt2, 0], [baseSize * sqrt2, baseSize * sqrt2], [0, baseSize * sqrt2]];
		case Type.Triangle3: return [[baseSize, 0], [baseSize, baseSize * sqrt3], [0, baseSize * sqrt3]];
	}
}
