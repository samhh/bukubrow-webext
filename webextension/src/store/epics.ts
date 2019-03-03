import { browser } from 'webextension-polyfill-ts';
import { Just, Nothing, Maybe } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { sendBackendMessage, requestBookmarks } from 'Comms/frontend';
import { BackendResponse, onTabActivity } from 'Comms/shared';
import { getBookmarks, hasTriggeredRequest } from 'Modules/cache';
import { getActiveTheme, Theme } from 'Modules/settings';
import { ThunkActionCreator } from 'Store';
import { setAllBookmarks, setLimitNumRendered, setFocusedBookmarkIndex } from 'Store/bookmarks/actions';
import { setDisplayTutorialMessage, setActiveTheme } from 'Store/user/actions';
import { setSearchFilter } from 'Store/input/actions';
import { pushError } from 'Store/notices/epics';
import { syncBrowserInfo } from 'Store/browser/epics';
import { getWeightedLimitedFilteredBookmarks, getUnlimitedFilteredBookmarks } from 'Store/selectors';

const getAndSetCachedBookmarks = (): ThunkActionCreator => async (dispatch) => {
	const bookmarksRes = await getBookmarks().run();

	// Ensuring it's a non-empty list as the focused bookmark index relies upon it
	bookmarksRes.ifJust((bookmarks: NonEmptyList<LocalBookmark>) => {
		dispatch(setAllBookmarks(bookmarks));
		dispatch(setFocusedBookmarkIndex(Just(0)));
	});
};

const listenToBackend = (): ThunkActionCreator => (dispatch) => {
	// Respond to messages from the backend
	browser.runtime.onMessage.addListener((res: BackendResponse) => {
		if ('bookmarksUpdated' in res) {
			dispatch(getAndSetCachedBookmarks());
		}

		if ('bookmarkSaved' in res || 'bookmarkUpdated' in res || 'bookmarkDeleted' in res) {
			requestBookmarks();
		}

		if ('unknownError' in res) {
			const msg = 'An unknown error occurred.';

			dispatch(pushError(msg));
		}

		if ('cannotFindBinary' in res) {
			const msg = 'The binary could not be found. Please refer to the installation instructions.';

			dispatch(pushError(msg));
		}

		if ('outdatedBinary' in res) {
			const msg = 'The binary is outdated; please download or build a more recent one.';

			dispatch(pushError(msg));
		}
	});
};

export const onLoad = (): ThunkActionCreator => async (dispatch) => {
	getActiveTheme().run().then((theme) => {
		dispatch(setActiveTheme(theme.orDefault(Theme.Light)));
	});

	hasTriggeredRequest().then((has) => {
		dispatch(setDisplayTutorialMessage(!has));
	});

	dispatch(listenToBackend());

	sendBackendMessage({ checkBinary: true });

	dispatch(getAndSetCachedBookmarks());

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
