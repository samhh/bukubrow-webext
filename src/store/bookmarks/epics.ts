/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as A from 'fp-ts/lib/Array';
import { ThunkAC } from 'Store';
import {
	setAllStagedBookmarksGroups, deleteStagedBookmarksGroup, deleteStagedBookmarksGroupBookmark,
	setBookmarkEditId, setBookmarkDeleteId, setFocusedBookmarkIndex,
	setDeleteBookmarkModalDisplay, setAllBookmarks,
} from 'Store/bookmarks/actions';
import { setPage, setHasBinaryComms } from 'Store/user/actions';
import { addPermanentError } from 'Store/notices/epics';
import { getWeightedLimitedFilteredBookmarks, getUnlimitedFilteredBookmarks } from 'Store/selectors';
import { saveBookmarksToNative, updateBookmarksToNative, deleteBookmarksFromNative, getBookmarksFromNative } from 'Modules/comms/native';
import { getStagedBookmarksGroupsFromLocalStorage, openBookmarkInAppropriateTab } from 'Modules/comms/browser';
import { untransform, transform, LocalBookmark, LocalBookmarkUnsaved } from 'Modules/bookmarks';
import { StagedBookmarksGroup } from 'Modules/staged-groups';
import { Page } from 'Store/user/types';

export const syncBookmarks = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const res = await getBookmarksFromNative();
	const mapped = pipe(res, E.map(A.map(transform)));

	if (E.isRight(mapped)) {
		const bms = mapped.right;

		dispatch(setAllBookmarks(bms));
		dispatch(setFocusedBookmarkIndex(bms.length ? O.some(0) : O.none));
		dispatch(setHasBinaryComms(true));
	} else {
		const msg = 'Failed to sync bookmarks.';

		dispatch(setHasBinaryComms(false));
		dispatch(addPermanentError(msg));
	}
};

export const openBookmarkAndExit = (
	bmId: LocalBookmark['id'],
	stagedBookmarksGroupId: Option<StagedBookmarksGroup['id']> = O.none,
): ThunkAC => async (_, getState) => {
	const { bookmarks: { bookmarks, stagedBookmarksGroups } } = getState();

	const bookmark = O.fold(
		() => A.findFirst((bm: LocalBookmark) => bm.id === bmId)(bookmarks),
		(grpId: StagedBookmarksGroup['id']) => pipe(
			stagedBookmarksGroups,
			A.findFirst(grp => grp.id === grpId),
			O.map(grp => grp.bookmarks),
			O.chain(A.findFirst(bm => bm.id === bmId)),
		),
	)(stagedBookmarksGroupId);

	if (O.isSome(bookmark)) {
		const { url } = bookmark.value;
		await openBookmarkInAppropriateTab(true)(url)();

		window.close();
	}
};

export const openAllFilteredBookmarksAndExit = (): ThunkAC => async (_, getState) => {
	const filteredBookmarks = getUnlimitedFilteredBookmarks(getState());

	await Promise.all(filteredBookmarks.map(({ url }, index) => openBookmarkInAppropriateTab(index === 0)(url)()));

	window.close();
};

export const addAllBookmarksFromStagedGroup = (groupId: StagedBookmarksGroup['id']): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarks: { stagedBookmarksGroups } } = getState();

	const bookmarks = pipe(
		stagedBookmarksGroups,
		A.findFirst(grp => grp.id === groupId),
		// Remove local ID else bookmarks will be detected as saved by
		// untransform overload
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		O.map(grp => grp.bookmarks.map(({ id, ...rest }): LocalBookmarkUnsaved => ({ ...rest }))),
		O.getOrElse(() => [] as Array<LocalBookmarkUnsaved>),
	);

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
	const stagedBookmarksGroups = pipe(
		await getStagedBookmarksGroupsFromLocalStorage(),
		O.fromEither,
		O.flatten,
		O.getOrElse(() => [] as Array<StagedBookmarksGroup>),
	);

	dispatch(setAllStagedBookmarksGroups(stagedBookmarksGroups));
};

export const addBookmark = (bookmark: LocalBookmarkUnsaved): ThunkAC<Promise<void>> => async (dispatch) => {
	await dispatch(addManyBookmarks([bookmark]));
};

export const addManyBookmarks = (bookmarks: Array<LocalBookmarkUnsaved>): ThunkAC<Promise<void>> => async (dispatch) => {
	await saveBookmarksToNative(bookmarks.map(untransform))();
	dispatch(syncBookmarks());

	dispatch(setPage(Page.Search));
};

export const updateBookmark = (bookmark: LocalBookmark): ThunkAC<Promise<void>> => async (dispatch) => {
	await updateBookmarksToNative([untransform(bookmark)])();
	dispatch(syncBookmarks());

	dispatch(setPage(Page.Search));
};

export const deleteBookmark = (): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarkDeleteId } = getState().bookmarks;

	if (O.isSome(bookmarkDeleteId)) {
		const bookmarkId = bookmarkDeleteId.value;

		await deleteBookmarksFromNative([bookmarkId])();
		dispatch(syncBookmarks());
		dispatch(setDeleteBookmarkModalDisplay(false));
	}
};

export const initiateBookmarkEdit = (id: LocalBookmark['id']): ThunkAC => (dispatch) => {
	dispatch(setBookmarkEditId(O.some(id)));
	dispatch(setPage(Page.EditBookmark));
};

export const initiateBookmarkDeletion = (id: LocalBookmark['id']): ThunkAC => (dispatch) => {
	dispatch(setBookmarkDeleteId(O.some(id)));
	dispatch(setDeleteBookmarkModalDisplay(true));
};

export const attemptFocusedBookmarkIndexIncrement = (): ThunkAC<boolean> => (dispatch, getState) => {
	const state = getState();
	const numFilteredBookmarks = getWeightedLimitedFilteredBookmarks(state).length;

	return pipe(
		state.bookmarks.focusedBookmarkIndex,
		O.chain(fbmi => fbmi === numFilteredBookmarks - 1 ? O.none : O.some(fbmi + 1)),
		O.fold(
			() => false,
			(fbmi) => {
				dispatch(setFocusedBookmarkIndex(O.some(fbmi)));

				return true;
			},
		),
	);
};

export const attemptFocusedBookmarkIndexDecrement = (): ThunkAC<boolean> => (dispatch, getState) => {
	const { bookmarks: { focusedBookmarkIndex: focusedBookmarkIndexMaybe } } = getState();

	return pipe(
		focusedBookmarkIndexMaybe,
		O.chain(fbmi => fbmi === 0 ? O.none : O.some(fbmi - 1)),
		O.fold(
			() => false,
			(fbmi) => {
				dispatch(setFocusedBookmarkIndex(O.some(fbmi)));

				return true;
			},
		),
	);
};

