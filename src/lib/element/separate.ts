import { RenderElement } from 'lib/render';
import { Element } from 'lib/element';
import { reduceVectorSize } from 'lib/utils';

interface SepatatingElement {
	totalDistance: number;
	distance2end: number;
	vector: Vector;
	move(v: Vector): void;
}

const baseDistance = 20;
const ratio = 0.04;

export class Sepatater implements RenderElement {
	public static getInstance = () => Sepatater.instance;
	private static instance = new Sepatater();
	public key = Symbol();

	private elements: Map<symbol, SepatatingElement> = new Map();

	public addElement = ({ key, move }: Element, vector: Vector, distance: number = baseDistance) => {
		this.elements.set(key, {
			vector: reduceVectorSize(vector, distance * ratio),
			totalDistance: distance,
			distance2end: distance,
			move,
		});
	}

	public render = () => {
		const { elements } = this;
		elements.forEach((element, key) => {
			const { move, vector, distance2end, totalDistance } = element;
			if (distance2end <= 0) {
				elements.delete(key);
			} else {
				move(vector);
				element.distance2end = distance2end - (totalDistance * ratio);
			}
		})
	}

	public clear = () => this.elements.clear();
}
