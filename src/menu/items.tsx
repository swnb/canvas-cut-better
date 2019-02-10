import * as React from 'react';
import Event from 'power-event';
import { Triangle, Parallelogram, Irregular, path2clipPath } from 'lib/species';
import * as Styles from './items.module.css';

type ClickHandler = (
	event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void;

const contactClassName = (...className: any[]) => className.join(' ');

const GraphSpecies = [Triangle, Irregular, Parallelogram];

const ec = Event.space('menu');
const dispatch = (path: Path) => () => {
	ec.emit('create-graph', path);
};

const Item = ({
	clipPath,
	onClick
}: {
	clipPath: string;
	onClick: ClickHandler;
}) => <div className={Styles.item} style={{ clipPath }} onClick={onClick} />;

export default React.memo(() => {
	const [isShowType, setIsShowType] = React.useState(false);

	const [typeArr, setTypeArr] = React.useState([] as Path[]);

	const toggleShowType = (pathArr: Path[]) => () => {
		setTypeArr(pathArr);
		setIsShowType(!isShowType);
	};

	return (
		<div
			className={contactClassName(
				Styles.container,
				isShowType ? Styles.rotate : undefined
			)}
		>
			<div className={Styles.wraper}>
				{GraphSpecies.map(({ typeArr: arr, tP }, index) => (
					// each item use clipath to show poster
					<Item
						key={index}
						clipPath={path2clipPath(tP)}
						onClick={toggleShowType(arr)}
					/>
				))}
			</div>
			<div className={Styles.wraper}>
				{typeArr.map((path, index) => (
					<div
						key={index}
						style={{ clipPath: path2clipPath(path) }}
						onClick={dispatch(path)}
					/>
				))}
			</div>
		</div>
	);
});
