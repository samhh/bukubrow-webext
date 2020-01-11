import React, { FC } from 'react';
import { useSelector } from '~/store';
import ErrorPopup from '~/components/error-popup';

const ErrorMessages: FC = () => {
	const errors = useSelector(state => state.notices.errors);
	const errMsgs = Object.values(errors)
		.filter((err): err is string => typeof err === 'string');

	return (
		<>
			{errMsgs.map(err => (
				<ErrorPopup key={err} msg={err} />
			))}
		</>
	);
};

export default ErrorMessages;
