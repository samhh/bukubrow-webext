import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { openBookmarkAndExit } from 'Store/epics';
import {
	initiateBookmarkEdit, initiateBookmarkDeletion,
	attemptFocusedBookmarkIndexIncrement, attemptFocusedBookmarkIndexDecrement,
} from 'Store/bookmarks/epics';
import { getFilteredBookmarks, getFocusedBookmark } from 'Store/selectors';
import BookmarksList from './bookmarks-list';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarksListContainer: SFC<Props> = props => (
	<BookmarksList
		bookmarks={props.bookmarks}
		focusedBookmarkId={props.focusedBookmark && props.focusedBookmark.id}
		searchFilter={props.searchFilter}
		onOpenBookmark={props.onOpenBookmark}
		onEditBookmark={props.onEditBookmark}
		onDeleteBookmark={props.onDeleteBookmark}
		attemptFocusedBookmarkIndexIncrement={props.attemptFocusedBookmarkIndexIncrement}
		attemptFocusedBookmarkIndexDecrement={props.attemptFocusedBookmarkIndexDecrement}
	/>
);

const mapStateToProps = (state: AppState) => ({
	bookmarks: getFilteredBookmarks(state),
	focusedBookmark: getFocusedBookmark(state),
	searchFilter: state.input.searchFilter,
});

const mapDispatchToProps = ({
	attemptFocusedBookmarkIndexIncrement,
	attemptFocusedBookmarkIndexDecrement,
	onOpenBookmark: openBookmarkAndExit,
	onEditBookmark: initiateBookmarkEdit,
	onDeleteBookmark: initiateBookmarkDeletion,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksListContainer);