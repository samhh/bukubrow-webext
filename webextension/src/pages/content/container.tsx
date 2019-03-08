import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setLimitNumRendered, setAddBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { openAllFilteredBookmarksAndExit, syncBookmarks } from 'Store/epics';
import { getNumFilteredUnrenderedBookmarks } from 'Store/selectors';
import ContentPage from './content';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const ContentContainer: Comp<Props> = props => (
	<ContentPage
		onEnableLimitlessRender={props.setLimitNumBookmarksRendered.bind(null, false)}
		toggleAddBookmarkForm={props.setAddBookmarkModalDisplay.bind(null, !props.displayAddBookmarkModal)}
		openAllFilteredBookmarksWithoutConfirmation={props.openAllFilteredBookmarks}
		refreshBookmarks={props.syncBookmarks}
		numRemainingBookmarks={props.numRemainingBookmarks}
		displayTutorialMessage={props.displayTutorialMessage}
	/>
);

const mapStateToProps = (state: AppState) => ({
	numRemainingBookmarks: getNumFilteredUnrenderedBookmarks(state),
	displayTutorialMessage: state.user.displayTutorialMessage,
	displayAddBookmarkModal: state.bookmarks.displayAddBookmarkModal,
});

const mapDispatchToProps = {
	syncBookmarks,
	setAddBookmarkModalDisplay,
	openAllFilteredBookmarks: openAllFilteredBookmarksAndExit,
	setLimitNumBookmarksRendered: setLimitNumRendered,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);
