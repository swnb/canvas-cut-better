import { base, sqrt3, sqrt2 } from "./base-var";

export enum Type {
	t1 = 1,
	t2,
	t3
}

export const create = (type: Type, baseSize = base.size): Paths => {
	switch (type) {
		case Type.t1: {
			return [
				[sqrt3 * baseSize / 2, 0],
				[0, 3 * baseSize / 2],
				[sqrt3 * baseSize, 3 * baseSize / 2]
			];
		}
		case Type.t2: {
			return [
				[baseSize * sqrt2, 0],
				[baseSize * sqrt2, baseSize * sqrt2],
				[0, baseSize * sqrt2]
			];
		}
		case Type.t3: {
			return [
				[baseSize, 0],
				[baseSize, baseSize * sqrt3],
				[0, baseSize * sqrt3]
			];
		}
	}
}
