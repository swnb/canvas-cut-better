import { Render } from './render';
import { Sepatater } from './element';
import { Rotater } from './rotater';
import { Wire } from './wire';
import { Cutter } from './cutter';
import { EnhanceCore } from './core'

export const attachCanvas = (canvas: HTMLCanvasElement) => {
	const context = canvas.getContext('2d')
	if (!context) throw Error(`can't get context from html dom canvas => ${canvas}`);
	// render
	const render = Render.getInstance();
	// clear every render
	render.unshift(() => { context.clearRect(0, 0, canvas.width, canvas.height); });
	// rotater
	const rotater = new Rotater(context);
	render.push(rotater.render);
	// wire
	const wire = new Wire(context);
	render.push(wire.render);
	// sepatater
	const sepatater = Sepatater.getInstance();
	render.push(sepatater.render);
	// cutter 
	const cutter = new Cutter();
	return new EnhanceCore(context, render, rotater, wire, cutter, sepatater);
}

export { EnhanceCore };
