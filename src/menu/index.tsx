import * as React from 'react';
import * as Styles from './index.module.css';
import Items from './items';

const { useState } = React;

function useToggleShow(initState: boolean): [boolean, () => void] {
	const [isShow, setIsShow] = useState(initState);

	return [
		isShow,
		() => {
			setIsShow(!isShow);
		}
	];
}

export const Menu = () => {
	const [isSiderDrawerShow, toggleShow] = useToggleShow(false);

	return (
		<div
			className={Styles.welt}
			style={{
				right: isSiderDrawerShow ? '0' : ''
			}}
		>
			<div className={Styles.button} onClick={toggleShow}>
				<div
					className={isSiderDrawerShow ? Styles.iconShow : Styles.iconHide}
				/>
			</div>
			<div className={Styles.menu}>{<Items />}</div>
		</div>
	);
};
