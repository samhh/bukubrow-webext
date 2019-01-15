import { sendBackendMessage, requestBookmarks } from 'Comms/frontend';
import { BackendResponse } from 'Comms/shared';
import { getBookmarks, hasTriggeredRequest } from 'Modules/cache';
import { getActiveTheme, setTheme as setThemeInDOM } from 'Modules/theme';
import ensureValidURL from 'Modules/ensure-valid-url';
import { ThunkActionCreator } from 'Store';
import { setAllBookmarks, setLimitNumRendered, setFocusedBookmarkIndex } from 'Store/bookmarks/actions';
import { setDisplayTutorialMessage } from 'Store/user/actions';
import { setSearchFilter } from 'Store/input/actions';
import { pushError } from 'Store/notices/epics';
import { syncBrowserInfo } from 'Store/browser/epics';
import { getFilteredBookmarks, getUnlimitedFilteredBookmarks, getFocusedBookmark } from 'Store/selectors';

const getAndSetCachedBookmarks = (): ThunkActionCreator => (dispatch) => {
	getBookmarks().then((bookmarks) => {
		dispatch(setAllBookmarks(bookmarks));
		dispatch(setFocusedBookmarkIndex(bookmarks.length ? 0 : null));
	});
};

const listenToBackend = (): ThunkActionCreator => (dispatch) => {
	// Respond to messages from the backend
	chrome.runtime.onMessage.addListener((res: BackendResponse) => {
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

export const onLoad = (): ThunkActionCreator => (dispatch) => {
	getActiveTheme().then(setThemeInDOM);

	hasTriggeredRequest().then((has) => {
		dispatch(setDisplayTutorialMessage(!has));
	});

	dispatch(listenToBackend());

	sendBackendMessage({ checkBinary: true });

	dispatch(syncBrowserInfo());
	dispatch(getAndSetCachedBookmarks());
};

export const openBookmarkAndExit = (id: LocalBookmark['id']): ThunkActionCreator => (_, getState) => {
	const bookmark = getState().bookmarks.bookmarks.find(bm => bm.id === id);

	if (!bookmark) return;

	chrome.tabs.create({ url: ensureValidURL(bookmark.url) });

	window.close();
};

export const openFocusedBookmarkAndExit = (): ThunkActionCreator => (_, getState) => {
	const focusedBookmark = getFocusedBookmark(getState());

	if (focusedBookmark) {
		chrome.tabs.create({ url: ensureValidURL(focusedBookmark.url) });
	}

	window.close();
};

export const openAllFilteredBookmarksAndExit = (): ThunkActionCreator => (_, getState) => {
	const filteredBookmarks = getUnlimitedFilteredBookmarks(getState());

	filteredBookmarks
		.map(bm => bm.url)
		.forEach((url) => {
			chrome.tabs.create({ url: ensureValidURL(url) });
		});

	window.close();
};

export const setSearchFilterWithResets = (filter: string): ThunkActionCreator => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(filteredBookmarks.length ? 0 : null));
};
