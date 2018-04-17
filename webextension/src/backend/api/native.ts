import { sendNativeMessage, NativeRequestMethod } from './protocol';
import { compareAgainstMinimum } from 'Modules/semantic-versioning';
import { MINIMUM_BINARY_VERSION } from 'Modules/config';

// Check for runtime errors
export const checkRuntimeErrors = () => new Promise((resolve) => {
	resolve((chrome.runtime.lastError && chrome.runtime.lastError.message) || false);
});

// Ensure binary version is equal to or newer than what we're expecting, but on
// the same major version (semantic versioning)
export const checkBinaryVersion = () =>
	sendNativeMessage(NativeRequestMethod.OPTIONS, undefined)
		.then(res => (
			res &&
			res.success &&
			res.binaryVersion &&
			compareAgainstMinimum(MINIMUM_BINARY_VERSION, res.binaryVersion)
		));

export const getBookmarks = () =>
	sendNativeMessage(NativeRequestMethod.GET, undefined);

export const saveBookmark = (bookmark: RemoteBookmarkUnsaved) =>
	sendNativeMessage(NativeRequestMethod.POST, bookmark);

export const updateBookmark = (bookmark: RemoteBookmarkUnsaved) =>
	sendNativeMessage(NativeRequestMethod.PUT, bookmark);
