import * as React from 'react';
import { Triangle, Parallelogram, Irregular } from 'lib/species';
import { path2clipPath } from 'lib/species/parse';

const GraphSpecies = {
	Triangle,
	Irregular,
	Parallelogram
};

export default () => {
	return (
		<>
			{Object.values(GraphSpecies).map(({ create, Type: { tP } }, index) => {
				return <div key={index}>{path2clipPath(create(tP))}</div>;
			})}
		</>
	);
};
