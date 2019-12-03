import * as O from 'fp-ts/lib/Option';
import { onTabActivity } from 'Comms/browser';
import { checkBinaryVersionFromNative, HostVersionCheckResult } from 'Comms/native';
import { getActiveTheme, Theme } from 'Modules/settings';
import { ThunkAC, initAutoStoreSync } from 'Store';
import { setLimitNumRendered, setFocusedBookmarkIndex, syncBookmarks, syncStagedGroups } from 'Store/bookmarks/actions';
import { requestPermanentError } from 'Store/notices/actions';
import { setActiveTheme } from 'Store/user/actions';
import { setSearchFilter } from 'Store/input/actions';
import { setPageMeta } from 'Store/browser/actions';
import { getWeightedLimitedFilteredBookmarks } from 'Store/selectors';

const onLoadPreComms = (): ThunkAC => (dispatch) => {
	getActiveTheme()
		.then(O.getOrElse((): Theme => Theme.Light))
		.then((theme) => {
			dispatch(setActiveTheme(theme));
		});
};

const onLoadPostComms = (): ThunkAC => (dispatch) => {
	// Store sync initialised here to prevent race condition with staged groups
	initAutoStoreSync();
	dispatch(syncBookmarks.request());
	dispatch(syncStagedGroups());

	// Sync browser info once now on load and then again whenever there's any tab
	// activity
	dispatch(setPageMeta.request());
	onTabActivity(() => {
		dispatch(setPageMeta.request());
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
			dispatch(requestPermanentError('The WebExtension is outdated (relative to the host).'));
			break;

		case HostVersionCheckResult.HostOutdated:
			dispatch(requestPermanentError('The host is outdated.'));
			break;

		case HostVersionCheckResult.NoComms:
			dispatch(requestPermanentError('The host could not be found.'));
			break;

		case HostVersionCheckResult.UnknownError:
			dispatch(requestPermanentError('An unknown error occurred.'));
			break;
	}
};

export const setSearchFilterWithResets = (filter: string): ThunkAC => (dispatch, getState) => {
	dispatch(setSearchFilter(filter));
	dispatch(setLimitNumRendered(true));

	const filteredBookmarks = getWeightedLimitedFilteredBookmarks(getState());

	dispatch(setFocusedBookmarkIndex(filteredBookmarks.length ? O.some(0) : O.none));
};

