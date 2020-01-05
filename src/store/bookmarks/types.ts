import { Lens } from 'monocle-ts';
import { LocalBookmark } from '~/modules/bookmarks';
import { StagedBookmarksGroup } from '~/modules/staged-groups';

export interface BookmarksState {
	bookmarks: Array<LocalBookmark>;
	stagedBookmarksGroups: Array<StagedBookmarksGroup>;
	limitNumRendered: boolean;
	focusedBookmarkIndex: Option<number>;
	bookmarkEditId: Option<LocalBookmark['id']>;
	bookmarkDeleteId: Option<LocalBookmark['id']>;
	stagedBookmarksGroupEditId: Option<StagedBookmarksGroup['id']>;
	stagedBookmarksGroupBookmarkEditId: Option<LocalBookmark['id']>;
	displayDeleteBookmarkModal: boolean;
}

export const bookmarks = Lens.fromProp<BookmarksState>()('bookmarks');
export const stagedBookmarksGroups = Lens.fromProp<BookmarksState>()('stagedBookmarksGroups');
export const limitNumRendered = Lens.fromProp<BookmarksState>()('limitNumRendered');
export const focusedBookmarkIndex = Lens.fromProp<BookmarksState>()('focusedBookmarkIndex');
export const bookmarkEditId = Lens.fromProp<BookmarksState>()('bookmarkEditId');
export const bookmarkDeleteId = Lens.fromProp<BookmarksState>()('bookmarkDeleteId');
export const stagedBookmarksGroupEditId = Lens.fromProp<BookmarksState>()('stagedBookmarksGroupEditId');
export const stagedBookmarksGroupBookmarkEditId = Lens.fromProp<BookmarksState>()('stagedBookmarksGroupBookmarkEditId');
export const displayDeleteBookmarkModal = Lens.fromProp<BookmarksState>()('displayDeleteBookmarkModal');

export enum BookmarksActionTypes {
	SetAllBookmarks = 'SET_ALL_BOOKMARKS',
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

