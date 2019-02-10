import * as React from 'react';
// import Event from 'power-event';
import { Triangle, Parallelogram, Irregular, path2clipPath } from 'lib/species';
import * as Styles from './items.module.css';

type ClickHandler = (
	event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void;

const GraphSpecies = {
	Triangle,
	Irregular,
	Parallelogram
};

// const ec = Event.space('menu');
// const dispatch = (methods: any) => () => {
// 	ec.emit('create', methods);
// };

const Item = ({
	clipPath,
	onClick
}: {
	clipPath: string;
	onClick: ClickHandler;
}) => <div className={Styles.item} style={{ clipPath }} onClick={onClick} />;

export default React.memo(() => {
	const [isShowType, setIsShowType] = React.useState(false);

	const toggleShowType = () => {
		setIsShowType(!isShowType);
	};

	return (
		<div
			className={Styles.container}
			style={
				isShowType
					? {
							transform: 'rotateX(90deg)'
					  }
					: undefined
			}
		>
			<div className={Styles.wraper}>
				{Object.values(GraphSpecies).map(({ create, Type: { tP } }, index) => (
					// each item use clipath to show poster
					<Item
						key={index}
						clipPath={path2clipPath(create(tP))}
						onClick={toggleShowType}
					/>
				))}
			</div>
			<div className={Styles.wraper}>
				{Object.values(GraphSpecies).map(({ create, Type: { tP } }, index) => (
					// each item use clipath to show poster
					<Item
						key={index}
						clipPath={path2clipPath(create(tP))}
						onClick={toggleShowType}
					/>
				))}
			</div>
		</div>
	);
});
