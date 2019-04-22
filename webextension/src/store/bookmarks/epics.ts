import { Just, Nothing } from 'purify-ts/Maybe';
import { ThunkActionCreator } from 'Store';
import {
	setAllStagedBookmarksGroups,
	setBookmarkEditId, setBookmarkDeleteId, setFocusedBookmarkIndex,
	setAddBookmarkModalDisplay, setEditBookmarkModalDisplay, setDeleteBookmarkModalDisplay,
} from './actions';
import { getWeightedLimitedFilteredBookmarks } from 'Store/selectors';
import { saveBookmarkToNative, updateBookmarkToNative, deleteBookmarkFromNative } from 'Comms/native';
import { untransform } from 'Modules/bookmarks';
import { syncBookmarks } from 'Store/epics';
import { getStagedBookmarksGroupsFromLocalStorage } from 'Comms/browser';

export const syncStagedBookmarksGroups = (): ThunkActionCreator<Promise<void>> => async (dispatch) => {
	const stagedBookmarksGroups = await getStagedBookmarksGroupsFromLocalStorage().run().then(res => res.orDefault([]));

	dispatch(setAllStagedBookmarksGroups(stagedBookmarksGroups));
};

export const addBookmark = (bookmark: LocalBookmarkUnsaved): ThunkActionCreator<Promise<void>> => async (dispatch) => {
	await saveBookmarkToNative(untransform(bookmark));
	dispatch(syncBookmarks());

	dispatch(setAddBookmarkModalDisplay(false));
};

export const addManyBookmarks = (bookmarks: LocalBookmarkUnsaved[]): ThunkActionCreator<Promise<void>> => async (dispatch) => {
	for (const bookmark of bookmarks) {
		await dispatch(addBookmark(bookmark));
	}
};

export const updateBookmark = (bookmark: LocalBookmark): ThunkActionCreator<Promise<void>> => async (dispatch) => {
	await updateBookmarkToNative(untransform(bookmark));
	dispatch(syncBookmarks());

	dispatch(setEditBookmarkModalDisplay(false));
};

export const deleteBookmark = (): ThunkActionCreator<Promise<void>> => async (dispatch, getState) => {
	const { bookmarkDeleteId } = getState().bookmarks;

	bookmarkDeleteId.ifJust(async (bookmarkId) => {
		await deleteBookmarkFromNative(bookmarkId);
		dispatch(syncBookmarks());

		dispatch(setDeleteBookmarkModalDisplay(false));
	});
};

export const initiateBookmarkEdit = (id: LocalBookmark['id']): ThunkActionCreator => (dispatch) => {
	dispatch(setBookmarkEditId(Just(id)));
	dispatch(setEditBookmarkModalDisplay(true));
};

export const initiateBookmarkDeletion = (id: LocalBookmark['id']): ThunkActionCreator => (dispatch) => {
	dispatch(setBookmarkDeleteId(Just(id)));
	dispatch(setDeleteBookmarkModalDisplay(true));
};

export const attemptFocusedBookmarkIndexIncrement = (): ThunkActionCreator<boolean> => (dispatch, getState) => {
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

export const attemptFocusedBookmarkIndexDecrement = (): ThunkActionCreator<boolean> => (dispatch, getState) => {
	const { bookmarks: { focusedBookmarkIndex: focusedBookmarkIndexMaybe } } = getState();

	return focusedBookmarkIndexMaybe
		.chain(fbmi => fbmi === 0 ? Nothing : Just(fbmi - 1))
		.ifJust((fbmi) => {
			dispatch(setFocusedBookmarkIndex(Just(fbmi)));
		})
		.isJust();
};
