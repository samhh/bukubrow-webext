import React from 'react';
import { connect } from 'react-redux';
import noop from 'Modules/noop';
import { AppState } from 'Store';
import { openBookmarkAndExit } from 'Store/epics';
import {
	initiateBookmarkEdit, initiateBookmarkDeletion,
	attemptFocusedBookmarkIndexIncrement, attemptFocusedBookmarkIndexDecrement,
} from 'Store/bookmarks/epics';
import { getFilteredBookmarks, getFocusedBookmark, getParsedFilter } from 'Store/selectors';
import BookmarksList from './bookmarks-list';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarksListContainer: Comp<Props> = props => (
	<BookmarksList
		bookmarks={props.bookmarks}
		focusedBookmarkId={props.focusedBookmark.map(fb => fb.id)}
		parsedFilter={props.parsedFilter}
		onOpenBookmark={props.onOpenBookmark}
		onEditBookmark={props.onEditBookmark}
		onDeleteBookmark={props.onDeleteBookmark}
		openFocusedBookmark={props.focusedBookmark.mapOrDefault(fb => props.onOpenBookmark.bind(null, fb.id), noop)}
		attemptFocusedBookmarkIndexIncrement={props.attemptFocusedBookmarkIndexIncrement}
		attemptFocusedBookmarkIndexDecrement={props.attemptFocusedBookmarkIndexDecrement}
	/>
);

const mapStateToProps = (state: AppState) => ({
	bookmarks: getFilteredBookmarks(state),
	focusedBookmark: getFocusedBookmark(state),
	parsedFilter: getParsedFilter(state),
});

const mapDispatchToProps = ({
	attemptFocusedBookmarkIndexIncrement,
	attemptFocusedBookmarkIndexDecrement,
	onOpenBookmark: openBookmarkAndExit,
	onEditBookmark: initiateBookmarkEdit,
	onDeleteBookmark: initiateBookmarkDeletion,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksListContainer);
