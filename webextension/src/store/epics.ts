import { browser } from 'webextension-polyfill-ts';
import { Just, Nothing, Maybe } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import {
	getBookmarksFromLocalStorage,
	hasTriggeredRequest,
	onTabActivity,
	checkRuntimeErrors,
	saveBookmarksToLocalStorage,
} from 'Comms/browser';
import { checkBinaryVersionFromNative, getBookmarksFromNative } from 'Comms/native';
import { getActiveTheme, Theme } from 'Modules/settings';
import { ThunkAC } from 'Store';
import {
	setAllBookmarks, setLimitNumRendered, setFocusedBookmarkIndex,
	deleteStagedBookmarksGroupBookmark, deleteStagedBookmarksGroup,
} from 'Store/bookmarks/actions';
import { setDisplayTutorialMessage, setActiveTheme, setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';
import { setSearchFilter } from 'Store/input/actions';
import { pushError } from 'Store/notices/epics';
import { syncStagedBookmarksGroups, addManyBookmarks } from 'Store/bookmarks/epics';
import { syncBrowserInfo } from 'Store/browser/epics';
import { getWeightedLimitedFilteredBookmarks, getUnlimitedFilteredBookmarks } from 'Store/selectors';
import { transform } from 'Modules/bookmarks';

const getAndSetCachedBookmarks = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const bookmarksRes = await getBookmarksFromLocalStorage().run();

	// Ensuring it's a non-empty list as the focused bookmark index relies upon it
	bookmarksRes.ifJust((bookmarks: NonEmptyList<LocalBookmark>) => {
		dispatch(setAllBookmarks(bookmarks));
		dispatch(setFocusedBookmarkIndex(Just(0)));
	});
};

export const syncBookmarks = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const res = await getBookmarksFromNative();

	Maybe.fromNullable((res && res.success && res.bookmarks) || null)
		.map(bm => bm.map(transform))
		.caseOf({
			Just: bm => saveBookmarksToLocalStorage(bm).then(() => {
				dispatch(getAndSetCachedBookmarks());
			}),
			Nothing: () => {
				const msg = 'Failed to sync bookmarks.';

				dispatch(pushError(msg));
			},
		});
};

export const onLoad = (): ThunkAC<Promise<void>> => async (dispatch) => {
	getActiveTheme().run().then((theme) => {
		dispatch(setActiveTheme(theme.orDefault(Theme.Light)));
	});

	hasTriggeredRequest().then((has) => {
		dispatch(setDisplayTutorialMessage(!has));
	});

	checkBinaryVersionFromNative().run().then((version) => {
		if (version.isLeft()) {
			const msg = 'The binary is outdated. Please download or build a more recent one.';

			dispatch(pushError(msg));
		}
	});

	checkRuntimeErrors().ifLeft((error) => {
		const msg = error.message.includes('host not found')
			? 'The binary could not be found. Please refer to the installation instructions.'
			: 'An unknown runtime error occurred.';

		dispatch(pushError(msg));
	});

	dispatch(getAndSetCachedBookmarks());
	dispatch(syncStagedBookmarksGroups());

	// Sync browser info once now on load and then again whenever there's any tab
	// activity
	dispatch(syncBrowserInfo());
	onTabActivity(() => {
		dispatch(syncBrowserInfo());
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

export const setSearchFilterWithResets = (filter: string): ThunkAC => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getWeightedLimitedFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(NonEmptyList.isNonEmpty(filteredBookmarks) ? Just(0) : Nothing));
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
