import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setLimitNumRendered, setAddBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { openAllFilteredBookmarksAndExit, syncBookmarks } from 'Store/bookmarks/epics';
import { getNumFilteredUnrenderedBookmarks } from 'Store/selectors';
import Search from './search';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const SearchContainer: FC<Props> = props => (
	<Search
		onEnableLimitlessRender={props.setLimitNumBookmarksRendered.bind(null, false)}
		toggleAddBookmarkForm={props.setAddBookmarkModalDisplay.bind(null, !props.displayAddBookmarkModal)}
		openAllFilteredBookmarksWithoutConfirmation={props.openAllFilteredBookmarks}
		refreshBookmarks={props.syncBookmarks}
		numRemainingBookmarks={props.numRemainingBookmarks}
	/>
);

const mapStateToProps = (state: AppState) => ({
	numRemainingBookmarks: getNumFilteredUnrenderedBookmarks(state),
	displayAddBookmarkModal: state.bookmarks.displayAddBookmarkModal,
});

const mapDispatchToProps = {
	syncBookmarks,
	setAddBookmarkModalDisplay,
	openAllFilteredBookmarks: openAllFilteredBookmarksAndExit,
	setLimitNumBookmarksRendered: setLimitNumRendered,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
