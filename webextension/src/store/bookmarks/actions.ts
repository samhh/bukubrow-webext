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
