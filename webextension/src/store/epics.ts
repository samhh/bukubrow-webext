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
import { ThunkActionCreator } from 'Store';
import { setAllBookmarks, setLimitNumRendered, setFocusedBookmarkIndex } from 'Store/bookmarks/actions';
import { setDisplayTutorialMessage, setActiveTheme } from 'Store/user/actions';
import { setSearchFilter } from 'Store/input/actions';
import { pushError } from 'Store/notices/epics';
import { syncStagedBookmarksGroups } from 'Store/bookmarks/epics';
import { syncBrowserInfo } from 'Store/browser/epics';
import { getWeightedLimitedFilteredBookmarks, getUnlimitedFilteredBookmarks } from 'Store/selectors';
import { transform } from 'Modules/bookmarks';

const getAndSetCachedBookmarks = (): ThunkActionCreator => async (dispatch) => {
	const bookmarksRes = await getBookmarksFromLocalStorage().run();

	// Ensuring it's a non-empty list as the focused bookmark index relies upon it
	bookmarksRes.ifJust((bookmarks: NonEmptyList<LocalBookmark>) => {
		dispatch(setAllBookmarks(bookmarks));
		dispatch(setFocusedBookmarkIndex(Just(0)));
	});
};

export const syncBookmarks = (): ThunkActionCreator => async (dispatch) => {
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

export const onLoad = (): ThunkActionCreator => async (dispatch) => {
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

	// Sync browser info once now on load and then again whenever there's any tab activity
	dispatch(syncBrowserInfo());
	onTabActivity(() => {
		dispatch(syncBrowserInfo());
	});
};

export const openBookmarkAndExit = (id: LocalBookmark['id']): ThunkActionCreator => (_, getState) => {
	Maybe.fromNullable(getState().bookmarks.bookmarks.find(bm => bm.id === id))
		.ifJust((bookmark) => {
			browser.tabs.create({ url: bookmark.url });

			window.close();
		});
};

export const openAllFilteredBookmarksAndExit = (): ThunkActionCreator => (_, getState) => {
	const filteredBookmarks = getUnlimitedFilteredBookmarks(getState());

	for (const { url } of filteredBookmarks) {
		browser.tabs.create({ url });
	}

	window.close();
};

export const setSearchFilterWithResets = (filter: string): ThunkActionCreator => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getWeightedLimitedFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(NonEmptyList.isNonEmpty(filteredBookmarks) ? Just(0) : Nothing));
};
