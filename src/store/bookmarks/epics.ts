import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as A from 'fp-ts/lib/Array';
import { asArray } from 'Modules/array';
import { ofType, fromTask, filterRight, tap_ } from 'Modules/rx';
import { from, of, concat } from 'rxjs';
import * as Rx from 'rxjs/operators';
import { Epic, ThunkAC } from 'Store';
import { combineEpics } from 'redux-observable';
import { BookmarksActionTypes } from 'Store/bookmarks/types';
import {
	setAllStagedBookmarksGroups, deleteStagedBookmarksGroup, deleteStagedBookmarksGroupBookmark,
	setBookmarkEditId, setBookmarkDeleteId, setFocusedBookmarkIndex, addBookmarks,
	setDeleteBookmarkModalDisplay, syncBookmarks, openBookmark,
} from 'Store/bookmarks/actions';
import { setPage, setHasBinaryComms } from 'Store/user/actions';
import { requestPermanentError } from 'Store/notices/actions';
import { getWeightedLimitedFilteredBookmarks, getUnlimitedFilteredBookmarks } from 'Store/selectors';
import { saveBookmarksToNative, updateBookmarksToNative, deleteBookmarksFromNative, getBookmarksFromNative } from 'Comms/native';
import { getStagedBookmarksGroupsFromLocalStorage, openBookmarkInAppropriateTab } from 'Comms/browser';
import { untransform, transform } from 'Modules/bookmarks';
import { Page } from 'Store/user/types';

const getSyncBookmarksActions = pipe(
	getBookmarksFromNative,
	TE.map(flow(
		A.map(transform),
		(xs) => [
			syncBookmarks.success(xs),
			setFocusedBookmarkIndex(xs.length ? O.some(0) : O.none),
			setHasBinaryComms(true),
		],
	)),
);

const syncBookmarksAttemptEpic: Epic = (a$) => a$.pipe(
	ofType(BookmarksActionTypes.SyncBookmarksRequest),
	Rx.switchMap(() => fromTask(getSyncBookmarksActions).pipe(
		filterRight,
		Rx.switchMap(from)
	)),
);

const syncBookmarksFailedEpic: Epic = (a$) => a$.pipe(
	ofType(BookmarksActionTypes.SyncBookmarksFailure),
	Rx.switchMap(() => [
		setHasBinaryComms(false),
		requestPermanentError('Failed to sync bookmarks'),
	]),
);

const filterMapBmById = <K extends keyof LocalBookmark>(k: K) => (id: LocalBookmark['id']) =>
	(x: LocalBookmark): O.Option<LocalBookmark[K]> => id === x.id
		? O.some(x[k])
		: O.none;

const openBookmarkAttemptEpic: Epic = (a$, s$) => a$.pipe(
	ofType(BookmarksActionTypes.OpenBookmarkRequest),
	Rx.map(({ payload }) => {
		const filterMapBmUrl = filterMapBmById('url')(payload.bookmarkId);

		return pipe(
			payload.stagedBookmarksGroupId,
			O.fold(
				() => pipe(
					s$.value.bookmarks.bookmarks,
					A.findFirstMap(filterMapBmUrl),
				),
				(grpId) => pipe(
					s$.value.bookmarks.stagedBookmarksGroups,
					A.findFirstMap(grp => grp.id === grpId ? O.some(grp.bookmarks) : O.none),
					O.chain(A.findFirstMap(filterMapBmUrl)),
				),
			),
			O.fold<string, ReturnType<typeof openBookmark.failure | typeof openBookmark.success>>(
				() => openBookmark.failure(),
				(url) => openBookmark.success(url),
			),
		);
	}),
);

const openBookmarkSuccessEpic: Epic = (a$) => a$.pipe(
	ofType(BookmarksActionTypes.OpenBookmarkSuccess),
	tap_(({ payload }) => {
		openBookmarkInAppropriateTab(payload, true)().then(window.close);
	}),
);

const openAllFilteredBookmarksEpic: Epic = (a$, s$) => a$.pipe(
	ofType(BookmarksActionTypes.OpenAllFilteredBookmarks),
	tap_(() => {
		const xs = pipe(
			getUnlimitedFilteredBookmarks(s$.value),
			A.mapWithIndex((i, { url }) => openBookmarkInAppropriateTab(url, i === 0)),
		);

		Promise.all(xs).then(window.close);
	}),
);

