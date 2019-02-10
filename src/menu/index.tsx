import * as React from 'react';
import * as Styles from './index.module.css';
import Items from './items';

const { useState } = React;

function useShow(initState: boolean): [boolean, () => void] {
	const [isShow, setIsShow] = useState(initState);

	return [
		isShow,
		() => {
			setIsShow(!isShow);
		}
	];
}

export const Menu = () => {
	const [isShow, toggleShow] = useShow(false);

	return (
		<div
			className={Styles.welt}
			style={{
				right: isShow ? '0' : ''
			}}
		>
			<div className={Styles.button} onClick={toggleShow}>
				<div className={isShow ? Styles.iconShow : Styles.iconHide} />
			</div>
			<div className={Styles.menu}>{<Items />}</div>
		</div>
	);
};
