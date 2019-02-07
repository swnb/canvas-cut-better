import { baseSize } from "./config";

export enum Type {
	Irregular1 = 1,
	Irregular2,
	Irregular3,
}

export const Irregular = (type: Type): Paths => {
	switch (type) {
		case Type.Irregular1: return [[0, 0], [baseSize, 0], [baseSize, baseSize], [baseSize / 2, baseSize * 3 / 2], [0, baseSize]];
		case Type.Irregular2: return [[0, 0], [baseSize * 2, 0], [baseSize * 3 / 2, baseSize], [baseSize, baseSize * 3 / 2], [baseSize / 2, baseSize]];
		case Type.Irregular3: return [[0, baseSize], [0, 0], [baseSize / 2, baseSize / 2], [baseSize, 0], [baseSize, baseSize], [baseSize / 2, baseSize * 3 / 2]];
	}
}

export const list = [Type.Irregular1, Type.Irregular2];
