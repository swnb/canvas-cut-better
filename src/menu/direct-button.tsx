import * as React from 'react';
import * as Styles from './index.module.css';
import Event from 'power-event';

const { iconRight, iconLeft, iconDown } = Styles;
export type Direction = 'right' | 'left' | 'down';

const eC = Event.space('menu');
function useDirection(initState: Direction): [Direction, () => void] {
	const [currentDirection, setDirection] = React.useState(initState);
	React.useEffect(
		() =>
			eC.on('setDirection', (direction: Direction) => {
				setDirection(direction);
			}),
		[currentDirection]
	);

	const onChangeDirection = () => {
		// define next state;
		switch (currentDirection) {
			case 'left': {
				setDirection('right');
				break;
			}
			case 'right': {
				setDirection('left');
				break;
			}
			case 'down': {
				setDirection('right');
				break;
			}
		}
		// button will dispatch state when state is change
		eC.emit('onDirectionChanged', currentDirection);
	};

	return [currentDirection, onChangeDirection];
}

export default React.memo(() => {
	const [direction, onChangeDirection] = useDirection('left');
	let directionStyle: any;
	switch (direction) {
		case 'left':
			directionStyle = iconLeft;
			break;
		case 'right':
			directionStyle = iconRight;
			break;
		case 'down':
			directionStyle = iconDown;
			break;
	}
	return (
		<div className={Styles.button} onClick={onChangeDirection}>
			<div className={directionStyle} />
		</div>
	);
});
