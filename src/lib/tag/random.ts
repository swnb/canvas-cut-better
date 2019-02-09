import { random, abVector } from "lib/utils";
import { Element } from 'lib/element';


export const randomMove = (element: Element) => {
	const y = random(50, 500);
	const x = random(0, 1000);
	const v = abVector(element.getCenterPiont(), [x, y])
	element.move(v);
}