import { base } from "./base-var";
import { affineTransformation } from 'lib/utils';

export enum Type {
	Circle1 = 1,
	Circle2,
}

const n = 100;
export const Circle = (type: Type): Paths => {
	const { size: baseSize } = base;
	const paths: Paths = [[200, -baseSize / 2]];
	const deg = 2 * Math.PI / n;
	for (let i = 1; i < 99; i++) {
		paths[i] = affineTransformation(Math.cos(deg), Math.sin(deg), paths[i - 1], [200, 200]);
	}
	return paths;
}
