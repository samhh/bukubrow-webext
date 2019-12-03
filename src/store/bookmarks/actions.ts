import * as O from 'fp-ts/lib/Option';
import { action, createAsyncAction } from 'typesafe-actions';
import { BookmarksActionTypes, Bookmark } from './types';

type URL = string;

export const addBookmarks = (xs: LocalBookmarkUnsaved | Array<LocalBookmarkUnsaved>) => action(
	BookmarksActionTypes.AddBookmarks,
	xs,
);

export const syncBookmarks = createAsyncAction(
	BookmarksActionTypes.SyncBookmarksRequest,
	BookmarksActionTypes.SyncBookmarksSuccess,
	BookmarksActionTypes.SyncBookmarksFailure,
)<void, Array<Bookmark>, void>();

export const openBookmark = createAsyncAction(
	BookmarksActionTypes.OpenBookmarkRequest,
	BookmarksActionTypes.OpenBookmarkSuccess,
	BookmarksActionTypes.OpenBookmarkFailure,
)<{ bookmarkId: Bookmark['id']; stagedBookmarksGroupId: O.Option<StagedBookmarksGroup['id']> }, URL, void>();

export const openAllFilteredBookmarks = () => action(BookmarksActionTypes.OpenAllFilteredBookmarks);

export const addAllStagedBookmarks = (x: StagedBookmarksGroup['id']) => action(
	BookmarksActionTypes.AddAllStagedBookmarks,
	x,
);

export const deleteStagedBookmark = (groupId: StagedBookmarksGroup['id'], bookmarkId: Bookmark['id']) => action(
	BookmarksActionTypes.DeleteStagedBookmark,
	{ groupId, bookmarkId },
);

export const syncStagedGroups = () => action(BookmarksActionTypes.SyncStagedGroups);

export const setAllStagedBookmarksGroups = (groups: StagedBookmarksGroup[]) => action(
	BookmarksActionTypes.SetAllStagedBookmarksGroups,
	groups,
);

export const deleteStagedBookmarksGroup = (groupId: StagedBookmarksGroup['id']) => action(
	BookmarksActionTypes.DeleteStagedBookmarksGroup,
	groupId,
);

export const setLimitNumRendered = (limit: boolean) => action(
	BookmarksActionTypes.SetLimitNumRendered,
	limit,
);

export const setFocusedBookmarkIndex = (index: O.Option<number>) => action(
	BookmarksActionTypes.SetFocusedBookmarkIndex,
	index,
);

export const setBookmarkEditId = (id: O.Option<Bookmark['id']>) => action(
	BookmarksActionTypes.SetBookmarkEditId,
	id,
);

export const setBookmarkDeleteId = (id: O.Option<Bookmark['id']>) => action(
	BookmarksActionTypes.SetBookmarkDeleteId,
	id,
);

export const setStagedBookmarksGroupEditId = (id: O.Option<StagedBookmarksGroup['id']>) => action(
	BookmarksActionTypes.SetStagedBookmarksGroupEditId,
	id,
);

export const setStagedBookmarksGroupBookmarkEditId = (id: O.Option<Bookmark['id']>) => action(
	BookmarksActionTypes.SetStagedBookmarksGroupBookmarkEditId,
	id,
);

export const updateStagedBookmarksGroupBookmark = (grpId: StagedBookmarksGroup['id'], bm: Bookmark) => action(
	BookmarksActionTypes.UpdateStagedBookmarksGroupBookmark,
	[grpId, bm] as const,
);

export const deleteStagedBookmarksGroupBookmark = (grpId: StagedBookmarksGroup['id'], bmId: Bookmark['id']) => action(
	BookmarksActionTypes.DeleteStagedBookmarksGroupBookmark,
	[grpId, bmId] as const,
);

export const setDeleteBookmarkModalDisplay = (display: boolean) => action(
	BookmarksActionTypes.SetDeleteBookmarkModalDisplay,
	display,
);
