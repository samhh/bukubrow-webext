import { Just, Nothing } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { onTabActivity, checkRuntimeErrors } from 'Comms/browser';
import { checkBinaryVersionFromNative } from 'Comms/native';
import { getActiveTheme, Theme } from 'Modules/settings';
import { ThunkAC } from 'Store';
import { setLimitNumRendered, setFocusedBookmarkIndex } from 'Store/bookmarks/actions';
import { setActiveTheme } from 'Store/user/actions';
import { setSearchFilter } from 'Store/input/actions';
import { pushError } from 'Store/notices/epics';
import { syncStagedBookmarksGroups, syncBookmarks } from 'Store/bookmarks/epics';
import { syncBrowserInfo } from 'Store/browser/epics';
import { getWeightedLimitedFilteredBookmarks } from 'Store/selectors';

export const onLoad = (): ThunkAC<Promise<void>> => async (dispatch) => {
	getActiveTheme().run().then((theme) => {
		dispatch(setActiveTheme(theme.orDefault(Theme.Light)));
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

	dispatch(syncBookmarks());
	dispatch(syncStagedBookmarksGroups());

	// Sync browser info once now on load and then again whenever there's any tab
	// activity
	dispatch(syncBrowserInfo());
	onTabActivity(() => {
		dispatch(syncBrowserInfo());
	});
};

export const setSearchFilterWithResets = (filter: string): ThunkAC => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getWeightedLimitedFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(NonEmptyList.isNonEmpty(filteredBookmarks) ? Just(0) : Nothing));
};
