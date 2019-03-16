import { Maybe } from 'purify-ts/Maybe';

export interface BookmarksState {
	bookmarks: Bookmark[];
	stagedBookmarksGroups: StagedBookmarksGroup[];
	limitNumRendered: boolean;
	focusedBookmarkIndex: Maybe<number>;
	bookmarkEditId: Maybe<Bookmark['id']>;
	bookmarkDeleteId: Maybe<Bookmark['id']>;
	displayAddBookmarkModal: boolean;
	displayEditBookmarkModal: boolean;
	displayDeleteBookmarkModal: boolean;
}

export enum BookmarksActionTypes {
	SetAllBookmarks = 'SET_ALL_BOOKMARKS',
	SetAllStagedBookmarksGroups = 'SET_ALL_STAGED_BOOKMARKS_GROUPS',
	SetLimitNumRendered = 'SET_LIMIT_NUM_RENDERED',
	SetFocusedBookmarkIndex = 'SET_FOCUSED_BOOKMARK_INDEX',
	SetBookmarkEditId = 'SET_BOOKMARK_EDIT_ID',
	SetBookmarkDeleteId = 'SET_BOOKMARK_DELETE_ID',
	SetAddBookmarkModalDisplay = 'SET_ADD_BOOKMARK_MODAL_DISPLAY',
	SetEditBookmarkModalDisplay = 'SET_EDIT_BOOKMARK_MODAL_DISPLAY',
	SetDeleteBookmarkModalDisplay = 'SET_DELETE_BOOKMARK_MODAL_DISPLAY',
}

export type Bookmark = LocalBookmark;
