import { Core } from './base'
import { Color, GraphicsElement } from 'lib/element';
import { abVector, random } from 'lib/utils';

type Range = [number, number];

export class EnhanceCore extends Core {
	private initialElementColor?: Color;
	private initialElementSize: number = 100;
	private isInitialElementRandomPos = false;
	private initialElemenPos: Point = [100, 100];
	private rangeX: Range = [0, 100];
	private rangeY: Range = [0, 100];

	public setInitialElementSize = (size: number) => {
		this.initialElementSize = size;
	}

	public setInitialElementColor = (color: Color) => {
		this.initialElementColor = color;
	}

	public setInitialElementPos = (point: Point) => {
		this.initialElemenPos = point;
	}

	public setInitialElementRandomPos = ([startX, endX]: Range, [startY, endY]: Range) => {
		this.isInitialElementRandomPos = true;
		this.rangeX = [startX, endX];
		this.rangeY = [startY, endY];
	}

	public enhanceCreateElement = (path: Path) => {
		const { initialElemenPos, isInitialElementRandomPos, initialElementSize, initialElementColor } = this;
		const currentPath = path.map(line => line.map(point => point * initialElementSize) as Point);
		const element = this.createElement(currentPath, initialElementColor)(this.key) as GraphicsElement;
		const centerPoint = element.getCenterPiont();
		if (isInitialElementRandomPos) {
			const x = random(...this.rangeX);
			const y = random(...this.rangeY);
			this.createElement(currentPath, initialElementColor)
			const distanceVector = abVector(centerPoint, [x, y]);
			element.move(distanceVector)
		} else {
			const distanceVector = abVector(centerPoint, initialElemenPos);
			element.move(distanceVector)
		}
	}
}
