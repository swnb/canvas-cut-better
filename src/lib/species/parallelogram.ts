export const tP: Path = [
	[0.5, 0],
	[1, 0],
	[0.5, 1],
	[0, 1]
];

const t1: Path = [
	[0, 1],
	[0.5, 0],
	[1, 0],
	[0.5, 1]
];

const t2: Path = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1]
];

const t3: Path = [
	[0, 0],
	[2 / 3, 0],
	[2 / 3, 1.5],
	[0, 1.5]
];

// export const create = (type: Type): Path => {
// 	switch (type) {
// 		case Type.t1: {
// 			return [
// 				[1, 0],
// 				[2, 0],
// 				[1, 1],
// 				[0, 1]
// 			];
// 		}
// 		case Type.t2: {
// 			return [
// 				[0, 0],
// 				[sqrt2, 0],
// 				[sqrt2, sqrt2],
// 				[0, sqrt2]
// 			];
// 		}
// 		case Type.t3: {
// 			return [
// 				[0, 0],
// 				[2 / 3, 0],
// 				[2 / 3, 3 / 2],
// 				[0, 3 / 2]
// 			];
// 		}
// 		case Type.tP: {
// 			return [
// 				[0.5, 0],
// 				[1, 0],
// 				[0.5, 1],
// 				[0, 1]
// 			];
// 		}
// 	}
// };


export const typeArr: Path[] = [t1, t2, t3];
