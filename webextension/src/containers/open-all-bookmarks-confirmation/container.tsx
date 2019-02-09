import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setDisplayOpenAllBookmarksConfirmation } from 'Store/user/actions';
import { openAllFilteredBookmarksAndExit } from 'Store/epics';
import { getUnlimitedFilteredBookmarks } from 'Store/selectors';
import OpenAllBookmarksConfirmation from './open-all-bookmarks-confirmation';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const OpenAllBookmarksConfirmationContainer: Comp<Props> = props => (
	<OpenAllBookmarksConfirmation
		numToOpen={props.numFilteredBookmarks}
		display={props.displayOpenAllBookmarksConfirmation}
		onCancel={props.hideConfirmation}
		onConfirm={props.confirmAndOpen}
	/>
);

const mapStateToProps = (state: AppState) => ({
	displayOpenAllBookmarksConfirmation: state.user.displayOpenAllBookmarksConfirmation,
	numFilteredBookmarks: getUnlimitedFilteredBookmarks(state).length,
});

const mapDispatchToProps = ({
	hideConfirmation: setDisplayOpenAllBookmarksConfirmation.bind(null, false),
	confirmAndOpen: openAllFilteredBookmarksAndExit,
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenAllBookmarksConfirmationContainer);
