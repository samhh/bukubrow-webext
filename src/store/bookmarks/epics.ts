import { Option, some, none, isSome, fold, map, chain, getOrElse } from 'fp-ts/lib/Option';
import { either, isRight } from 'fp-ts/lib/Either';
import { findFirst } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
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
import { getStagedBookmarksGroupsFromLocalStorage, openBookmarkInAppropriateTab } from 'Comms/browser';
import { untransform, transform } from 'Modules/bookmarks';
import { Page } from 'Store/user/types';

export const syncBookmarks = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const res = await getBookmarksFromNative();
	const mapped = either.map(res, bms => bms.map(transform));

	if (isRight(mapped)) {
		const bms = mapped.right;

		dispatch(setAllBookmarks(bms));
		dispatch(setFocusedBookmarkIndex(bms.length ? some(0) : none));
		dispatch(setHasBinaryComms(true));
	} else {
		const msg = 'Failed to sync bookmarks.';

		dispatch(setHasBinaryComms(false));
		dispatch(addPermanentError(msg));
	}
};

export const openBookmarkAndExit = (
	bmId: LocalBookmark['id'],
	stagedBookmarksGroupId: Option<StagedBookmarksGroup['id']> = none,
): ThunkAC => async (_, getState) => {
	const { bookmarks: { bookmarks, stagedBookmarksGroups } } = getState();

	const bookmark = fold(
		() => findFirst((bm: LocalBookmark) => bm.id === bmId)(bookmarks),
		(grpId: StagedBookmarksGroup['id']) => pipe(
			stagedBookmarksGroups,
			findFirst(grp => grp.id === grpId),
			map(grp => grp.bookmarks),
			chain(findFirst(bm => bm.id === bmId)),
		),
	)(stagedBookmarksGroupId);

	if (isSome(bookmark)) {
		const { url } = bookmark.value;
		await openBookmarkInAppropriateTab(url, true);

		window.close();
	}
};

export const openAllFilteredBookmarksAndExit = (): ThunkAC => async (_, getState) => {
	const filteredBookmarks = getUnlimitedFilteredBookmarks(getState());

	await Promise.all(filteredBookmarks.map(({ url }, index) => openBookmarkInAppropriateTab(url, index === 0)));

	window.close();
};

export const addAllBookmarksFromStagedGroup = (groupId: StagedBookmarksGroup['id']): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarks: { stagedBookmarksGroups } } = getState();

	const bookmarks = pipe(
		stagedBookmarksGroups,
		findFirst(grp => grp.id === groupId),
		// Remove local ID else bookmarks will be detected as saved by
		// untransform overload
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		map(grp => grp.bookmarks.map(({ id, ...rest }): LocalBookmarkUnsaved => ({ ...rest }))),
		getOrElse(() => [] as LocalBookmarkUnsaved[]),
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
		getOrElse(() => [] as StagedBookmarksGroup[]),
	);

	dispatch(setAllStagedBookmarksGroups(stagedBookmarksGroups));
};

export const addBookmark = (bookmark: LocalBookmarkUnsaved): ThunkAC<Promise<void>> => async (dispatch) => {
	await dispatch(addManyBookmarks([bookmark]));
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

	if (isSome(bookmarkDeleteId)) {
		const bookmarkId = bookmarkDeleteId.value;

		await deleteBookmarksFromNative([bookmarkId]);
		dispatch(syncBookmarks());
		dispatch(setDeleteBookmarkModalDisplay(false));
	}
};

export const initiateBookmarkEdit = (id: LocalBookmark['id']): ThunkAC => (dispatch) => {
	dispatch(setBookmarkEditId(some(id)));
	dispatch(setPage(Page.EditBookmark));
};

export const initiateBookmarkDeletion = (id: LocalBookmark['id']): ThunkAC => (dispatch) => {
	dispatch(setBookmarkDeleteId(some(id)));
	dispatch(setDeleteBookmarkModalDisplay(true));
};

export const attemptFocusedBookmarkIndexIncrement = (): ThunkAC<boolean> => (dispatch, getState) => {
	const state = getState();
	const numFilteredBookmarks = getWeightedLimitedFilteredBookmarks(state).length;

	return pipe(
		state.bookmarks.focusedBookmarkIndex,
		chain(fbmi => fbmi === numFilteredBookmarks - 1 ? none : some(fbmi + 1)),
		fold(
			() => false,
			(fbmi) => {
				dispatch(setFocusedBookmarkIndex(some(fbmi)));

				return true;
			},
		),
	);
};

export const attemptFocusedBookmarkIndexDecrement = (): ThunkAC<boolean> => (dispatch, getState) => {
	const { bookmarks: { focusedBookmarkIndex: focusedBookmarkIndexMaybe } } = getState();

	return pipe(
		focusedBookmarkIndexMaybe,
		chain(fbmi => fbmi === 0 ? none : some(fbmi - 1)),
		fold(
			() => false,
			(fbmi) => {
				dispatch(setFocusedBookmarkIndex(some(fbmi)));

				return true;
			},
		),
	);
};

