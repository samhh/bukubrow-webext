/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { constant } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as EO from '~/modules/eitherOption';
import { onTabActivity } from '~/modules/comms/browser';
import { checkBinaryVersionFromNative, HostVersionCheckResult } from '~/modules/comms/native';
import { getActiveTheme, Theme } from '~/modules/settings';
import { ThunkAC, initAutoStoreSync } from '~/store';
import { setLimitNumRendered, setFocusedBookmarkIndex } from '~/store/bookmarks/actions';
import { setActiveTheme } from '~/store/user/actions';
import { setSearchFilter } from '~/store/input/actions';
import { addPermanentError } from '~/store/notices/epics';
import { syncStagedBookmarksGroups, syncBookmarks } from '~/store/bookmarks/epics';
import { syncBrowserInfo } from '~/store/browser/epics';
import { getWeightedLimitedFilteredBookmarks } from '~/store/selectors';

const onLoadPreComms = (): ThunkAC => (dispatch) => {
	getActiveTheme()
		.then(EO.getOrElse(constant<Theme>(Theme.Light)))
		.then((theme) => {
			dispatch(setActiveTheme(theme));
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

	dispatch(setFocusedBookmarkIndex(filteredBookmarks.length ? O.some(0) : O.none));
};

