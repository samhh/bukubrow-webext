import * as O from 'fp-ts/lib/Option';

export type Bookmark = LocalBookmark;

export interface BookmarksState {
	bookmarks: Bookmark[];
	stagedBookmarksGroups: StagedBookmarksGroup[];
	limitNumRendered: boolean;
	focusedBookmarkIndex: O.Option<number>;
	bookmarkEditId: O.Option<Bookmark['id']>;
	bookmarkDeleteId: O.Option<Bookmark['id']>;
	stagedBookmarksGroupEditId: O.Option<StagedBookmarksGroup['id']>;
	stagedBookmarksGroupBookmarkEditId: O.Option<Bookmark['id']>;
	displayDeleteBookmarkModal: boolean;
}

export enum BookmarksActionTypes {
	AddBookmarks = 'ADD_BOOKMARKS',
	SyncBookmarksRequest = 'SYNC_BOOKMARKS_REQUEST',
	SyncBookmarksSuccess = 'SYNC_BOOKMARKS_SUCCESS',
	SyncBookmarksFailure = 'SYNC_BOOKMARKS_FAILURE',
	OpenBookmarkRequest = 'OPEN_BOOKMARK_REQUEST',
	OpenBookmarkSuccess = 'OPEN_BOOKMARK_SUCCESS',
	OpenBookmarkFailure = 'OPEN_BOOKMARK_FAILURE',
	OpenAllFilteredBookmarks = 'OPEN_ALL_FILTERED_BOOKMARKS',
	AddAllStagedBookmarks = 'ADD_ALL_STAGED_BOOKMARKS',
	DeleteStagedBookmark = 'DELETE_STAGED_BOOKMARK',
	SyncStagedGroups = 'SYNC_STAGED_GROUPS',
	SetAllStagedBookmarksGroups = 'SET_ALL_STAGED_BOOKMARKS_GROUPS',
	DeleteStagedBookmarksGroup = 'DELETE_STAGED_BOOKMARKS_GROUP',
	SetLimitNumRendered = 'SET_LIMIT_NUM_RENDERED',
	SetFocusedBookmarkIndex = 'SET_FOCUSED_BOOKMARK_INDEX',
	SetBookmarkEditId = 'SET_BOOKMARK_EDIT_ID',
	SetBookmarkDeleteId = 'SET_BOOKMARK_DELETE_ID',
	SetStagedBookmarksGroupEditId = 'SET_STAGED_BOOKMARKS_GROUP_EDIT_ID',
	SetStagedBookmarksGroupBookmarkEditId = 'SET_STAGED_BOOKMARKS_GROUP_BOOKMARK_EDIT_ID',
	UpdateStagedBookmarksGroupBookmark = 'UPDATE_STAGED_BOOKMARKS_GROUP_BOOKMARK',
	DeleteStagedBookmarksGroupBookmark = 'DELETE_STAGED_BOOKMARKS_GROUP_BOOKMARK',
	SetDeleteBookmarkModalDisplay = 'SET_DELETE_BOOKMARK_MODAL_DISPLAY',
}
