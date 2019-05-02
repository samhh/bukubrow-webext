import { Just, Nothing } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { onTabActivity } from 'Comms/browser';
import { checkBinaryVersionFromNative, OutdatedVersionError } from 'Comms/native';
import { getActiveTheme, Theme } from 'Modules/settings';
import { ThunkAC, initAutoStoreSync } from 'Store';
import { setLimitNumRendered, setFocusedBookmarkIndex } from 'Store/bookmarks/actions';
import { setActiveTheme } from 'Store/user/actions';
import { setSearchFilter } from 'Store/input/actions';
import { addPermanentError } from 'Store/notices/epics';
import { syncStagedBookmarksGroups, syncBookmarks } from 'Store/bookmarks/epics';
import { syncBrowserInfo } from 'Store/browser/epics';
import { getWeightedLimitedFilteredBookmarks } from 'Store/selectors';

const onLoadPreComms = (): ThunkAC => (dispatch) => {
	getActiveTheme().run().then((theme) => {
		dispatch(setActiveTheme(theme.orDefault(Theme.Light)));
	});
};

const onLoadPostComms = (): ThunkAC => (dispatch) => {
	// Store sync initialised here to prevent race condition with staged groups
	initAutoStoreSync();
	dispatch(syncBookmarks());
	dispatch(syncStagedBookmarksGroups());

	// Sync browser info once now on load and then again whenever there's any tab
	// activity
	dispatch(syncBrowserInfo());
	onTabActivity(() => {
		dispatch(syncBrowserInfo());
	});
};

export const onLoad = (): ThunkAC<Promise<void>> => async (dispatch) => {
	dispatch(onLoadPreComms());

	const versionRes = await checkBinaryVersionFromNative().run();
	versionRes.caseOf({
		Left: (err) => {
			const msg = err instanceof OutdatedVersionError
				? 'The binary is outdated. Please download or build a more recent one.'
				: err.message.includes('host not found')
					? 'The binary could not be found. Please refer to the installation instructions.'
					: 'An unknown runtime error occurred.';

			dispatch(addPermanentError(msg));
		},
		Right: () => {
			dispatch(onLoadPostComms());
		},
	});
};

export const setSearchFilterWithResets = (filter: string): ThunkAC => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getWeightedLimitedFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(NonEmptyList.isNonEmpty(filteredBookmarks) ? Just(0) : Nothing));
};
