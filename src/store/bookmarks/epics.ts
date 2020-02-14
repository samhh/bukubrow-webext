/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constVoid, constant } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as A from 'fp-ts/lib/Array';
import * as R from 'fp-ts/lib/Record';
import { ThunkAC } from '~/store';
import {
	setAllStagedBookmarksGroups, deleteStagedBookmarksGroup, deleteStagedBookmarksGroupBookmark,
	setBookmarkEditId, setBookmarkDeleteId, setFocusedBookmarkIndex,
	setDeleteBookmarkModalDisplay, setAllBookmarks,
} from '~/store/bookmarks/actions';
import { setPage } from '~/store/user/actions';
import { addPermanentError } from '~/store/notices/epics';
import { getWeightedLimitedFilteredBookmarks, getUnlimitedFilteredBookmarks } from '~/store/selectors';
import { saveBookmarksToNative, updateBookmarksToNative, deleteBookmarksFromNative, getBookmarksFromNative } from '~/modules/comms/native';
import { getStagedBookmarksGroupsFromLocalStorage, openBookmarkInAppropriateTab, executeCodeInActiveTab, closePopup } from '~/modules/comms/browser';
import { untransform, transform, LocalBookmark, LocalBookmarkUnsaved } from '~/modules/bookmarks';
import { StagedBookmarksGroup } from '~/modules/staged-groups';
import { Page } from '~/store/user/types';
import { runTask, seqT } from '~/modules/fp';
import { mkBookmarkletCode } from '~/modules/bookmarklet';
import { values } from '~/modules/record';

export const syncBookmarks = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const res = await getBookmarksFromNative();
	const mapped = pipe(res, E.map(A.map(transform)));

	if (E.isRight(mapped)) {
		const bms = mapped.right;

		dispatch(setAllBookmarks(bms));
		dispatch(setFocusedBookmarkIndex(bms.length ? O.some(0) : O.none));
	} else {
		const msg = 'Failed to sync bookmarks.';

		dispatch(addPermanentError(msg));
	}
};

export const openBookmarkAndExit = (
	bmId: LocalBookmark['id'],
	stagedBookmarksGroupId: Option<StagedBookmarksGroup['id']> = O.none,
): ThunkAC => (_, getState) => {
	const { bookmarks: { bookmarks, stagedBookmarksGroups } } = getState();

	const bookmark = O.fold(
		() => R.lookup(String(bmId), bookmarks),
		(grpId: StagedBookmarksGroup['id']) => pipe(
			stagedBookmarksGroups,
			A.findFirst(grp => grp.id === grpId),
			O.map(grp => grp.bookmarks),
			O.chain(A.findFirst(bm => bm.id === bmId)),
		),
	)(stagedBookmarksGroupId);

	if (O.isSome(bookmark)) {
		const { url } = bookmark.value;
		const action: Task<void> = pipe(
			mkBookmarkletCode(url),
			O.fold(
				() => pipe(openBookmarkInAppropriateTab(true)(url), T.chainIOK(constant(closePopup))),
				flow(executeCodeInActiveTab, T.map(constVoid)),
			),
		);

		runTask(action);
	}
};

export const openAllFilteredBookmarksAndExit = (): ThunkAC => (_, getState) => pipe(
	getUnlimitedFilteredBookmarks(getState()),
	values,
	A.mapWithIndex((i, { url }) => openBookmarkInAppropriateTab(i === 0)(url)),
	seqT,
	T.chainIOK(constant(closePopup)),
	runTask,
);

export const addAllBookmarksFromStagedGroup = (groupId: StagedBookmarksGroup['id']): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarks: { stagedBookmarksGroups } } = getState();

	const bookmarks = pipe(
		stagedBookmarksGroups,
		A.findFirst(grp => grp.id === groupId),
		// Remove local ID else bookmarks will be detected as saved by
		// untransform overload
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		O.map(grp => grp.bookmarks.map(({ id, ...rest }): LocalBookmarkUnsaved => ({ ...rest }))),
		O.getOrElse<Array<LocalBookmarkUnsaved>>(() => []),
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
	await runTask(saveBookmarksToNative(bookmarks.map(untransform)));
	dispatch(syncBookmarks());

	dispatch(setPage(Page.Search));
};

export const updateBookmark = (bookmark: LocalBookmark): ThunkAC<Promise<void>> => async (dispatch) => {
	await runTask(updateBookmarksToNative([untransform(bookmark)]));
	dispatch(syncBookmarks());

	dispatch(setPage(Page.Search));
};

export const deleteBookmark = (): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarkDeleteId } = getState().bookmarks;

	if (O.isSome(bookmarkDeleteId)) {
		const bookmarkId = bookmarkDeleteId.value;

		await runTask(deleteBookmarksFromNative([bookmarkId]));
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

