import React from 'react';
import ErrorPopup from 'Components/error-popup';

interface Props {
	errors: string[];
}

const ErrorMessages: Comp<Props> = ({ errors }) => (
	<>
		{errors.map(error => (
			<ErrorPopup key={error} msg={error} />
		))}
	</>
);

export default ErrorMessages;
