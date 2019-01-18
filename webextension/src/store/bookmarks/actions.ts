import { action } from 'typesafe-actions';
import { BookmarksActionTypes, Bookmark } from './types';

export const setAllBookmarks = (bookmarks: Bookmark[]) => action(
	BookmarksActionTypes.SetAllBookmarks,
	bookmarks,
);

export const setLimitNumRendered = (limit: boolean) => action(
	BookmarksActionTypes.SetLimitNumRendered,
	limit,
);

export const setFocusedBookmarkIndex = (index: Nullable<number>) => action(
	BookmarksActionTypes.SetFocusedBookmarkIndex,
	index,
);

export const setBookmarkEditId = (id: Nullable<Bookmark['id']>) => action(
	BookmarksActionTypes.SetBookmarkEditId,
	id,
);

export const setBookmarkDeleteId = (id: Nullable<Bookmark['id']>) => action(
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
