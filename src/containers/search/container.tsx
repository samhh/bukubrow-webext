import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setLimitNumRendered } from 'Store/bookmarks/actions';
import { openAllFilteredBookmarksAndExit, syncBookmarks } from 'Store/bookmarks/epics';
import { getNumFilteredUnrenderedBookmarks } from 'Store/selectors';
import Search from './search';
import { setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const SearchContainer: FC<Props> = props => (
	<Search
		onEnableLimitlessRender={props.setLimitNumBookmarksRendered.bind(null, false)}
		onGotoAddBookmarkForm={props.setPage.bind(null, Page.AddBookmark)}
		openAllFilteredBookmarksWithoutConfirmation={props.openAllFilteredBookmarks}
		refreshBookmarks={props.syncBookmarks}
		numRemainingBookmarks={props.numRemainingBookmarks}
	/>
);

const mapStateToProps = (state: AppState) => ({
	numRemainingBookmarks: getNumFilteredUnrenderedBookmarks(state),
});

const mapDispatchToProps = {
	syncBookmarks,
	setPage,
	openAllFilteredBookmarks: openAllFilteredBookmarksAndExit,
	setLimitNumBookmarksRendered: setLimitNumRendered,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
