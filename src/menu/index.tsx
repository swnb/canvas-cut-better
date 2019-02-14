import * as React from 'react';
import * as Styles from './index.module.css';
import Items from './items';
import DirectIcon, { Direction } from './direct-button';
import Event from 'power-event';

const eC = Event.space('menu');
function useShow(initState: boolean) {
	const [isShow, setIsShow] = React.useState(initState);
	React.useEffect(() => {
		// Diawer will hidden when direction is change;
		return eC.on('onDirectionChanged', (direction: Direction) => {
			switch (direction) {
				case 'right': {
					setIsShow(false);
					break;
				}
				case 'down':
				case 'left': {
					setIsShow(true);
					break;
				}
			}
		});
	}, [isShow]);
	return isShow;
}

export const Menu = () => {
	const isShow = useShow(false);

	return (
		<div
			className={Styles.welt}
			style={{
				right: isShow ? '0' : ''
			}}
		>
			<DirectIcon />
			<div className={Styles.menu}>{<Items />}</div>
		</div>
	);
};
