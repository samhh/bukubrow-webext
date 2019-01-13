import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { requestBookmarks } from 'Comms/frontend';
import { scrollToTop } from 'Modules/scroll-window';
import { AppState } from 'Store';
import { openFocusedBookmarkAndExit, openAllFilteredBookmarksAndExit, setSearchFilterWithResets } from 'Store/epics';
import { setAddBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { getFilteredBookmarks } from 'Store/selectors';
import SearchControls from './search-controls';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const SearchControlsContainer: SFC<Props> = props => (
	<SearchControls
		onAdd={() => { props.setAddBookmarkModalDisplay(true); }}
		updateTextFilter={(text) => { props.setSearchFilter(text); scrollToTop(); }}
		triggerBookmarkOpen={props.openFocusedBookmark}
		openAllVisibleBookmarks={props.openAllFilteredBookmarks}
		refreshBookmarks={requestBookmarks}
		textFilter={props.searchFilter}
		shouldEnableSearch={props.searchEnabled}
		numMatches={props.numFilteredBookmarks}
	/>
);

const mapStateToProps = (state: AppState) => ({
	searchFilter: state.input.searchFilter,
	searchEnabled: !!state.bookmarks.bookmarks.length,
	numFilteredBookmarks: getFilteredBookmarks(state).length,
	displayAdd: state.bookmarks.displayAddBookmarkModal,
});

const mapDispatchToProps = {
	setAddBookmarkModalDisplay,
	setSearchFilter: setSearchFilterWithResets,
	openFocusedBookmark: openFocusedBookmarkAndExit,
	openAllFilteredBookmarks: openAllFilteredBookmarksAndExit,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchControlsContainer);
