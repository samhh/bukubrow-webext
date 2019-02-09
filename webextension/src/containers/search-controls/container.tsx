import React from 'react';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { connect } from 'react-redux';
import { requestBookmarks } from 'Comms/frontend';
import { scrollToTop } from 'Modules/scroll-window';
import { AppState } from 'Store';
import { setSearchFilterWithResets } from 'Store/epics';
import { setAddBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { getUnlimitedFilteredBookmarks } from 'Store/selectors';
import SearchControls from './search-controls';
import { setDisplayOpenAllBookmarksConfirmation } from 'Store/user/actions';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const SearchControlsContainer: Comp<Props> = props => (
	<SearchControls
		onAdd={props.openAddModal}
		updateTextFilter={(text) => { props.setSearchFilter(text); scrollToTop(); }}
		openAllVisibleBookmarks={props.openAllFilteredBookmarks}
		refreshBookmarks={requestBookmarks}
		textFilter={props.searchFilter}
		shouldEnableSearch={props.searchEnabled}
		numMatches={props.numFilteredBookmarks}
	/>
);

const mapStateToProps = (state: AppState) => ({
	searchFilter: state.input.searchFilter,
	searchEnabled: NonEmptyList.isNonEmpty(state.bookmarks.bookmarks),
	numFilteredBookmarks: getUnlimitedFilteredBookmarks(state).length,
	displayAdd: state.bookmarks.displayAddBookmarkModal,
});

const mapDispatchToProps = {
	openAddModal: setAddBookmarkModalDisplay.bind(null, true),
	setSearchFilter: setSearchFilterWithResets,
	openAllFilteredBookmarks: setDisplayOpenAllBookmarksConfirmation.bind(null, true),
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchControlsContainer);
