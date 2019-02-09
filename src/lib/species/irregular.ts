import { base } from "./base-var";

export enum Type {
	t1 = 1,
	t2,
	t3,
}

export const create = (type: Type, baseSize = base.size): Paths => {
	switch (type) {
		case Type.t1: {
			return [
				[0, 0],
				[baseSize, 0],
				[baseSize, baseSize],
				[baseSize / 2, baseSize * 3 / 2],
				[0, baseSize]
			];
		}
		case Type.t2: {
			return [
				[0, 0],
				[baseSize * 2, 0],
				[baseSize * 3 / 2, baseSize],
				[baseSize, baseSize * 3 / 2],
				[baseSize / 2, baseSize]
			];
		}
		case Type.t3: {
			return [
				[0, baseSize],
				[0, 0],
				[baseSize / 2, baseSize / 2],
				[baseSize, 0],
				[baseSize, baseSize],
				[baseSize / 2, baseSize * 3 / 2]
			];
		}
	}
}
