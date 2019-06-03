import { browser } from 'webextension-polyfill-ts';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { ThunkAC } from 'Store';
import {
	setAllStagedBookmarksGroups, deleteStagedBookmarksGroup, deleteStagedBookmarksGroupBookmark,
	setBookmarkEditId, setBookmarkDeleteId, setFocusedBookmarkIndex,
	setDeleteBookmarkModalDisplay, setAllBookmarks,
} from 'Store/bookmarks/actions';
import { setPage, setHasBinaryComms } from 'Store/user/actions';
import { addPermanentError } from 'Store/notices/epics';
import { getWeightedLimitedFilteredBookmarks, getUnlimitedFilteredBookmarks } from 'Store/selectors';
import { saveBookmarksToNative, updateBookmarksToNative, deleteBookmarksFromNative, getBookmarksFromNative } from 'Comms/native';
import { getStagedBookmarksGroupsFromLocalStorage } from 'Comms/browser';
import { untransform, transform } from 'Modules/bookmarks';
import { Page } from 'Store/user/types';

export const syncBookmarks = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const res = await getBookmarksFromNative();

	Maybe.fromNullable((res && res.success && res.bookmarks) || null)
		.map(bms => bms.map(transform))
		.caseOf({
			Just: (bms) => {
				dispatch(setAllBookmarks(bms));
				dispatch(setFocusedBookmarkIndex(NonEmptyList.isNonEmpty(bms) ? Just(0) : Nothing));
				dispatch(setHasBinaryComms(true));
			},
			Nothing: () => {
				const msg = 'Failed to sync bookmarks.';

				dispatch(setHasBinaryComms(false));
				dispatch(addPermanentError(msg));
			},
		});
};

export const openBookmarkAndExit = (
	bmId: LocalBookmark['id'],
	stagedBookmarksGroupId: Maybe<StagedBookmarksGroup['id']> = Nothing,
): ThunkAC => (_, getState) => {
	const { bookmarks: { bookmarks, stagedBookmarksGroups } } = getState();

	stagedBookmarksGroupId
		.caseOf({
			Just: grpId => Maybe.fromNullable(stagedBookmarksGroups.find(grp => grp.id === grpId))
				.chain(grp => Maybe.fromNullable(grp.bookmarks.find(bm => bm.id === bmId))),
			Nothing: () => Maybe.fromNullable(bookmarks.find(bm => bm.id === bmId)),
		})
		.ifJust((bookmark) => {
			browser.tabs.create({ url: bookmark.url });

			window.close();
		});
};

export const openAllFilteredBookmarksAndExit = (): ThunkAC => (_, getState) => {
	const filteredBookmarks = getUnlimitedFilteredBookmarks(getState());

	for (const { url } of filteredBookmarks) {
		browser.tabs.create({ url });
	}

	window.close();
};

export const addAllBookmarksFromStagedGroup = (groupId: StagedBookmarksGroup['id']): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarks: { stagedBookmarksGroups } } = getState();

	const bookmarks = Maybe.fromNullable(stagedBookmarksGroups.find(grp => grp.id === groupId))
		// Remove local ID else bookmarks will be detected as saved by
		// untransform overload
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.map(grp => grp.bookmarks.map(({ id, ...rest }): LocalBookmarkUnsaved => ({ ...rest })))
		.orDefault([]);

	await dispatch(addManyBookmarks(bookmarks));
	dispatch(deleteStagedBookmarksGroup(groupId));
};

export const deleteStagedBookmarksGroupBookmarkOrEntireGroup = (
	grpId: StagedBookmarksGroup['id'],
	bmId: LocalBookmark['id'],
): ThunkAC => (dispatch, getState) => {
	const { bookmarks: { stagedBookmarksGroups } } = getState();

	const grp = stagedBookmarksGroups.find(g => g.id === grpId);
	if (!grp) return;

	if (grp.bookmarks.length === 1) {
		// If deleting last bookmark in group, delete entire group and return to
		// groups list
		dispatch(deleteStagedBookmarksGroup(grpId));
		dispatch(setPage(Page.StagedGroupsList));
	} else {
		// Else delete the bookmark leaving group intact
		dispatch(deleteStagedBookmarksGroupBookmark(grpId, bmId));
	}
};

export const syncStagedBookmarksGroups = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const stagedBookmarksGroups = await getStagedBookmarksGroupsFromLocalStorage().run();

	dispatch(setAllStagedBookmarksGroups(stagedBookmarksGroups.orDefault([])));
};

export const addBookmark = (bookmark: LocalBookmarkUnsaved): ThunkAC<Promise<void>> => async (dispatch) => {
	dispatch(addManyBookmarks([bookmark]));
};

export const addManyBookmarks = (bookmarks: LocalBookmarkUnsaved[]): ThunkAC<Promise<void>> => async (dispatch) => {
	await saveBookmarksToNative(bookmarks.map(untransform));
	dispatch(syncBookmarks());

	dispatch(setPage(Page.Search));
};

export const updateBookmark = (bookmark: LocalBookmark): ThunkAC<Promise<void>> => async (dispatch) => {
	await updateBookmarksToNative([untransform(bookmark)]);
	dispatch(syncBookmarks());

	dispatch(setPage(Page.Search));
};

export const deleteBookmark = (): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarkDeleteId } = getState().bookmarks;

	bookmarkDeleteId.ifJust(async (bookmarkId) => {
		await deleteBookmarksFromNative([bookmarkId]);
		dispatch(syncBookmarks());

		dispatch(setDeleteBookmarkModalDisplay(false));
	});
};

export const initiateBookmarkEdit = (id: LocalBookmark['id']): ThunkAC => (dispatch) => {
	dispatch(setBookmarkEditId(Just(id)));
	dispatch(setPage(Page.EditBookmark));
};

export const initiateBookmarkDeletion = (id: LocalBookmark['id']): ThunkAC => (dispatch) => {
	dispatch(setBookmarkDeleteId(Just(id)));
	dispatch(setDeleteBookmarkModalDisplay(true));
};

export const attemptFocusedBookmarkIndexIncrement = (): ThunkAC<boolean> => (dispatch, getState) => {
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

export const attemptFocusedBookmarkIndexDecrement = (): ThunkAC<boolean> => (dispatch, getState) => {
	const { bookmarks: { focusedBookmarkIndex: focusedBookmarkIndexMaybe } } = getState();

	return focusedBookmarkIndexMaybe
		.chain(fbmi => fbmi === 0 ? Nothing : Just(fbmi - 1))
		.ifJust((fbmi) => {
			dispatch(setFocusedBookmarkIndex(Just(fbmi)));
		})
		.isJust();
};
