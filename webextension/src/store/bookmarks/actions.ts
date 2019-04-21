import { Maybe } from 'purify-ts/Maybe';
import { action } from 'typesafe-actions';
import { BookmarksActionTypes, Bookmark } from './types';

export const setAllBookmarks = (bookmarks: Bookmark[]) => action(
	BookmarksActionTypes.SetAllBookmarks,
	bookmarks,
);

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

export const setFocusedBookmarkIndex = (index: Maybe<number>) => action(
	BookmarksActionTypes.SetFocusedBookmarkIndex,
	index,
);

export const setBookmarkEditId = (id: Maybe<Bookmark['id']>) => action(
	BookmarksActionTypes.SetBookmarkEditId,
	id,
);

export const setBookmarkDeleteId = (id: Maybe<Bookmark['id']>) => action(
	BookmarksActionTypes.SetBookmarkDeleteId,
	id,
);

export const setStagedBookmarksGroupEditId = (id: Maybe<StagedBookmarksGroup['id']>) => action(
	BookmarksActionTypes.SetStagedBookmarksGroupEditId,
	id,
);

export const setStagedBookmarksGroupBookmarkEditId = (id: Maybe<Bookmark['id']>) => action(
	BookmarksActionTypes.SetStagedBookmarksGroupBookmarkEditId,
	id,
);

export const updateStagedBookmarksGroupBookmark = (grpId: StagedBookmarksGroup['id'], bm: Bookmark) => action(
	BookmarksActionTypes.UpdateStagedBookmarksGroupBookmark,
	[grpId, bm] as [typeof grpId, typeof bm], // TODO as const in 3.4!
);

export const deleteStagedBookmarksGroupBookmark = (grpId: StagedBookmarksGroup['id'], bmId: Bookmark['id']) => action(
	BookmarksActionTypes.DeleteStagedBookmarksGroupBookmark,
	[grpId, bmId] as [typeof grpId, typeof bmId], // TODO as const in 3.4
);

export const setAddBookmarkModalDisplay = (display: boolean) => action(
	BookmarksActionTypes.SetAddBookmarkModalDisplay,
	display,
);

export const setEditBookmarkModalDisplay = (display: boolean) => action(
	BookmarksActionTypes.SetEditBookmarkModalDisplay,
	display,
);

export const setDeleteBookmarkModalDisplay = (display: boolean) => action(
	BookmarksActionTypes.SetDeleteBookmarkModalDisplay,
	display,
);
