export enum Type {
	t1 = 1,
	t2,
	t3,
	tP
}

export const tP: Path = [
	[0, 0],
	[0.5, 0.5],
	[1, 0],
	[1, 1],
	[0, 1]
]

const t1: Path = [
	[0, 0],
	[0.5, 0.5],
	[1, 0],
	[1, 0.5],
	[0.5, 1],
	[0, 0.5]
];

const t2: Path = [
	[0, 1],
	[0, 0.5],
	[0.5, 0],
	[1, 0.5],
	[1, 1]
];

const t3: Path = [
	[0, 1],
	[0, 0],
	[0.5, 0.5],
	[1, 0],
	[1, 1],
	[0.5, 1.5]
];

export const typeArr: Path[] = [t1, t2, t3];
