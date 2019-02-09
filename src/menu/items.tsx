import * as React from 'react';
// import * as GraphSpecies from 'lib/species';
import { Triangle, Parallelogram, Irregular } from 'lib/species';

const GraphSpecies = {
	Triangle,
	Irregular,
	Parallelogram
};

export default () => {
	return (
		<>
			{Object.values(GraphSpecies).map(({ create }, index) => {
				return <div key={index} />;
			})}
		</>
	);
};
