import { sendBackendMessage } from 'Comms/frontend';
import { ThunkActionCreator } from 'Store';
import { BookmarksActions } from './reducers';
import {
	setBookmarkEditId, setBookmarkDeleteId, setFocusedBookmarkIndex,
	setAddBookmarkModalDisplay, setEditBookmarkModalDisplay, setDeleteBookmarkModalDisplay,
} from './actions';
import { getFilteredBookmarks } from 'Store/selectors';

type BookmarksThunkActionCreator<R = void> = ThunkActionCreator<BookmarksActions, R>;

export const addBookmark = (bookmark: LocalBookmarkUnsaved): BookmarksThunkActionCreator<Promise<void>> => async (dispatch) => {
	await sendBackendMessage({
		bookmark,
		saveBookmark: true,
	});

	dispatch(setAddBookmarkModalDisplay(false));
};

export const updateBookmark = (bookmark: LocalBookmark): BookmarksThunkActionCreator<Promise<void>> => async (dispatch) => {
	await sendBackendMessage({
		bookmark,
		updateBookmark: true,
	});

	dispatch(setEditBookmarkModalDisplay(false));
};

export const deleteBookmark = (): BookmarksThunkActionCreator<Promise<void>> => async (dispatch, getState) => {
	const { bookmarkDeleteId } = getState().bookmarks;

	if (bookmarkDeleteId === null) return;

	await sendBackendMessage({
		deleteBookmark: true,
		bookmarkId: bookmarkDeleteId,
	});

	dispatch(setDeleteBookmarkModalDisplay(false));
};

export const initiateBookmarkEdit = (id: LocalBookmark['id']): BookmarksThunkActionCreator => (dispatch) => {
	dispatch(setBookmarkEditId(id));
	dispatch(setEditBookmarkModalDisplay(true));
};

export const initiateBookmarkDeletion = (id: LocalBookmark['id']): BookmarksThunkActionCreator => (dispatch) => {
	dispatch(setBookmarkDeleteId(id));
	dispatch(setDeleteBookmarkModalDisplay(true));
};

export const attemptFocusedBookmarkIndexIncrement = (): BookmarksThunkActionCreator<boolean> => (dispatch, getState) => {
	const state = getState();
	const filteredBookmarks = getFilteredBookmarks(state);
	const focusedBookmarkIndex = state.bookmarks.focusedBookmarkIndex;

	if (focusedBookmarkIndex === null || focusedBookmarkIndex === filteredBookmarks.length - 1) return false;

	dispatch(setFocusedBookmarkIndex(focusedBookmarkIndex + 1));

	return true;
};

export const attemptFocusedBookmarkIndexDecrement = (): BookmarksThunkActionCreator<boolean> => (dispatch, getState) => {
	const { bookmarks: { focusedBookmarkIndex } } = getState();

	if (focusedBookmarkIndex === null || focusedBookmarkIndex === 0) return false;

	dispatch(setFocusedBookmarkIndex(focusedBookmarkIndex - 1));

	return true;
};
