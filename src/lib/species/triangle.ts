const sqrt3 = Math.sqrt(3);

export const tP: Path = [
	[0.5, 0],
	[1, 1],
	[0, 1]
];

const t1: Path = [
	[0.5, 0],
	[1, 1],
	[0, 1]
];

const t2: Path = [
	[1, 0],
	[1, 1],
	[0, 1]
];

const t3: Path = [
	[1, 0],
	[1, sqrt3],
	[0, sqrt3]
];

// export const create = (type: Type): Path => {
// 	switch (type) {
// 		case Type.t1: {
// 			return [
// 				[sqrt3 / 2, 0],
// 				[0, 1.5],
// 				[sqrt3, 1.5]
// 			];
// 		}
// 		case Type.t2: {
// 			return [
// 				[sqrt2, 0],
// 				[sqrt2, sqrt2],
// 				[0, sqrt2]
// 			];
// 		}
// 		case Type.t3: {
// 			return [
// 				[1, 0],
// 				[1, sqrt3],
// 				[0, sqrt3]
// 			];
// 		}
// 		case Type.tP: {
// 			return [
// 				[0.5, 0],
// 				[1, 1],
// 				[0, 1]
// 			];
// 		}
// 	}
// }

export const typeArr: Path[] = [t1, t2, t3];
