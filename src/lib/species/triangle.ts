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

export const paths: Path[] = [t1, t2, t3];
