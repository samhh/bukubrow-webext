import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import ErrorMessages from './error-messages';

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps;

const ErrorMessagesContainer: SFC<Props> = ({ errors }) => (
	<ErrorMessages errors={errors} />
);

const mapStateToProps = (state: AppState) => ({
	errors: Object.values(state.notices.errors),
});

export default connect(mapStateToProps)(ErrorMessagesContainer);
