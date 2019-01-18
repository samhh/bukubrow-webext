import React, { SFC } from 'react';
import ErrorPopup from 'Components/error-popup/';

interface Props {
	errors: string[];
}

const ErrorMessages: SFC<Props> = ({ errors }) => (
	<>
		{errors.map(error => (
			<ErrorPopup msg={error} />
		))}
	</>
);

export default ErrorMessages;
