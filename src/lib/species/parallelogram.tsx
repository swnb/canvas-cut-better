import { base, sqrt2 } from './base-var';

export enum Type {
	Parallelogram1 = 1,
	Parallelogram2,
	Parallelogram3
}

export const Parallelogram = (type: Type): Paths => {
	const { size: baseSize } = base;
	switch (type) {
		case Type.Parallelogram1: {
			return [
				[baseSize, 0],
				[baseSize * 2, 0],
				[baseSize, baseSize],
				[0, baseSize]
			];
		}
		case Type.Parallelogram2: {
			return [
				[0, 0],
				[baseSize * sqrt2, 0],
				[baseSize * sqrt2, baseSize * sqrt2],
				[0, baseSize * sqrt2]
			];
		}
		case Type.Parallelogram3: {
			return [
				[0, 0],
				[(baseSize * 2) / 3, 0],
				[(baseSize * 2) / 3, (baseSize * 3) / 2],
				[0, (baseSize * 3) / 2]
			];
		}
	}
};
