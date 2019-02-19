import { browser } from 'webextension-polyfill-ts';
import { Just, Nothing, Maybe } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { sendBackendMessage, requestBookmarks } from 'Comms/frontend';
import { BackendResponse } from 'Comms/shared';
import { getBookmarks, hasTriggeredRequest } from 'Modules/cache';
import { getActiveTheme, setTheme as setThemeInDOM, Theme } from 'Modules/theme';
import ensureValidURL from 'Modules/ensure-valid-url';
import { ThunkActionCreator } from 'Store';
import { setAllBookmarks, setLimitNumRendered, setFocusedBookmarkIndex } from 'Store/bookmarks/actions';
import { setDisplayTutorialMessage } from 'Store/user/actions';
import { setSearchFilter } from 'Store/input/actions';
import { pushError } from 'Store/notices/epics';
import { syncBrowserInfo } from 'Store/browser/epics';
import { getFilteredBookmarks, getUnlimitedFilteredBookmarks } from 'Store/selectors';

const getAndSetCachedBookmarks = (): ThunkActionCreator => async (dispatch) => {
	const bookmarksRes = await getBookmarks();

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
	getActiveTheme().then((theme) => {
		setThemeInDOM(theme.orDefault(Theme.Light));
	});

	hasTriggeredRequest().then((has) => {
		dispatch(setDisplayTutorialMessage(!has));
	});

	dispatch(listenToBackend());

	sendBackendMessage({ checkBinary: true });

	dispatch(syncBrowserInfo());
	dispatch(getAndSetCachedBookmarks());
};

export const openBookmarkAndExit = (id: LocalBookmark['id']): ThunkActionCreator => (_, getState) => {
	Maybe.fromNullable(getState().bookmarks.bookmarks.find(bm => bm.id === id))
		.ifJust((bookmark) => {
			browser.tabs.create({ url: ensureValidURL(bookmark.url) });

			window.close();
		});
};

export const openAllFilteredBookmarksAndExit = (): ThunkActionCreator => (_, getState) => {
	const filteredBookmarks = getUnlimitedFilteredBookmarks(getState());

	filteredBookmarks
		.map(bm => ensureValidURL(bm.url))
		.forEach((url) => {
			browser.tabs.create({ url });
		});

	window.close();
};

export const setSearchFilterWithResets = (filter: string): ThunkActionCreator => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(NonEmptyList.isNonEmpty(filteredBookmarks) ? Just(0) : Nothing));
};