const addAllStagedBookmarksEpic: Epic = (a$, s$) => a$.pipe(
	ofType(BookmarksActionTypes.AddAllStagedBookmarks),
	Rx.switchMap(({ payload }) => pipe(
		s$.value.bookmarks.stagedBookmarksGroups,
		A.findFirst(grp => grp.id === payload),
		O.fold(
			() => [],
			// Remove local ID else bookmarks will be detected as saved by
			// untransform overload
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			(grp) => grp.bookmarks.map(({ id, ...rest }): LocalBookmarkUnsaved => ({ ...rest })),
		),
		(xs) => [
			addBookmarks(xs),
			deleteStagedBookmarksGroup(payload),
		],
	)),
);

const deleteStagedBookmarkEpic: Epic = (a$, s$) => a$.pipe(
	ofType(BookmarksActionTypes.DeleteStagedBookmark),
	Rx.switchMap(({ payload: { groupId, bookmarkId } }) => pipe(
		s$.value.bookmarks.stagedBookmarksGroups,
		A.findFirst(g => g.id === groupId),
		O.fold(
			() => [],
			// If deleting last bookmark in group, delete entire group and return to
			// groups list, else delete the bookmark leaving group intact
			(g) => g.bookmarks.length === 1
				? [
					deleteStagedBookmarksGroup(groupId),
					setPage(Page.StagedGroupsList),
				]
				: [
					deleteStagedBookmarksGroupBookmark(groupId, bookmarkId),
				],
		),
	)),
);

const syncStagedGroupsEpic: Epic = (a$) => a$.pipe(
	ofType(BookmarksActionTypes.SyncStagedGroups),
	Rx.switchMap(() => pipe(
		getStagedBookmarksGroupsFromLocalStorage,
		T.map(flow(
			O.fromEither,
			O.flatten,
			O.getOrElse<Array<StagedBookmarksGroup>>(() => []),
			setAllStagedBookmarksGroups,
		)),
		fromTask,
	)),
);

const addBookmarksEpic: Epic = (a$) => a$.pipe(
	ofType(BookmarksActionTypes.AddBookmarks),
	// TODO failing because, whereas switchMap does allow returning array, it does
	// not (per typings) allow returning an array within an observable, which is
	// what we want to do given the promise in this flow
	//Rx.switchMap(({ payload: xs }) => pipe(
	//	xs,
	//	asArray,
	//	A.map(untransform),
	//	saveBookmarksToNative,
	//	T.map(E.fold(
	//		() => [],
	//		() => [
	//			syncBookmarks.request(),
	//			setPage(Page.Search),
	//		],
	//	)),
	//	fromTask,
	//	r$ => r$.pipe(
	//		// TODO pretty sure this is not actually working...
	//		// Rx.mergeMap(x => of(...x)),
	//		//
	//		x => x,
	//	),
	//)),

	// array - OK
	Rx.switchMap(() => [setPage(Page.Search)]),

	// observable single - OK
	Rx.switchMap(() => of(setPage(Page.Search))),

	// observable array - FAIL
	Rx.switchMap(() => of([setPage(Page.Search)])),
);

// export const addBookmark = (bookmark: LocalBookmarkUnsaved): ThunkAC<Promise<void>> => async (dispatch) => {
// 	await dispatch(addManyBookmarks([bookmark]));
// };

// export const addManyBookmarks = (bookmarks: LocalBookmarkUnsaved[]): ThunkAC<Promise<void>> => async (dispatch) => {
// 	await saveBookmarksToNative(bookmarks.map(untransform));
// 	dispatch(syncBookmarks.request());

// 	dispatch(setPage(Page.Search));
// };

export const updateBookmark = (bookmark: LocalBookmark): ThunkAC<Promise<void>> => async (dispatch) => {
	await updateBookmarksToNative([untransform(bookmark)]);
	dispatch(syncBookmarks.request());

	dispatch(setPage(Page.Search));
};

export const deleteBookmark = (): ThunkAC<Promise<void>> => async (dispatch, getState) => {
	const { bookmarkDeleteId } = getState().bookmarks;

	if (O.isSome(bookmarkDeleteId)) {
		const bookmarkId = bookmarkDeleteId.value;

		await deleteBookmarksFromNative([bookmarkId]);
		dispatch(syncBookmarks.request());
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

const bookmarksEpic = combineEpics(
	syncBookmarksAttemptEpic,
	syncBookmarksFailedEpic,
	openBookmarkAttemptEpic,
	openBookmarkSuccessEpic,
	openAllFilteredBookmarksEpic,
	addAllStagedBookmarksEpic,
	deleteStagedBookmarkEpic,
	syncStagedGroupsEpic,
);

export default bookmarksEpic;

