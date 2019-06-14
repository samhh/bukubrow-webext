import { Just, Nothing } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { onTabActivity } from 'Comms/browser';
import { checkBinaryVersionFromNative, HostVersionCheckResult } from 'Comms/native';
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

	const versionRes = await checkBinaryVersionFromNative();

	switch (versionRes) {
		case HostVersionCheckResult.Okay:
			dispatch(onLoadPostComms());
			break;

		case HostVersionCheckResult.HostTooNew:
			dispatch(addPermanentError('The WebExtension is outdated (relative to the host).'));
			break;

		case HostVersionCheckResult.HostOutdated:
			dispatch(addPermanentError('The host is outdated.'));
			break;

		case HostVersionCheckResult.NoComms:
			dispatch(addPermanentError('The host could not be found.'));
			break;

		case HostVersionCheckResult.UnknownError:
			dispatch(addPermanentError('An unknown error occurred.'));
			break;
	}
};

export const setSearchFilterWithResets = (filter: string): ThunkAC => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getWeightedLimitedFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(NonEmptyList.isNonEmpty(filteredBookmarks) ? Just(0) : Nothing));
};
