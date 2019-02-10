import { base, sqrt2 } from './base-var';

export enum Type {
	t1 = 1,
	t2,
	t3,
	tP
}

export const create = (type: Type, baseSize = base.size): Path => {
	switch (type) {
		case Type.t1: {
			return [
				[baseSize, 0],
				[baseSize * 2, 0],
				[baseSize, baseSize],
				[0, baseSize]
			];
		}
		case Type.t2: {
			return [
				[0, 0],
				[baseSize * sqrt2, 0],
				[baseSize * sqrt2, baseSize * sqrt2],
				[0, baseSize * sqrt2]
			];
		}
		case Type.t3: {
			return [
				[0, 0],
				[(baseSize * 2) / 3, 0],
				[(baseSize * 2) / 3, (baseSize * 3) / 2],
				[0, (baseSize * 3) / 2]
			];
		}
		case Type.tP: {
			return [
				[0.5, 0],
				[1, 0],
				[0.5, 1],
				[0, 1]
			];
		}
	}
};
