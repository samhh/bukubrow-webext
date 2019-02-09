import React from 'react';
import cn from 'classnames';
import styles from './error-popup.css';

interface Props {
	msg: string;
}

const ErrorPopup: Comp<Props> = ({ msg }) => {
	const classes = cn(styles.wrapper, { [styles['wrapper--visible']]: !!msg });

	return (
		<div className={classes}>
			{msg}
		</div>
	);
};

export default ErrorPopup;
