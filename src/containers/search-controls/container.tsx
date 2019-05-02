import React, { FC } from 'react';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { connect } from 'react-redux';
import { scrollToTop } from 'Modules/scroll-window';
import { AppState } from 'Store';
import { setSearchFilterWithResets } from 'Store/epics';
import { getUnlimitedFilteredBookmarks } from 'Store/selectors';
import SearchControls from './search-controls';
import { setDisplayOpenAllBookmarksConfirmation, setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const SearchControlsContainer: FC<Props> = props => (
	<SearchControls
		onStagedBookmarks={props.openStagedGroups}
		onAdd={props.setPage.bind(null, Page.AddBookmark)}
		updateTextFilter={(text) => {
			props.setSearchFilter(text);
			scrollToTop();
		}}
		openAllVisibleBookmarks={props.openAllFilteredBookmarks}
		textFilter={props.searchFilter}
		shouldEnableSearch={props.searchEnabled}
		shouldEnableOpenStaged={props.hasBinaryComms && !!props.numStagedItems}
		shouldEnableOpenAll={!!props.numFilteredBookmarks}
		shouldEnableAddBookmark={props.hasBinaryComms}
		numMatches={props.numFilteredBookmarks}
	/>
);

const mapStateToProps = (state: AppState) => ({
	searchFilter: state.input.searchFilter,
	searchEnabled: NonEmptyList.isNonEmpty(state.bookmarks.bookmarks),
	hasBinaryComms: state.user.hasBinaryComms,
	numFilteredBookmarks: getUnlimitedFilteredBookmarks(state).length,
	numStagedItems: state.bookmarks.stagedBookmarksGroups.length,
});

const mapDispatchToProps = {
	setPage,
	setSearchFilter: setSearchFilterWithResets,
	openStagedGroups: setPage.bind(null, Page.StagedGroupsList),
	openAllFilteredBookmarks: setDisplayOpenAllBookmarksConfirmation.bind(null, true),
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchControlsContainer);
