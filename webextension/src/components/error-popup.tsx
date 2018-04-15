import React, { SFC } from 'react';
import cn from 'classnames';

interface Props {
	msg: string;
}

const ErrorPopup: SFC<Props> = ({ msg }) => {
	const classes = cn('error-popup', { 'error-popup--visible': !!msg });

	return (
		<div className={classes}>
			{msg}
		</div>
	);
};

export default ErrorPopup;
