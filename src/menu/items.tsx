import * as React from 'react';
import Event from 'power-event';
import { Triangle, Parallelogram, Irregular, path2clipPath } from 'lib/species';
import * as Styles from './items.module.css';
import { Direction } from './direct-button';

type ClickHandler = (
	event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void;

const contactClassName = (...className: any[]) => className.join(' ');

const GraphSpecies = [Triangle, Irregular, Parallelogram];

const eC = Event.space('menu');
const createPath = (path: Path) => () => {
	eC.emit('create-graph', path);
};
const setDirection = (direction: Direction) => {
	eC.emit('setDirection', direction);
};
const Item = ({
	clipPath,
	onClick
}: {
	clipPath: string;
	onClick: ClickHandler;
}) => <div className={Styles.item} style={{ clipPath }} onClick={onClick} />;

const useSpeciesElement = ([]: Path): [
	boolean,
	Path[],
	(path: Path[]) => () => void
] => {
	const [isShow, setIsShow] = React.useState(false);

	React.useEffect(() => {
		return eC.on('onDirectionChanged', (direction: Direction) => {
			if (direction === 'down') {
				setIsShow(false);
			}
		});
	}, [isShow]);

	const [currentSpeciesPaths, setTypeArr] = React.useState([] as Path[]);

	const ShowSpeciesPaths = (speciesPaths: Path[]) => () => {
		setTypeArr(speciesPaths);
		setDirection('down');
		setIsShow(true);
	};

	return [isShow, currentSpeciesPaths, ShowSpeciesPaths];
};

export default React.memo(() => {
	const [isShow, currentSpeciesPaths, ShowSpeciesPaths] = useSpeciesElement([]);

	return (
		<div
			className={contactClassName(
				Styles.container,
				isShow ? Styles.rotate : undefined
			)}
		>
			<div className={Styles.wraper}>
				{GraphSpecies.map(({ paths, tP }, index) => (
					// each item use clipath to show poster
					<Item
						key={index}
						clipPath={path2clipPath(tP)}
						onClick={ShowSpeciesPaths(paths)}
					/>
				))}
			</div>
			<div className={Styles.wraper}>
				{currentSpeciesPaths.map((path, index) => (
					<div
						key={index}
						style={{ clipPath: path2clipPath(path) }}
						onClick={createPath(path)}
					/>
				))}
			</div>
		</div>
	);
});
