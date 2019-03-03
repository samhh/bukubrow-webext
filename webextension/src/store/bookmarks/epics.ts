import { Just, Nothing } from 'purify-ts/Maybe';
import { sendBackendMessage } from 'Comms/frontend';
import { ThunkActionCreator } from 'Store';
import { BookmarksActions } from './reducers';
import {
	setBookmarkEditId, setBookmarkDeleteId, setFocusedBookmarkIndex,
	setAddBookmarkModalDisplay, setEditBookmarkModalDisplay, setDeleteBookmarkModalDisplay,
} from './actions';
import { getWeightedLimitedFilteredBookmarks } from 'Store/selectors';

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

	bookmarkDeleteId.ifJust(async (bookmarkId) => {
		await sendBackendMessage({
			bookmarkId,
			deleteBookmark: true,
		});

		dispatch(setDeleteBookmarkModalDisplay(false));
	});

};

export const initiateBookmarkEdit = (id: LocalBookmark['id']): BookmarksThunkActionCreator => (dispatch) => {
	dispatch(setBookmarkEditId(Just(id)));
	dispatch(setEditBookmarkModalDisplay(true));
};

export const initiateBookmarkDeletion = (id: LocalBookmark['id']): BookmarksThunkActionCreator => (dispatch) => {
	dispatch(setBookmarkDeleteId(Just(id)));
	dispatch(setDeleteBookmarkModalDisplay(true));
};

export const attemptFocusedBookmarkIndexIncrement = (): BookmarksThunkActionCreator<boolean> => (dispatch, getState) => {
	const state = getState();
	const filteredBookmarks = getWeightedLimitedFilteredBookmarks(state);
	const focusedBookmarkIndexMaybe = state.bookmarks.focusedBookmarkIndex;

	return focusedBookmarkIndexMaybe
		.chain(fbmi => fbmi === filteredBookmarks.length - 1 ? Nothing : Just(fbmi + 1))
		.ifJust((fbmi) => {
			dispatch(setFocusedBookmarkIndex(Just(fbmi)));
		})
		.isJust();
};

export const attemptFocusedBookmarkIndexDecrement = (): BookmarksThunkActionCreator<boolean> => (dispatch, getState) => {
	const { bookmarks: { focusedBookmarkIndex: focusedBookmarkIndexMaybe } } = getState();

	return focusedBookmarkIndexMaybe
		.chain(fbmi => fbmi === 0 ? Nothing : Just(fbmi - 1))
		.ifJust((fbmi) => {
			dispatch(setFocusedBookmarkIndex(Just(fbmi)));
		})
		.isJust();
};
