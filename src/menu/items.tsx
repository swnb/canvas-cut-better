import * as React from 'react';
import { Triangle, Parallelogram, Irregular, path2clipPath } from 'lib/species';
import * as Styles from './items.module.css';

const GraphSpecies = {
	Triangle,
	Irregular,
	Parallelogram
};

export default () => (
	<div className={Styles.container}>
		{Object.values(GraphSpecies).map(({ create, Type: { tP } }, index) => (
			<div
				className={Styles.item}
				key={index}
				style={{ clipPath: path2clipPath(create(tP)) }}
			/>
		))}
	</div>
);
